package redis

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"gopkg.in/yaml.v3"

	"ingress-reverse-proxy/redirect"
	"ingress-reverse-proxy/types"
)

// fakeCounter stands in for the counter server: it records every line it
// is sent and answers each verb with a canned reply.
type fakeCounter struct {
	mu      sync.Mutex
	lines   []string
	replies map[string]string
	addr    string
}

func startCounter(t *testing.T, replies map[string]string) *fakeCounter {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	f := &fakeCounter{replies: replies, addr: ln.Addr().String()}
	go func() {
		for {
			c, err := ln.Accept()
			if err != nil {
				return
			}
			go func(c net.Conn) {
				defer c.Close()
				r := bufio.NewReader(c)
				for {
					line, err := r.ReadString('\n')
					if err != nil {
						return
					}
					line = strings.TrimSpace(line)
					f.mu.Lock()
					f.lines = append(f.lines, line)
					f.mu.Unlock()
					verb, arg, _ := strings.Cut(line, " ")
					reply := f.replies[verb]
					// A VIEW reply names the post it was asked about.
					if verb == "VIEW" && strings.Contains(reply, "%s") {
						var v struct{ Slug string }
						json.Unmarshal([]byte(arg), &v)
						reply = fmt.Sprintf(reply, v.Slug)
					}
					c.Write([]byte(reply + "\n"))
				}
			}(c)
		}
	}()
	t.Cleanup(func() { ln.Close() })
	return f
}

func (f *fakeCounter) seen() []string {
	f.mu.Lock()
	defer f.mu.Unlock()
	return append([]string(nil), f.lines...)
}

var defaultReplies = map[string]string{
	"VIEW":  `{"slug":"%s","views":42}`,
	"VIEWS": `{"rfq-deep-dive":42,"chain-communicator-v2":7}`,
}

// fakeBlog serves /blog/index.json and counts how often it is read.
type fakeBlog struct {
	server *httptest.Server
	hits   atomic.Int64
	mu     sync.Mutex
	slugs  []string
}

func startBlog(t *testing.T, slugs ...string) *fakeBlog {
	t.Helper()
	b := &fakeBlog{slugs: slugs}
	b.server = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/blog/index.json" {
			http.NotFound(w, r)
			return
		}
		b.hits.Add(1)
		b.mu.Lock()
		items := make([]map[string]string, len(b.slugs))
		for i, s := range b.slugs {
			items[i] = map[string]string{"slug": s, "title": s}
		}
		b.mu.Unlock()
		json.NewEncoder(w).Encode(items)
	}))
	t.Cleanup(b.server.Close)
	return b
}

func (b *fakeBlog) add(slug string) {
	b.mu.Lock()
	b.slugs = append(b.slugs, slug)
	b.mu.Unlock()
}

// setup points the "/blog" link at the blog fake, gives back an api-views
// link pointing at the counter fake, and starts from an empty post list and
// a clock the test can move.
func setup(t *testing.T, replies map[string]string) (*fakeCounter, *fakeBlog, *types.Config, *time.Time) {
	t.Helper()
	counter := startCounter(t, replies)
	blog := startBlog(t, "rfq-deep-dive", "chain-communicator-v2")
	redirect.Redirects["/blog"] = &types.Config{Name: "blog", Route: "/blog", Url: blog.server.URL}

	clock := time.Date(2026, 11, 18, 12, 0, 0, 0, time.UTC)
	viewsNow = func() time.Time { return clock }
	postList = &slugCache{}
	t.Cleanup(func() {
		viewsNow = time.Now
		postList = &slugCache{}
		delete(redirect.Redirects, "/blog")
	})

	link := &types.Config{Name: "api-views", Route: "/api-views", Url: "http://" + counter.addr}
	return counter, blog, link, &clock
}

func serveViews(link *types.Config, method, target, ua string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(method, target, nil)
	req.Header.Set("User-Agent", ua)
	req.Header.Set("CF-Connecting-IP", "203.0.113.7")
	rec := httptest.NewRecorder()
	ViewsHandler(rec, req, link)
	return rec
}

const browserUA = "Mozilla/5.0"

