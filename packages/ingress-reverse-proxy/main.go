package main

import (
	"fmt"
	"net/http"

	"ingress-reverse-proxy/assets"
	"ingress-reverse-proxy/constants"
	"ingress-reverse-proxy/handlers"
	"ingress-reverse-proxy/internal/config"
	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/middleware"
	"ingress-reverse-proxy/redirect"
	"ingress-reverse-proxy/scheduler"
	"ingress-reverse-proxy/tls"
	"ingress-reverse-proxy/utils"
)

// TODO: optimize HTTP/HTTPS branching in main function
func main() {

	// config
	env := "prod"
	isServiceConnected := true
	config.SetEnv(env)

	switch env {
	case "dev":
		// HTTP server
		httpRedirectMux := http.NewServeMux()

		switch isServiceConnected {
		case false:
			httpRedirectMux.HandleFunc("/", handlers.ProxyHandler)

			logger.Log.Info("Starting HTTP server on port:", constants.DevHTTPPort)
			err := http.ListenAndServe(fmt.Sprintf(":%d", constants.DevHTTPPort), httpRedirectMux)
			if err != nil {
				logger.Log.Fatal("Failed to start server: ", err)
			}
		case true:
			// link
			link, err := utils.LoadLinksConf(constants.DevLinks)
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

			// scheduler
			scheduler.RunScheduler()

			httpRedirectMux.HandleFunc("/", handlers.MainHandler)
			// set middleware
			enhancedMux := middleware.Middleware(httpRedirectMux)

			logger.Log.Info("Starting HTTP server on port:", constants.DevHTTPPort)
			err = http.ListenAndServe(fmt.Sprintf(":%d", constants.DevHTTPPort), enhancedMux)
			if err != nil {
				logger.Log.Fatal("Failed to start server: ", err)
			}
		}

	case "prod-dev":
		// HTTP server
		httpRedirectMux := http.NewServeMux()

		switch isServiceConnected {
		case false:
			httpRedirectMux.HandleFunc("/", handlers.BasicHandler)

			logger.Log.Info("Starting HTTP server on port:", constants.HTTPPort)
			err := http.ListenAndServe(fmt.Sprintf(":%d", constants.HTTPPort), httpRedirectMux)
			if err != nil {
				logger.Log.Fatal("Failed to start server: ", err)
			}
		case true:
			// link
			link, err := utils.LoadLinksConf(constants.DevLinks)
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

			// scheduler
			scheduler.RunScheduler()

			httpRedirectMux.HandleFunc("/", handlers.MainHandler)
			// set middleware
			enhancedMux := middleware.Middleware(httpRedirectMux)

			logger.Log.Info("Starting HTTP server on port:", constants.HTTPPort)
			err = http.ListenAndServe(fmt.Sprintf(":%d", constants.HTTPPort), enhancedMux)
			if err != nil {
				logger.Log.Fatal("Failed to start server: ", err)
			}
		}

	case "prod":
		// tls
		err := tls.CheckTLS()
		if err != nil {
			logger.Log.Fatal("Failed to start server: ", err)
		}

		// link
		link, err := utils.LoadLinksConf(constants.ProdLinks)
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

		// scheduler
		scheduler.RunScheduler()

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
