package redirect

import (
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"
	"time"

	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/types"
)

func init() { logger.InitLogger() }

type fakeClock struct{ t time.Time }

func (c *fakeClock) now() time.Time          { return c.t }
func (c *fakeClock) advance(d time.Duration) { c.t = c.t.Add(d) }

func TestWriteLimiterBurstAndRefill(t *testing.T) {
	clock := &fakeClock{t: time.Unix(1_700_000_000, 0)}
	l := newWriteLimiter(types.RateLimit{Burst: 3, Every: time.Minute}, clock.now)

	for i := 0; i < 3; i++ {
		if ok, _ := l.allow("a"); !ok {
			t.Fatalf("write %d within the burst was refused", i+1)
		}
	}
	ok, wait := l.allow("a")
	if ok {
		t.Fatal("write past the burst was allowed")
	}
	if wait != time.Minute {
		t.Fatalf("wait = %v, want 1m", wait)
	}

	if ok, _ := l.allow("b"); !ok {
		t.Fatal("another address shares the first address's allowance")
	}

	clock.advance(30 * time.Second)
	if ok, wait := l.allow("a"); ok || wait != 30*time.Second {
		t.Fatalf("after 30s: ok=%v wait=%v, want refused with 30s left", ok, wait)
	}

	clock.advance(30 * time.Second)
	if ok, _ := l.allow("a"); !ok {
		t.Fatal("one write should be back after a full interval")
	}
	if ok, _ := l.allow("a"); ok {
		t.Fatal("only one write should come back per interval")
	}

	clock.advance(time.Hour)
	for i := 0; i < 3; i++ {
		if ok, _ := l.allow("a"); !ok {
			t.Fatalf("allowance should refill to the burst, refused at %d", i+1)
		}
	}
	if ok, _ := l.allow("a"); ok {
		t.Fatal("allowance refilled past the burst")
	}
}

func TestWriteLimiterSweep(t *testing.T) {
	clock := &fakeClock{t: time.Unix(1_700_000_000, 0)}
	l := newWriteLimiter(types.RateLimit{Burst: 2, Every: time.Minute}, clock.now)

	for i := 0; i < sweepAt; i++ {
		l.allow("old-" + strconv.Itoa(i))
	}
	l.allow("busy")
	l.allow("busy")

	clock.advance(2 * time.Minute)
	l.allow("new")

	if _, ok := l.buckets["old-0"]; ok {
		t.Fatal("refilled addresses were not swept")
	}
	if _, ok := l.buckets["new"]; !ok {
		t.Fatal("the new address was not tracked")
	}
}

func TestClientIP(t *testing.T) {
	cases := []struct {
		name, remote, header, want string
	}{
		{"direct connection ignores a forged header", "203.0.113.7:5000", "198.51.100.1", "203.0.113.7"},
		{"cloudflare edge uses the visitor header", "172.70.1.2:443", "198.51.100.1", "198.51.100.1"},
		{"cloudflare edge without the header", "172.70.1.2:443", "", "172.70.1.2"},
		{"cloudflare edge with a garbage header", "172.70.1.2:443", "not-an-ip", "172.70.1.2"},
		{"cloudflare ipv6 edge", "[2606:4700:10::1]:443", "2001:db8::5", "2001:db8::5"},
		{"ipv4-mapped cloudflare edge", "[::ffff:104.16.0.1]:443", "198.51.100.9", "198.51.100.9"},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			r := httptest.NewRequest(http.MethodPut, "/api-quant/v1/watchlist/BTC", nil)
			r.RemoteAddr = tc.remote
			if tc.header != "" {
				r.Header.Set("CF-Connecting-IP", tc.header)
			}
			if got := ClientIP(r); got != tc.want {
				t.Fatalf("ClientIP() = %q, want %q", got, tc.want)
			}
		})
	}
}

func TestWriteAllowed(t *testing.T) {
	link := &types.Config{
		Name:       "api-quant-test",
		Route:      "/api-quant-test",
		WriteLimit: &types.RateLimit{Burst: 2, Every: time.Minute},
	}
	send := func(method, remote string) *httptest.ResponseRecorder {
		r := httptest.NewRequest(method, "/api-quant-test/v1/watchlist/BTC", nil)
		r.RemoteAddr = remote
		w := httptest.NewRecorder()
		if WriteAllowed(w, r, link) {
			w.Code = http.StatusOK
		}
		return w
	}

	for i := 0; i < 5; i++ {
		if w := send(http.MethodGet, "203.0.113.1:1"); w.Code != http.StatusOK {
			t.Fatalf("GET was limited: %d", w.Code)
		}
	}

	send(http.MethodPut, "203.0.113.1:1")
	send(http.MethodDelete, "203.0.113.1:1")
	w := send(http.MethodPut, "203.0.113.1:1")
	if w.Code != http.StatusTooManyRequests {
		t.Fatalf("third write = %d, want 429", w.Code)
	}
	if w.Header().Get("Retry-After") == "" {
		t.Fatal("429 without Retry-After")
	}
	if !strings.Contains(w.Body.String(), `"error":"Too many changes`) {
		t.Fatalf("429 body = %q, want a JSON error", w.Body.String())
	}

	if w := send(http.MethodPut, "203.0.113.2:1"); w.Code != http.StatusOK {
		t.Fatalf("a different address was limited: %d", w.Code)
	}

	public := &types.Config{Name: "blog", Route: "/blog-test"}
	r := httptest.NewRequest(http.MethodPost, "/blog-test/x", nil)
	if !WriteAllowed(httptest.NewRecorder(), r, public) {
		t.Fatal("a link without writeLimit was limited")
	}
}
