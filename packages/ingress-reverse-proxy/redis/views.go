package redis

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/redirect"
	"ingress-reverse-proxy/types"
)

// View counts for the blog: how many people have read each post, shown
// under it on jungho.dev/blog.
//
//	POST /api-views/<slug>        count this reader once, answer {"slug","views"}
//	GET  /api-views?slugs=a,b,c   answer {"a":n,...} for the listed ones
//
// A reader is the presence visitor (IdentifyVisitor: IP + User-Agent), and
// the counter server keeps one view per reader per post per day. Only posts
// in the blog's own /blog/index.json are counted or reported, so a made-up
// slug never becomes a Redis key. Crawlers, and POSTs another site's page
// made a browser send, are answered and not counted. The link's writeLimit
// (config/prod-links.yaml) caps how fast one address can POST.

const (
	// listedTTL is how long the post list is trusted: a post the blog build
	// just published becomes countable within this long.
	listedTTL = 60 * time.Second
	// listedRetry is how soon a failed refresh is tried again while the last
	// good list keeps being used.
	listedRetry  = 10 * time.Second
	indexTimeout = 3 * time.Second
)

var (
	viewSlugPattern = regexp.MustCompile(`^[a-z0-9]+(-[a-z0-9]+)*$`)
	botPattern      = regexp.MustCompile(`(?i)bot|crawl|spider|slurp|headless`)

	// viewsNow is the clock; tests move it.
	viewsNow = time.Now

	postList = &slugCache{}

	indexClient = &http.Client{Timeout: indexTimeout}

	// viewFailures counts consecutive failures to reach the counter server,
	// so an outage is logged once and then every 20th time, as presence does.
	viewFailures atomic.Int64
)

var errNoPostList = errors.New("the blog's post list has never been read")

// slugCache holds the slugs in /blog/index.json.
type slugCache struct {
	mu        sync.Mutex
	slugs     map[string]bool
	fetchedAt time.Time
	retryAt   time.Time
}

// listed returns the current post list, reading it again once it is older
// than listedTTL. A failed read keeps the previous list; with no previous
// list it is an error, so a blog that is still starting is a 503 rather
// than a 404 for every post.
func (c *slugCache) listed() (map[string]bool, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	now := viewsNow()
	fresh := c.slugs != nil && now.Sub(c.fetchedAt) < listedTTL
	if fresh || (c.slugs != nil && now.Before(c.retryAt)) {
		return c.slugs, nil
	}

	slugs, err := fetchListedSlugs()
	if err != nil {
		c.retryAt = now.Add(listedRetry)
		if c.slugs != nil {
			logger.Log.Warnw("could not refresh the blog post list; keeping the last one",
				"err", err, "posts", len(c.slugs))
			return c.slugs, nil
		}
		logger.Log.Errorw("could not read the blog post list", "err", err)
		return nil, errNoPostList
	}
	c.slugs = slugs
	c.fetchedAt = now
	return c.slugs, nil
}