func TestPostCountsAListedPost(t *testing.T) {
	counter, _, link, _ := setup(t, defaultReplies)

	req := httptest.NewRequest(http.MethodPost, "/api-views/rfq-deep-dive", nil)
	req.Header.Set("User-Agent", browserUA)
	req.Header.Set("CF-Connecting-IP", "203.0.113.7")
	wantID := IdentifyVisitor(req).ID

	rec := serveViews(link, http.MethodPost, "/api-views/rfq-deep-dive", browserUA)

	if rec.Code != http.StatusOK {
		t.Fatalf("status %d, body %s", rec.Code, rec.Body)
	}
	if got := strings.TrimSpace(rec.Body.String()); got != `{"slug":"rfq-deep-dive","views":42}` {
		t.Errorf("body %s", got)
	}
	if got := rec.Header().Get("Cache-Control"); got != "no-store" {
		t.Errorf("Cache-Control %q", got)
	}
	if got := rec.Header().Get("Content-Type"); got != "application/json" {
		t.Errorf("Content-Type %q", got)
	}
	want := `VIEW {"slug":"rfq-deep-dive","id":"` + wantID + `"}`
	if got := counter.seen(); len(got) != 1 || got[0] != want {
		t.Errorf("counter saw %q, want [%q]", got, want)
	}
}

func TestABotIsAnsweredButNotCounted(t *testing.T) {
	counter, _, link, _ := setup(t, defaultReplies)

	rec := serveViews(link, http.MethodPost, "/api-views/rfq-deep-dive",
		"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")

	if rec.Code != http.StatusOK {
		t.Fatalf("status %d, body %s", rec.Code, rec.Body)
	}
	if got := strings.TrimSpace(rec.Body.String()); got != `{"slug":"rfq-deep-dive","views":42}` {
		t.Errorf("body %s", got)
	}
	if got := counter.seen(); len(got) != 1 || got[0] != "VIEWS rfq-deep-dive" {
		t.Errorf("counter saw %q, want only a VIEWS", got)
	}
}

func TestUnknownSlugIs404WithoutTouchingTheCounter(t *testing.T) {
	counter, _, link, _ := setup(t, defaultReplies)

	for _, target := range []string{
		"/api-views/not-a-post",
		"/api-views/RFQ",
		"/api-views/..%2Fx",
		"/api-views/a/b",
	} {
		rec := serveViews(link, http.MethodPost, target, browserUA)
		if rec.Code != http.StatusNotFound {
			t.Errorf("%s: status %d, want 404", target, rec.Code)
		}
		if got := rec.Header().Get("Cache-Control"); got != "no-store" {
			t.Errorf("%s: Cache-Control %q", target, got)
		}
	}
	if got := counter.seen(); len(got) != 0 {
		t.Errorf("counter saw %q, want nothing", got)
	}
}

func TestGetDropsUnlistedSlugs(t *testing.T) {
	counter, _, link, _ := setup(t, defaultReplies)

	rec := serveViews(link, http.MethodGet,
		"/api-views?slugs=rfq-deep-dive,nope,chain-communicator-v2,rfq-deep-dive", browserUA)

	if rec.Code != http.StatusOK {
		t.Fatalf("status %d, body %s", rec.Code, rec.Body)
	}
	if got := counter.seen(); len(got) != 1 || got[0] != "VIEWS rfq-deep-dive,chain-communicator-v2" {
		t.Errorf("counter saw %q", got)
	}
	var counts map[string]int64
	if err := json.Unmarshal(rec.Body.Bytes(), &counts); err != nil {
		t.Fatal(err)
	}
	if counts["rfq-deep-dive"] != 42 || counts["chain-communicator-v2"] != 7 {
		t.Errorf("body %v", counts)
	}
}

func TestGetWithNoListedSlugsAnswersEmpty(t *testing.T) {
	counter, _, link, _ := setup(t, defaultReplies)

	for _, target := range []string{"/api-views?slugs=nope", "/api-views"} {
		rec := serveViews(link, http.MethodGet, target, browserUA)
		if rec.Code != http.StatusOK || strings.TrimSpace(rec.Body.String()) != "{}" {
			t.Errorf("%s: %d %s, want 200 {}", target, rec.Code, rec.Body)
		}
	}
	if got := counter.seen(); len(got) != 0 {
		t.Errorf("counter saw %q, want nothing", got)
	}
}

func TestWrongMethodIs405(t *testing.T) {
	_, _, link, _ := setup(t, defaultReplies)

	rec := serveViews(link, http.MethodGet, "/api-views/rfq-deep-dive", browserUA)
	if rec.Code != http.StatusMethodNotAllowed || rec.Header().Get("Allow") != http.MethodPost {
		t.Errorf("GET on a post: %d Allow %q", rec.Code, rec.Header().Get("Allow"))
	}
	rec = serveViews(link, http.MethodPost, "/api-views", browserUA)
	if rec.Code != http.StatusMethodNotAllowed || rec.Header().Get("Allow") != http.MethodGet {
		t.Errorf("POST on the list: %d Allow %q", rec.Code, rec.Header().Get("Allow"))
	}
}

