package main

import (
	"fmt"
	"ingress-proxy/assets"
	"ingress-proxy/constants"
	"ingress-proxy/handlers"
	"ingress-proxy/logger"
	"ingress-proxy/middleware"
	"ingress-proxy/redirect"
	"ingress-proxy/tls"
	"ingress-proxy/utils"
	"net/http"
)

func main() {
	// logger
	logger.InitLogger()
	logger.Log.Info("hi! i'm kyle!")

	env := "prod"
	switch env {
	case "dev":
		// HTTP server
		httpRedirectMux := http.NewServeMux()
		httpRedirectMux.HandleFunc("/", handlers.ProxyHandler)

		logger.Log.Info("Starting HTTP server on port:", constants.DevHTTPPort)
		err := http.ListenAndServe(fmt.Sprintf(":%d", constants.DevHTTPPort), httpRedirectMux)
		if err != nil {
			logger.Log.Fatal("Failed to start server: ", err)
		}

	case "prod-dev":
		// HTTP server
		httpRedirectMux := http.NewServeMux()
		httpRedirectMux.HandleFunc("/", handlers.BasicHandler)

		logger.Log.Info("Starting HTTP server on port:", constants.HTTPPort)
		err := http.ListenAndServe(fmt.Sprintf(":%d", constants.HTTPPort), httpRedirectMux)
		if err != nil {
			logger.Log.Fatal("Failed to start server: ", err)
		}

	case "prod":
		// tls
		err := tls.CheckTLS()
		if err != nil {
			logger.Log.Fatal("Failed to start server: ", err)
		}

		// link
		link, err := utils.LoadLinksConf(constants.Links)
		if err != nil {
			logger.Log.Fatal("Failed to start server: ", err)
		}
		for _, l := range link.List {
			lCopy := l
			redirect.Redirects[l.Route] = &lCopy
		}

		// cache
		err = assets.InitCache()
		if err != nil {
			logger.Log.Fatal("Failed to start server: ", err)
		}

		// HTTP server
		httpRedirectMux := http.NewServeMux()
		httpRedirectMux.HandleFunc("/", handlers.RedirectToHTTPS)
		go func() {
			logger.Log.Info("Starting HTTP server on port:", constants.HTTPPort)
			err := http.ListenAndServe(fmt.Sprintf(":%d", constants.HTTPPort), httpRedirectMux)
			if err != nil {
				logger.Log.Fatal("Failed to start server: ", err)
			}
		}()

		// HTTPS server
		httpsMux := http.NewServeMux()
		httpsMux.HandleFunc("/", handlers.MainHandler)
		// set middleware
		enhancedMux := middleware.Middleware(httpsMux)
		logger.Log.Info("Starting HTTPS server on port:", constants.HTTPSPort)
		// enhancedMux
		err = http.ListenAndServeTLS(fmt.Sprintf(":%d", constants.HTTPSPort), constants.SSL_CERT_FILE, constants.SSL_KEY_FILE, enhancedMux)
		if err != nil {
			logger.Log.Fatal("Failed to start server: ", err)
		}

	default:
		logger.Log.Fatal("check env value!")
	}
}
