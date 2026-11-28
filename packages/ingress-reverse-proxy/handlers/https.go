package handlers

import (
	"net"
	"net/http"

	"ingress-reverse-proxy/logger"
)

// RedirectToHTTPS sends a plain-HTTP request to the same host and path over
// HTTPS on the default port. It used to build the target from
// constants.HTTPPort, so http://jungho.dev/ads.txt answered
// https://jungho.dev:80/ads.txt, which no TLS server listens on (checked
// 2026-11-28: curl fails with "wrong version number"). Any port in the
// request's Host is dropped for the same reason.
func RedirectToHTTPS(w http.ResponseWriter, r *http.Request) {
	host := r.Host
	if h, _, err := net.SplitHostPort(host); err == nil {
		host = h
	}
	httpsURL := "https://" + host + r.URL.RequestURI()
	logger.Log.Info("redirect http to https: ", httpsURL)
	http.Redirect(w, r, httpsURL, http.StatusMovedPermanently)
}