func fetchListedSlugs() (map[string]bool, error) {
	link, ok := redirect.Redirects["/blog"]
	if !ok {
		return nil, errors.New("no /blog route is configured")
	}
	resp, err := indexClient.Get(strings.TrimRight(link.Url, "/") + "/blog/index.json")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("index.json answered %d", resp.StatusCode)
	}
	var items []struct {
		Slug string `json:"slug"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&items); err != nil {
		return nil, fmt.Errorf("reading index.json: %w", err)
	}
	slugs := make(map[string]bool, len(items))
	for _, it := range items {
		if it.Slug != "" {
			slugs[it.Slug] = true
		}
	}
	return slugs, nil
}

// ViewsHandler answers /api-views.
func ViewsHandler(w http.ResponseWriter, r *http.Request, link *types.Config) {
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("Content-Type", "application/json")

	rest := strings.TrimPrefix(r.URL.Path, link.Route)
	switch {
	case rest == "" || rest == "/":
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			w.Header().Set("Allow", http.MethodGet)
			writeViewsError(w, http.StatusMethodNotAllowed, "use GET")
			return
		}
		listViews(w, r, link)
	default:
		if r.Method != http.MethodPost {
			w.Header().Set("Allow", http.MethodPost)
			writeViewsError(w, http.StatusMethodNotAllowed, "use POST")
			return
		}
		recordView(w, r, link, strings.TrimPrefix(rest, "/"))
	}
}

func recordView(w http.ResponseWriter, r *http.Request, link *types.Config, slug string) {
	if !viewSlugPattern.MatchString(slug) {
		writeViewsError(w, http.StatusNotFound, "not a listed post")
		return
	}
	listed, err := postList.listed()
	if err != nil {
		writeViewsError(w, http.StatusServiceUnavailable, "post list unavailable")
		return
	}
	if !listed[slug] {
		writeViewsError(w, http.StatusNotFound, "not a listed post")
		return
	}

	if botPattern.MatchString(r.Header.Get("User-Agent")) || !fromOwnPage(r) {
		counts, ok := askCounter(w, link, "VIEWS "+slug)
		if !ok {
			return
		}
		var m map[string]int64
		if err := json.Unmarshal([]byte(counts), &m); err != nil {
			badCounterReply(w, counts, err)
			return
		}
		writeViewsJSON(w, viewReply{Slug: slug, Views: m[slug]})
		return
	}

	payload, _ := json.Marshal(struct {
		Slug string `json:"slug"`
		ID   string `json:"id"`
	}{slug, IdentifyVisitor(r).ID})
	raw, ok := askCounter(w, link, "VIEW "+string(payload))
	if !ok {
		return
	}
	var v viewReply
	if err := json.Unmarshal([]byte(raw), &v); err != nil || v.Slug != slug {
		badCounterReply(w, raw, err)
		return
	}
	writeViewsJSON(w, v)
}

// fromOwnPage reports whether a POST came from a page on this host. Any page
// on the web can make its visitors' browsers send a body-less POST here
// without a CORS preflight, and each visitor brings their own address past
// the writeLimit, so only same-origin requests count. Browsers say where a
// request came from in Sec-Fetch-Site; ones too old for that still send
// Origin. A request with neither (curl) counts and is left to the writeLimit.
func fromOwnPage(r *http.Request) bool {
	if site := r.Header.Get("Sec-Fetch-Site"); site != "" {
		return site == "same-origin"
	}
	if origin := r.Header.Get("Origin"); origin != "" {
		u, err := url.Parse(origin)
		return err == nil && u.Host == r.Host
	}
	return true
}

func listViews(w http.ResponseWriter, r *http.Request, link *types.Config) {
	var asked []string
	if q := r.URL.Query().Get("slugs"); q != "" {
		asked = strings.Split(q, ",")
	}
	if len(asked) == 0 {
		writeViewsJSON(w, map[string]int64{})
		return
	}
	listed, err := postList.listed()
	if err != nil {
		writeViewsError(w, http.StatusServiceUnavailable, "post list unavailable")
		return
	}
	seen := map[string]bool{}
	var slugs []string
	for _, s := range asked {
		s = strings.TrimSpace(s)
		if listed[s] && !seen[s] {
			seen[s] = true
			slugs = append(slugs, s)
		}
	}
	if len(slugs) == 0 {
		writeViewsJSON(w, map[string]int64{})
		return
	}
	raw, ok := askCounter(w, link, "VIEWS "+strings.Join(slugs, ","))
	if !ok {
		return
	}
	var counts map[string]int64
	if err := json.Unmarshal([]byte(raw), &counts); err != nil {
		badCounterReply(w, raw, err)
		return
	}
	writeViewsJSON(w, counts)
}

type viewReply struct {
	Slug  string `json:"slug"`
	Views int64  `json:"views"`
}

// askCounter sends one line to the counter server named by the link and
// returns its reply. When it fails it has already answered the request.
func askCounter(w http.ResponseWriter, link *types.Config, line string) (string, bool) {
	u, err := url.Parse(link.Url)
	if err != nil {
		logger.Log.Errorw("api-views link url is unreadable", "url", link.Url, "err", err)
		writeViewsError(w, http.StatusServiceUnavailable, "view counter unavailable")
		return "", false
	}
	reply, err := commandAt(u.Host, line)
	if err != nil {
		n := viewFailures.Add(1)
		if n == 1 || n%20 == 0 {
			logger.Log.Errorw("cannot reach the counter server for views",
				"err", err, "consecutive_failures", n)
		}
		writeViewsError(w, http.StatusServiceUnavailable, "view counter unavailable")
		return "", false
	}
	if n := viewFailures.Swap(0); n > 0 {
		logger.Log.Infow("counter server is answering views again", "after_failures", n)
	}
	reply = strings.TrimSpace(reply)
	if strings.HasPrefix(reply, "ERR") {
		badCounterReply(w, reply, nil)
		return "", false
	}
	return reply, true
}

func badCounterReply(w http.ResponseWriter, reply string, err error) {
	logger.Log.Errorw("counter server answered views with something unusable",
		"reply", reply, "err", err)
	writeViewsError(w, http.StatusBadGateway, "view counter error")
}

func writeViewsJSON(w http.ResponseWriter, v any) {
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(v)
}

func writeViewsError(w http.ResponseWriter, status int, msg string) {
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