func TestCounterDownIs503(t *testing.T) {
	_, _, link, _ := setup(t, defaultReplies)
	link.Url = "http://127.0.0.1:1"

	rec := serveViews(link, http.MethodPost, "/api-views/rfq-deep-dive", browserUA)
	if rec.Code != http.StatusServiceUnavailable {
		t.Fatalf("status %d, want 503", rec.Code)
	}
	if got := strings.TrimSpace(rec.Body.String()); got != `{"error":"view counter unavailable"}` {
		t.Errorf("body %s", got)
	}
}

func TestCounterErrIs502(t *testing.T) {
	_, _, link, _ := setup(t, map[string]string{"VIEW": "ERR boom", "VIEWS": "ERR boom"})

	if rec := serveViews(link, http.MethodPost, "/api-views/rfq-deep-dive", browserUA); rec.Code != http.StatusBadGateway {
		t.Errorf("POST: status %d, want 502", rec.Code)
	}
	if rec := serveViews(link, http.MethodGet, "/api-views?slugs=rfq-deep-dive", browserUA); rec.Code != http.StatusBadGateway {
		t.Errorf("GET: status %d, want 502", rec.Code)
	}
}

func TestListedSlugsAreRefreshedAfter60Seconds(t *testing.T) {
	_, blog, link, clock := setup(t, defaultReplies)

	serveViews(link, http.MethodPost, "/api-views/rfq-deep-dive", browserUA)
	serveViews(link, http.MethodPost, "/api-views/rfq-deep-dive", browserUA)
	if got := blog.hits.Load(); got != 1 {
		t.Fatalf("index.json read %d times for two requests, want 1", got)
	}

	blog.add("new-post")
	if rec := serveViews(link, http.MethodPost, "/api-views/new-post", browserUA); rec.Code != http.StatusNotFound {
		t.Errorf("new post inside the 60 s: status %d, want 404 until the refresh", rec.Code)
	}
	*clock = clock.Add(61 * time.Second)
	if rec := serveViews(link, http.MethodPost, "/api-views/new-post", browserUA); rec.Code != http.StatusOK {
		t.Errorf("new post after 61 s: status %d, want 200", rec.Code)
	}
	if got := blog.hits.Load(); got != 2 {
		t.Errorf("index.json read %d times, want 2", got)
	}
}

func TestBlogUnreachableBeforeTheFirstFetchIs503(t *testing.T) {
	counter, _, link, _ := setup(t, defaultReplies)
	redirect.Redirects["/blog"] = &types.Config{Name: "blog", Route: "/blog", Url: "http://127.0.0.1:1"}

	rec := serveViews(link, http.MethodPost, "/api-views/rfq-deep-dive", browserUA)
	if rec.Code != http.StatusServiceUnavailable {
		t.Fatalf("status %d, want 503", rec.Code)
	}
	if got := strings.TrimSpace(rec.Body.String()); got != `{"error":"post list unavailable"}` {
		t.Errorf("body %s", got)
	}
	if got := counter.seen(); len(got) != 0 {
		t.Errorf("counter saw %q, want nothing", got)
	}
}

func TestALaterBlogOutageKeepsTheLastList(t *testing.T) {
	_, blog, link, clock := setup(t, defaultReplies)

	serveViews(link, http.MethodPost, "/api-views/rfq-deep-dive", browserUA)
	blog.server.Close()
	*clock = clock.Add(61 * time.Second)

	if rec := serveViews(link, http.MethodPost, "/api-views/rfq-deep-dive", browserUA); rec.Code != http.StatusOK {
		t.Errorf("status %d after the blog went away, want 200 from the last list", rec.Code)
	}
}

func TestProdLinksSendViewsToTheCounterServer(t *testing.T) {
	data, err := os.ReadFile("../config/prod-links.yaml")
	if err != nil {
		t.Fatal(err)
	}
	var configs types.Configs
	if err := yaml.Unmarshal(data, &configs); err != nil {
		t.Fatal(err)
	}
	links := map[string]types.Config{}
	for _, l := range configs.List {
		links[l.Name] = l
	}
	views, ok := links["api-views"]
	if !ok {
		t.Fatal("prod-links.yaml has no api-views link")
	}
	if views.Route != "/api-views" || views.Url != links["redis-tcp"].Url {
		t.Errorf("api-views is %+v, want route /api-views and the redis-tcp url %s", views, links["redis-tcp"].Url)
	}
	if views.WriteLimit == nil || *views.WriteLimit != (types.RateLimit{Burst: 20, Every: 30 * time.Second}) {
		t.Errorf("api-views writeLimit = %+v, want burst 20 every 30s", views.WriteLimit)
	}
}

