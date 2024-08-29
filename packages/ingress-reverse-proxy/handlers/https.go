package handlers

import (
	"fmt"
	"ingress-reverse-proxy/constants"
	"ingress-reverse-proxy/logger"
	"net/http"
)

func RedirectToHTTPS(w http.ResponseWriter, r *http.Request) {
	logger.Log.Info("redirect http to https")

	httpsURL := fmt.Sprintf("https://%s:%d%s", r.Host, constants.HTTPPort, r.URL.String())
	logger.Log.Info(httpsURL)
	http.Redirect(w, r, httpsURL, http.StatusMovedPermanently)
}
