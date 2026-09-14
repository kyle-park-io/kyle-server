package redirect

import (
	"net"
	"net/http"
	"net/netip"
	"strings"
)

// cloudflareRanges are Cloudflare's edge addresses, from
// https://api.cloudflare.com/client/v4/ips (checked 2026-09-15). The list
// changes rarely; a missing range only means visitors behind it are limited
// by the edge address they share instead of their own.
var cloudflareRanges = mustPrefixes(
	"173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
	"141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20",
	"197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13",
	"104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22",
	"2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32",
	"2405:8100::/32", "2a06:98c0::/29", "2c0f:f248::/32",
)

func mustPrefixes(cidrs ...string) []netip.Prefix {
	out := make([]netip.Prefix, 0, len(cidrs))
	for _, c := range cidrs {
		out = append(out, netip.MustParsePrefix(c))
	}
	return out
}

func fromCloudflare(addr netip.Addr) bool {
	addr = addr.Unmap()
	for _, p := range cloudflareRanges {
		if p.Contains(addr) {
			return true
		}
	}
	return false
}

// ClientIP returns the visitor's address.
//
// Proxied traffic reaches the pod from a Cloudflare edge address and carries
// the visitor in CF-Connecting-IP. The ingress node also accepts connections
// that bypass Cloudflare, and on those the header is whatever the client chose
// to send, so it is only believed when the connection itself comes from
// Cloudflare. Otherwise the connection's own address is used.
func ClientIP(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		host = r.RemoteAddr
	}
	remote, err := netip.ParseAddr(strings.Trim(host, "[]"))
	if err != nil {
		return host
	}

	if fromCloudflare(remote) {
		if visitor, err := netip.ParseAddr(strings.TrimSpace(r.Header.Get("CF-Connecting-IP"))); err == nil {
			return visitor.Unmap().String()
		}
	}
	return remote.Unmap().String()
}
