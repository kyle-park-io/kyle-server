package handlers

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/redirect"
	"ingress-reverse-proxy/types"
)

func init() { logger.InitLogger() }

// runs counts how many times TestViewWritesAreRateLimitedButReadsAreNot ran
// in this process.
var runs int

// The writeLimit on the api-views link is what stops one address from
// inflating a post's count by rotating User-Agents. It is applied in
// MainHandler, before the views handler runs, and only to writes.
func TestViewWritesAreRateLimitedButReadsAreNot(t *testing.T) {
	blog := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`[{"slug":"rfq-deep-dive"}]`))
	}))
	defer blog.Close()

	redirect.Redirects["/blog"] = &types.Config{Name: "blog", Route: "/blog", Url: blog.URL}
	// Nothing listens on port 1: the allowed requests answer 503, which is
	// fine here; what matters is which ones are refused with 429.
	redirect.Redirects["/api-views"] = &types.Config{
		Name:       "api-views",
		Route:      "/api-views",
		Url:        "http://127.0.0.1:1",
		WriteLimit: &types.RateLimit{Burst: 2, Every: time.Hour},
	}
	defer delete(redirect.Redirects, "/blog")
	defer delete(redirect.Redirects, "/api-views")

	// The limiters live as long as the process, so each run of this test
	// writes from an address no earlier run used (go test -count=2 used to
	// find the bucket already empty).
	runs++
	remote := fmt.Sprintf("198.51.100.%d:1234", runs)
	codes := []int{}
	for i := 0; i < 3; i++ {
		rec := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPost, "/api-views/rfq-deep-dive", nil)
		req.RemoteAddr = remote
		MainHandler(rec, req)
		codes = append(codes, rec.Code)
	}
	if codes[0] == http.StatusTooManyRequests || codes[1] == http.StatusTooManyRequests || codes[2] != http.StatusTooManyRequests {
		t.Errorf("three POSTs from one address answered %v, want the third alone to be 429", codes)
	}

	rec := httptest.NewRecorder()
	MainHandler(rec, httptest.NewRequest(http.MethodGet, "/api-views?slugs=rfq-deep-dive", nil))
	if rec.Code == http.StatusTooManyRequests {
		t.Errorf("a GET after the limit answered 429; reads must not be limited")
	}
}
