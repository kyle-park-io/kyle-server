package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

// The redirect used to append the HTTP port to the HTTPS URL
// (https://jungho.dev:80/ads.txt), which no TLS server answers.
func TestRedirectToHTTPSDropsThePort(t *testing.T) {
	cases := []struct{ host, target, want string }{
		{"jungho.dev", "/ads.txt", "https://jungho.dev/ads.txt"},
		{"jungho.dev:80", "/ads.txt", "https://jungho.dev/ads.txt"},
		{"jungho.dev", "/blog/privacy?lang=en", "https://jungho.dev/blog/privacy?lang=en"},
		{"jungho.dev", "/", "https://jungho.dev/"},
	}
	for _, c := range cases {
		req := httptest.NewRequest(http.MethodGet, "http://"+c.host+c.target, nil)
		req.Host = c.host
		rec := httptest.NewRecorder()

		RedirectToHTTPS(rec, req)

		if rec.Code != http.StatusMovedPermanently {
			t.Errorf("%s%s: status %d, want 301", c.host, c.target, rec.Code)
		}
		if got := rec.Header().Get("Location"); got != c.want {
			t.Errorf("%s%s: Location %q, want %q", c.host, c.target, got, c.want)
		}
	}
}