// TestViewsAgainstALocalCounterServer checks the wire between this handler
// and the real counter server (kyle-db, db/redis/src). It runs only when
// VIEWS_COUNTER_ADDR names one, e.g. after `APP_ENV=dev go run .` there:
//
//	VIEWS_COUNTER_ADDR=localhost:3005 go test ./redis/ -run AgainstALocal -v
func TestViewsAgainstALocalCounterServer(t *testing.T) {
	addr := os.Getenv("VIEWS_COUNTER_ADDR")
	if addr == "" {
		t.Skip("set VIEWS_COUNTER_ADDR to run against a real counter server")
	}
	_, _, link, _ := setup(t, defaultReplies)
	link.Url = "http://" + addr

	post := func(ip, ua string) string {
		req := httptest.NewRequest(http.MethodPost, "/api-views/rfq-deep-dive", nil)
		req.Header.Set("User-Agent", ua)
		req.Header.Set("CF-Connecting-IP", ip)
		rec := httptest.NewRecorder()
		ViewsHandler(rec, req, link)
		if rec.Code != http.StatusOK {
			t.Fatalf("POST from %s answered %d %s", ip, rec.Code, rec.Body)
		}
		return strings.TrimSpace(rec.Body.String())
	}

	for i := 0; i < 2; i++ {
		if got := post("203.0.113.7", browserUA); got != `{"slug":"rfq-deep-dive","views":1}` {
			t.Fatalf("first visitor, read %d: %s", i, got)
		}
	}
	if got := post("203.0.113.8", browserUA); got != `{"slug":"rfq-deep-dive","views":2}` {
		t.Errorf("second visitor: %s", got)
	}
	if got := post("203.0.113.9", "Googlebot/2.1"); got != `{"slug":"rfq-deep-dive","views":2}` {
		t.Errorf("crawler: %s, want the count unchanged", got)
	}

	rec := serveViews(link, http.MethodGet, "/api-views?slugs=rfq-deep-dive,nope", browserUA)
	if got := strings.TrimSpace(rec.Body.String()); got != `{"rfq-deep-dive":2}` {
		t.Errorf("GET answered %d %s", rec.Code, got)
	}
}

// postFrom sends POST /api-views/rfq-deep-dive to jungho.dev from a browser,
// with the fetch metadata a browser adds: Sec-Fetch-Site (empty = left out)
// and Origin (empty = left out).
func postFrom(link *types.Config, site, origin string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodPost, "/api-views/rfq-deep-dive", nil)
	req.Host = "jungho.dev"
	req.Header.Set("User-Agent", browserUA)
	if site != "" {
		req.Header.Set("Sec-Fetch-Site", site)
	}
	if origin != "" {
		req.Header.Set("Origin", origin)
	}
	rec := httptest.NewRecorder()
	ViewsHandler(rec, req, link)
	return rec
}

// Any page on the web can make its visitors' browsers send this POST (a
// body-less POST needs no CORS preflight), and each visitor brings their own
// address past the per-address writeLimit. Only the blog's own pages count.
func TestAPostFromAnotherSiteIsAnsweredButNotCounted(t *testing.T) {
	cases := []struct{ name, site, origin string }{
		{"cross-site", "cross-site", "https://elsewhere.example"},
		{"same-site subdomain", "same-site", "https://other.jungho.dev"},
		{"no fetch metadata, foreign Origin", "", "https://elsewhere.example"},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			counter, _, link, _ := setup(t, defaultReplies)
			rec := postFrom(link, c.site, c.origin)
			if rec.Code != http.StatusOK {
				t.Fatalf("status %d, body %s", rec.Code, rec.Body)
			}
			if got := strings.TrimSpace(rec.Body.String()); got != `{"slug":"rfq-deep-dive","views":42}` {
				t.Errorf("body %s", got)
			}
			if got := counter.seen(); len(got) != 1 || got[0] != "VIEWS rfq-deep-dive" {
				t.Errorf("counter saw %q, want only a VIEWS", got)
			}
		})
	}
}

func TestAPostFromTheBlogItselfCounts(t *testing.T) {
	cases := []struct{ name, site, origin string }{
		{"same-origin fetch", "same-origin", "https://jungho.dev"},
		{"no fetch metadata, own Origin", "", "https://jungho.dev"},
		{"no fetch metadata, no Origin", "", ""},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			counter, _, link, _ := setup(t, defaultReplies)
			rec := postFrom(link, c.site, c.origin)
			if rec.Code != http.StatusOK {
				t.Fatalf("status %d, body %s", rec.Code, rec.Body)
			}
			if got := counter.seen(); len(got) != 1 || !strings.HasPrefix(got[0], "VIEW {") {
				t.Errorf("counter saw %q, want one VIEW", got)
			}
		})
	}
}
