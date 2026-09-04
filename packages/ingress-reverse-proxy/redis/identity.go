package redis

import (
	"crypto/sha256"
	"encoding/hex"
	"net"
	"net/http"
	"strings"
)

// A Visitor is one person, as far as the online count is concerned.
//
// The count used to be keyed on r.RemoteAddr. Behind Cloudflare that is the
// address of an edge node, not of the reader, and its port changes with
// every TCP connection - so a single page load, whose twenty-odd requests
// each landed on a different edge, arrived as twenty different "users" that
// then expired one by one. Measured on 2026-09-04: nine requests produced
// thirteen distinct members across thirteen distinct Cloudflare IPs.
//
// The identity is a hash of the real client IP and the User-Agent. Same
// person, same browser, any number of tabs and requests: one id. It is a
// hash rather than the address itself so nothing that leaves this process
// carries an IP that belongs to someone else.
type Visitor struct {
	// ID is what Redis stores. Sixteen hex characters of SHA-256.
	ID string
	// IP is the real client address. Only ever sent back to that same
	// client, as part of its own "you" block - never to anyone else.
	IP string
	// Country is Cloudflare's two-letter code, or "" when it did not say.
	Country string
	Browser string
	OS      string
}

// clientIP reads the real client address out of the proxy headers, falling
// back to the transport address when none are present (a direct request in
// development, or a health check from inside the cluster).
func clientIP(r *http.Request) string {
	if ip := strings.TrimSpace(r.Header.Get("CF-Connecting-IP")); ip != "" {
		return ip
	}
	// The left-most entry is the originating client; everything after it is
	// the chain of proxies that forwarded it.
	if fwd := r.Header.Get("X-Forwarded-For"); fwd != "" {
		if first, _, _ := strings.Cut(fwd, ","); strings.TrimSpace(first) != "" {
			return strings.TrimSpace(first)
		}
	}
	if host, _, err := net.SplitHostPort(r.RemoteAddr); err == nil {
		return host
	}
	return r.RemoteAddr
}

// IdentifyVisitor builds the Visitor for a request.
func IdentifyVisitor(r *http.Request) Visitor {
	ip := clientIP(r)
	ua := r.Header.Get("User-Agent")

	sum := sha256.Sum256([]byte(ip + "\x00" + ua))

	return Visitor{
		ID:      hex.EncodeToString(sum[:8]),
		IP:      ip,
		Country: strings.TrimSpace(r.Header.Get("CF-IPCountry")),
		Browser: browserName(ua),
		OS:      osName(ua),
	}
}

// browserName and osName read a User-Agent well enough to label it in a
// tooltip. This is deliberately not a UA parsing library: the answer is one
// word shown to one reader about their own browser, and being wrong about a
// rare browser costs nothing.
//
// Order matters. Every Chromium browser claims to be Chrome and Safari, and
// Chrome claims to be Safari, so the most specific brand has to be tested
// first and the generic ones last.
func browserName(ua string) string {
	switch {
	case ua == "":
		return ""
	case strings.Contains(ua, "Edg/"):
		return "Edge"
	case strings.Contains(ua, "OPR/"), strings.Contains(ua, "Opera"):
		return "Opera"
	case strings.Contains(ua, "SamsungBrowser"):
		return "Samsung Internet"
	case strings.Contains(ua, "Whale"):
		return "Whale"
	case strings.Contains(ua, "Firefox/"):
		return "Firefox"
	case strings.Contains(ua, "Chrome/"):
		return "Chrome"
	case strings.Contains(ua, "Safari/"):
		return "Safari"
	default:
		return "Browser"
	}
}

func osName(ua string) string {
	switch {
	case ua == "":
		return ""
	// Android before Linux: every Android UA also says Linux.
	case strings.Contains(ua, "Android"):
		return "Android"
	case strings.Contains(ua, "iPhone"), strings.Contains(ua, "iPad"):
		return "iOS"
	case strings.Contains(ua, "Mac OS X"), strings.Contains(ua, "Macintosh"):
		return "macOS"
	case strings.Contains(ua, "Windows"):
		return "Windows"
	case strings.Contains(ua, "CrOS"):
		return "ChromeOS"
	case strings.Contains(ua, "Linux"):
		return "Linux"
	default:
		return ""
	}
}
