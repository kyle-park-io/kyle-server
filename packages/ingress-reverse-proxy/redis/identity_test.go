package redis

import (
	"net/http/httptest"
	"testing"
)

func TestIdentityIsStableAcrossRequestsFromOneVisitor(t *testing.T) {
	// The bug this replaces: the id was r.RemoteAddr, the Cloudflare edge
	// address and port, which differed on every single request. Nine
	// requests from one machine produced thirteen distinct ids.
	//
	// These two requests are the same person loading two assets of one page.
	// They arrive on different Cloudflare edges, from different ports.
	first := httptest.NewRequest("GET", "/blog", nil)
	first.RemoteAddr = "104.23.251.104:13965"
	first.Header.Set("CF-Connecting-IP", "203.0.113.9")
	first.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh) Chrome/131.0 Safari/537.36")

	second := httptest.NewRequest("GET", "/x-icon.svg", nil)
	second.RemoteAddr = "172.64.217.84:9812"
	second.Header.Set("CF-Connecting-IP", "203.0.113.9")
	second.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh) Chrome/131.0 Safari/537.36")

	a, b := IdentifyVisitor(first), IdentifyVisitor(second)
	if a.ID != b.ID {
		t.Errorf("same visitor got two ids: %q and %q", a.ID, b.ID)
	}
	if a.ID == "" {
		t.Error("id must not be empty")
	}
}

func TestTwoVisitorsGetDifferentIdentities(t *testing.T) {
	id := func(ip, ua string) string {
		r := httptest.NewRequest("GET", "/", nil)
		r.RemoteAddr = "104.23.251.104:13965" // the same edge for both
		r.Header.Set("CF-Connecting-IP", ip)
		r.Header.Set("User-Agent", ua)
		return IdentifyVisitor(r).ID
	}
	chrome := "Mozilla/5.0 (Macintosh) Chrome/131.0 Safari/537.36"

	if id("203.0.113.9", chrome) == id("198.51.100.4", chrome) {
		t.Error("different IPs must not share an id")
	}
	// Same household, laptop and phone.
	phone := "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) Safari/604.1"
	if id("203.0.113.9", chrome) == id("203.0.113.9", phone) {
		t.Error("different browsers on one IP must not share an id")
	}
}

func TestIdentityNeverLeaksTheRawAddressIntoTheID(t *testing.T) {
	// The id is what gets stored and aggregated; it must not be reversible
	// to someone's address by reading it.
	r := httptest.NewRequest("GET", "/", nil)
	r.Header.Set("CF-Connecting-IP", "203.0.113.9")
	r.Header.Set("User-Agent", "Chrome/131.0")

	v := IdentifyVisitor(r)
	if v.ID == v.IP {
		t.Fatal("the id is the raw address")
	}
	if len(v.ID) != 16 {
		t.Errorf("id length = %d, want 16 hex characters", len(v.ID))
	}
	for _, c := range v.ID {
		if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f')) {
			t.Fatalf("id is not hex: %q", v.ID)
		}
	}
}

func TestClientIPPrefersCloudflareThenForwardedThenTransport(t *testing.T) {
	cases := []struct {
		name    string
		headers map[string]string
		remote  string
		want    string
	}{
		{
			name:    "cloudflare wins",
			headers: map[string]string{"CF-Connecting-IP": "203.0.113.9", "X-Forwarded-For": "198.51.100.4"},
			remote:  "104.23.251.104:13965",
			want:    "203.0.113.9",
		},
		{
			// The left-most is the originating client; the rest is the
			// chain of proxies that carried it.
			name:    "forwarded takes the left-most entry",
			headers: map[string]string{"X-Forwarded-For": "198.51.100.4, 172.64.217.84, 10.0.0.1"},
			remote:  "104.23.251.104:13965",
			want:    "198.51.100.4",
		},
		{
			name:    "no headers falls back to the transport address, without its port",
			headers: nil,
			remote:  "104.23.251.104:13965",
			want:    "104.23.251.104",
		},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			r := httptest.NewRequest("GET", "/", nil)
			r.RemoteAddr = tc.remote
			for k, v := range tc.headers {
				r.Header.Set(k, v)
			}
			if got := clientIP(r); got != tc.want {
				t.Errorf("got %q, want %q", got, tc.want)
			}
		})
	}
}

func TestBrandsAreReadOffTheUserAgentMostSpecificFirst(t *testing.T) {
	// Every Chromium browser claims to be Chrome and Safari, and Chrome
	// claims to be Safari, so a naive Contains("Chrome") labels Edge as
	// Chrome and Contains("Safari") labels everything as Safari.
	cases := []struct{ ua, browser, os string }{
		{"Mozilla/5.0 (Windows NT 10.0) Chrome/131.0 Safari/537.36 Edg/131.0", "Edge", "Windows"},
		{"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Chrome/131.0 Safari/537.36", "Chrome", "macOS"},
		{"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/17.0 Safari/605.1", "Safari", "macOS"},
		{"Mozilla/5.0 (X11; Linux x86_64) Firefox/133.0", "Firefox", "Linux"},
		{"Mozilla/5.0 (Linux; Android 14) Chrome/131.0 Mobile Safari/537.36", "Chrome", "Android"},
		{"Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) Version/18.0 Mobile/15E148 Safari/604.1", "Safari", "iOS"},
		{"Mozilla/5.0 (Linux; Android 14) SamsungBrowser/23.0 Chrome/115 Safari/537.36", "Samsung Internet", "Android"},
		{"curl/8.5.0", "Browser", ""},
		{"", "", ""},
	}
	for _, tc := range cases {
		if got := browserName(tc.ua); got != tc.browser {
			t.Errorf("browser(%q) = %q, want %q", tc.ua, got, tc.browser)
		}
		if got := osName(tc.ua); got != tc.os {
			t.Errorf("os(%q) = %q, want %q", tc.ua, got, tc.os)
		}
	}
}
