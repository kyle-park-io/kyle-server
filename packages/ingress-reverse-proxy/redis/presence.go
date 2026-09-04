package redis

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net"
	"net/url"
	"sync/atomic"
	"time"

	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/redirect"
)

// Timings. The refresh beat must stay comfortably inside the TTL the counter
// server applies (30s): these two were both 30 seconds, so a session expired
// in the gap between one refresh and the next and the count dropped and
// recovered every half minute. Three refreshes now fit inside one TTL, so
// two can be lost before anyone disappears.
const (
	refreshInterval = 10 * time.Second
	pollInterval    = 3 * time.Second
	dialTimeout     = 2 * time.Second
	ioTimeout       = 3 * time.Second
)

// Bucket mirrors the counter server's breakdown row.
type Bucket struct {
	Key string `json:"key"`
	N   int    `json:"n"`
}

// Snapshot is what the counter server reports about everyone.
type Snapshot struct {
	Count     int      `json:"count"`
	Countries []Bucket `json:"countries"`
	Pages     []Bucket `json:"pages"`
}

// You is the part of a message that belongs to one reader alone. It carries
// that reader's own address, so it is built per connection and never
// broadcast.
type You struct {
	Country string `json:"country,omitempty"`
	Browser string `json:"browser,omitempty"`
	OS      string `json:"os,omitempty"`
	IP      string `json:"ip,omitempty"`
	Since   int64  `json:"since"`
}

// Presence is one websocket message.
type Presence struct {
	Count     int      `json:"count"`
	Countries []Bucket `json:"countries"`
	Pages     []Bucket `json:"pages"`
	You       *You     `json:"you,omitempty"`
}

// latest holds the most recent snapshot for every connection to read. One
// poller writes it; the connections only read. Before this, each websocket
// handler blocked on a shared channel and whichever one won the race
// broadcast to all the others - which meant the handler never returned, so
// its deferred cleanup never ran when a reader closed the tab.
var latest atomic.Pointer[Snapshot]

// Latest returns the most recent snapshot, or an empty one before the first
// poll has completed.
func Latest() Snapshot {
	if s := latest.Load(); s != nil {
		return *s
	}
	return Snapshot{Countries: []Bucket{}, Pages: []Bucket{}}
}

// counterAddr resolves the counter server's host:port.
func counterAddr() (string, error) {
	link, ok := redirect.Redirects["/redis-tcp"]
	if !ok {
		return "", fmt.Errorf("no /redis-tcp route is configured")
	}
	u, err := url.Parse(link.Url)
	if err != nil {
		return "", fmt.Errorf("parsing the /redis-tcp url: %w", err)
	}
	return u.Host, nil
}

// command sends one line to the counter server and returns its reply.
//
// Every call opens its own connection, which is what the previous code did
// and what the counter server's one-goroutine-per-connection design
// expects. The deadlines are new: without them a counter server that
// accepted a connection and then stopped answering held this goroutine, and
// the ticker's, for good.
func command(line string) (string, error) {
	addr, err := counterAddr()
	if err != nil {
		return "", err
	}

	conn, err := net.DialTimeout("tcp", addr, dialTimeout)
	if err != nil {
		return "", fmt.Errorf("dialing the counter server: %w", err)
	}
	defer conn.Close()

	if err := conn.SetDeadline(time.Now().Add(ioTimeout)); err != nil {
		return "", err
	}
	if _, err := conn.Write([]byte(line + "\n")); err != nil {
		return "", fmt.Errorf("writing %q: %w", line, err)
	}
	reply, err := bufio.NewReader(conn).ReadString('\n')
	if err != nil {
		return "", fmt.Errorf("reading the reply to %q: %w", line, err)
	}
	return reply, nil
}

// TouchVisitor tells the counter server that this visitor is here.
func TouchVisitor(v Visitor, path string) error {
	payload, err := json.Marshal(struct {
		ID      string `json:"id"`
		Country string `json:"country,omitempty"`
		Browser string `json:"browser,omitempty"`
		OS      string `json:"os,omitempty"`
		Path    string `json:"path,omitempty"`
	}{v.ID, v.Country, v.Browser, v.OS, path})
	if err != nil {
		return err
	}
	_, err = command("ADDUSER " + string(payload))
	return err
}

// DropVisitor removes a visitor the moment their websocket closes, so
// someone who leaves stops being counted at once rather than lingering for
// a whole TTL.
func DropVisitor(id string) error {
	_, err := command("DROPUSER " + id)
	return err
}

// PollPresence keeps `latest` up to date. It runs for the life of the
// process, and does nothing while nobody is connected.
func PollPresence() {
	ticker := time.NewTicker(pollInterval)
	defer ticker.Stop()

	var lastCount = -1
	var consecutiveFailures int

	for range ticker.C {
		if connectionCount() == 0 {
			continue
		}

		reply, err := command("REAL-TIME")
		if err != nil {
			consecutiveFailures++
			// A counter server that is down must not fill the log with one
			// line every poll. Say it once, then once a minute.
			if consecutiveFailures == 1 || consecutiveFailures%20 == 0 {
				logger.Log.Errorw("cannot reach the counter server",
					"err", err,
					"consecutive_failures", consecutiveFailures,
				)
			}
			continue
		}
		if consecutiveFailures > 0 {
			logger.Log.Infow("counter server is answering again",
				"after_failures", consecutiveFailures)
			consecutiveFailures = 0
		}

		snapshot, err := parseSnapshot(reply)
		if err != nil {
			logger.Log.Errorw("counter server sent something unreadable",
				"reply", reply, "err", err)
			continue
		}

		latest.Store(&snapshot)

		// Log the transitions, not the ticks. This used to log the count
		// once a second forever, which said nothing about what changed.
		if snapshot.Count != lastCount {
			logger.Log.Infow("online count changed",
				"from", lastCount,
				"to", snapshot.Count,
				"websockets", connectionCount(),
				"countries", snapshot.Countries,
			)
			lastCount = snapshot.Count
		}
	}
}

// parseSnapshot reads the counter server's reply.
//
// A bare number is the old protocol. The proxy and the counter server deploy
// as separate images, so for the length of a rollout one of them is always
// the old one, and a count with no breakdown is much better than no count.
func parseSnapshot(reply string) (Snapshot, error) {
	trimmed := trimSpace(reply)
	if trimmed == "" {
		return Snapshot{}, fmt.Errorf("empty reply")
	}

	if trimmed[0] == '{' {
		var s Snapshot
		if err := json.Unmarshal([]byte(trimmed), &s); err != nil {
			return Snapshot{}, err
		}
		if s.Countries == nil {
			s.Countries = []Bucket{}
		}
		if s.Pages == nil {
			s.Pages = []Bucket{}
		}
		return s, nil
	}

	var count int
	if _, err := fmt.Sscanf(trimmed, "%d", &count); err != nil {
		return Snapshot{}, fmt.Errorf("neither JSON nor a number: %q", trimmed)
	}
	return Snapshot{Count: count, Countries: []Bucket{}, Pages: []Bucket{}}, nil
}

func trimSpace(s string) string {
	start, end := 0, len(s)
	for start < end && (s[start] == ' ' || s[start] == '\n' || s[start] == '\r' || s[start] == '\t') {
		start++
	}
	for end > start && (s[end-1] == ' ' || s[end-1] == '\n' || s[end-1] == '\r' || s[end-1] == '\t') {
		end--
	}
	return s[start:end]
}
