package handlers

import (
	"net/http"

	"ingress-reverse-proxy/logger"
)

func BasicHandler(w http.ResponseWriter, r *http.Request) {
	// request
	logger.Log.Info("host: ", r.Host)
	logger.Log.Info("url: ", r.URL.String())
	logger.Log.Info("path: ", r.URL.Path)
	logger.Log.Info("query: ", r.URL.Query())

	// response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Hello, this is basic HTTP server!"))
}
