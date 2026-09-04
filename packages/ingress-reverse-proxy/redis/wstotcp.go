package redis

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/types"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Timings for the websocket itself, distinct from the presence refresh beat.
// The read deadline is longer than the ping period so a client has two
// chances to answer before being hung up on.
const (
	pingPeriod   = 25 * time.Second
	readTimeout  = 60 * time.Second
	writeTimeout = 10 * time.Second
)

// connections is the set of open websockets, and it is only ever used to
// answer "how many". Each connection owns its own goroutines and its own
// writes; nothing is broadcast from outside.
var connections sync.Map

func connectionCount() int {
	n := 0
	connections.Range(func(_, _ any) bool {
		n++
		return true
	})
	return n
}

// WSToTCPHandler serves one reader's presence websocket.
//
// The previous version ended with `for msg := range GlobalLogChannel`, a
// channel shared by every connection. That had three consequences: the
// handler never returned, so its deferred cleanup never ran when a reader
// closed the tab; each message went to exactly one of the waiting handlers,
// which then wrote it to everyone; and because it wrote the same bytes to
// everyone, no part of a message could be about the reader receiving it.
//
// Now the handler owns the connection for as long as it is open, sends that
// reader their own view, and cleans up on the way out.
func WSToTCPHandler(w http.ResponseWriter, r *http.Request, link *types.Config) {
	visitor := IdentifyVisitor(r)
	// The page being read, passed by the client as ?path=. It is display
	// data for the hover card and nothing routes on it.
	path := r.URL.Query().Get("path")
	if path == "" {
		path = "/"
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		// Upgrade has already written its own error response; writing a
		// second one here logged "superfluous WriteHeader" on every failure.
		logger.Log.Warnw("websocket upgrade failed", "err", err, "visitor", visitor.ID)
		return
	}

	connectedAt := time.Now()
	connections.Store(conn, true)
	logger.Log.Infow("presence connected",
		"visitor", visitor.ID,
		"country", visitor.Country,
		"browser", visitor.Browser,
		"path", path,
		"websockets", connectionCount(),
	)

	// One writer goroutine per connection. gorilla/websocket allows exactly
	// one concurrent writer, and both the presence updates and the pings are
	// writes, so they have to come from the same goroutine.
	done := make(chan struct{})
	var closeOnce sync.Once
	stop := func() { closeOnce.Do(func() { close(done) }) }

	defer func() {
		stop()
		connections.Delete(conn)
		conn.Close()

		// Stop counting them now rather than letting the entry age out.
		if err := DropVisitor(visitor.ID); err != nil {
			logger.Log.Debugw("could not drop visitor on disconnect",
				"visitor", visitor.ID, "err", err)
		}
		logger.Log.Infow("presence disconnected",
			"visitor", visitor.ID,
			"held_for", time.Since(connectedAt).Round(time.Second).String(),
			"websockets", connectionCount(),
		)
	}()

	conn.SetReadDeadline(time.Now().Add(readTimeout))
	conn.SetPongHandler(func(string) error {
		// The deadline is per connection now. It used to be a single
		// package-level timestamp shared by every reader on the site, which
		// meant nothing once more than one person was here.
		return conn.SetReadDeadline(time.Now().Add(readTimeout))
	})

	go writeLoop(conn, visitor, path, connectedAt, done)
	go refreshLoop(visitor, path, done)

	// Read until the reader goes away. This is what makes a closed tab
	// register immediately: the read fails, this returns, and the deferred
	// cleanup above runs.
	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			if websocket.IsUnexpectedCloseError(err,
				websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				logger.Log.Debugw("websocket closed unexpectedly",
					"visitor", visitor.ID, "err", err)
			}
			return
		}
	}
}

// writeLoop sends this reader their presence view, and pings to keep the
// connection alive.
func writeLoop(
	conn *websocket.Conn,
	visitor Visitor,
	path string,
	connectedAt time.Time,
	done <-chan struct{},
) {
	you := &You{
		Country: visitor.Country,
		Browser: visitor.Browser,
		OS:      visitor.OS,
		IP:      visitor.IP,
		Since:   connectedAt.Unix(),
	}

	send := func() bool {
		snapshot := Latest()
		payload, err := json.Marshal(Presence{
			Count:     snapshot.Count,
			Countries: snapshot.Countries,
			Pages:     snapshot.Pages,
			You:       you,
		})
		if err != nil {
			logger.Log.Errorw("could not encode presence", "err", err)
			return true
		}
		conn.SetWriteDeadline(time.Now().Add(writeTimeout))
		return conn.WriteMessage(websocket.TextMessage, payload) == nil
	}

	// Answer immediately rather than making a new reader wait a whole tick
	// to see anything.
	if !send() {
		conn.Close()
		return
	}

	updates := time.NewTicker(pollInterval)
	defer updates.Stop()
	pings := time.NewTicker(pingPeriod)
	defer pings.Stop()

	for {
		select {
		case <-done:
			return
		case <-updates.C:
			if !send() {
				conn.Close()
				return
			}
		case <-pings.C:
			conn.SetWriteDeadline(time.Now().Add(writeTimeout))
			if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				conn.Close()
				return
			}
		}
	}
}

// refreshLoop keeps this visitor's entry from expiring while they are here.
func refreshLoop(visitor Visitor, path string, done <-chan struct{}) {
	touch := func() {
		if err := TouchVisitor(visitor, path); err != nil {
			logger.Log.Debugw("could not refresh visitor",
				"visitor", visitor.ID, "err", err)
		}
	}

	// Immediately, so a new reader is counted on arrival rather than one
	// refresh interval later.
	touch()

	ticker := time.NewTicker(refreshInterval)
	defer ticker.Stop()
	for {
		select {
		case <-done:
			return
		case <-ticker.C:
			touch()
		}
	}
}
