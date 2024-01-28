package main

import (
	"fmt"
	"ingress-proxy/assets"
	"ingress-proxy/logger"
	"ingress-proxy/redirect"
	"ingress-proxy/tls"
	"ingress-proxy/utils"
	"net/http"
	"net/http/httputil"
	"net/url"
)

var (
	log = logger.InitLogger()
)

const (
	SSL_CERT_FILE = "/data/letsencrypt/live/jungho.dev/fullchain.pem"
	SSL_KEY_FILE  = "/data/letsencrypt/live/jungho.dev/privkey.pem"

	httpPort  = 80
	httpsPort = 443

	devHttpPort = 8080
)

func redirectToHTTPS(w http.ResponseWriter, r *http.Request) {
	log.Info("hi! http server!")

	httpsURL := fmt.Sprintf("https://%s:%d%s", r.Host, httpsPort, r.URL.String())
	log.Info(httpsURL)
	http.Redirect(w, r, httpsURL, http.StatusMovedPermanently)
}

func testProxy(w http.ResponseWriter, r *http.Request) {
	// w.Write([]byte("Hello, this is HTTPS server!"))

	log.Info(r.Host)
	log.Info(r.URL.String())
	log.Info(r.URL.Path)

	// ctx := r.Context()
	// reverseproxy.ServeReverseProxy(ctx, w, r)

	// urlPath := r.URL.Path
	// pathPrefix, pathSurfix := utils.SplitPath(urlPath)
	// log.Sugar().Info(pathSurfix)

	targetURL := "http://localhost:8081"
	u, err := url.Parse(targetURL)
	if err != nil {
		log.Sugar().Errorf("%s", err)
		return
	}
	rp := httputil.NewSingleHostReverseProxy(u)

	originalDirector := rp.Director
	// Director 함수를 오버라이드
	rp.Director = func(req *http.Request) {
		// 원래 Director 함수 호출
		originalDirector(req)
		// 요청의 경로를 404로 변경
		req.Host = u.Host
		req.URL.Path = "/404"
		req.URL.Host = u.Host
		req.URL.Scheme = u.Scheme
		req.Header.Set("X-Forwarded-Host", req.Header.Get("Host"))
	}
	rp.ServeHTTP(w, r)

}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func secureHandler(w http.ResponseWriter, r *http.Request) {
	// w.Write([]byte("Hello, this is HTTPS server!"))

	// cors
	enableCors(&w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	log.Info(r.Host)
	log.Info(r.URL.String())
	log.Info(r.URL.Path)

	urlPath := r.URL.Path
	if assets.IsPathForAsset(urlPath) {
		assets.AssetHandler(w, r)
	} else {
		pathPrefix, pathSurfix := utils.SplitPath(urlPath)
		log.Sugar().Info(pathPrefix)
		log.Sugar().Info(pathSurfix)

		// check 404
		link, ok := redirect.Redirects[pathPrefix]
		if !ok {
			redirect.Redirect404(w, r)
		} else {
			switch link.Name {
			case "assets":
				redirect.RedirectAssetHandler(w, r, pathSurfix)
			case "api-blog":
				redirect.RedirectAPIHandler(w, r, link)
			case "api-dex":
				redirect.RedirectAPIHandler(w, r, link)
			case "blog":
				redirect.RedirectHandler(w, r, link)
			case "dex":
				// redirect.RedirectChangeHandler(w, r, link)
				redirect.RedirectHandler(w, r, link)
			default:
				redirect.RedirectHandler(w, r, link)
			}
		}
	}
}

func main() {
	env := "prod"

	switch env {
	case "dev":
		// HTTP server
		httpRedirectMux := http.NewServeMux()
		httpRedirectMux.HandleFunc("/", testProxy)

		log.Sugar().Info("Starting HTTP server on port:", devHttpPort)
		err := http.ListenAndServe(fmt.Sprintf(":%d", devHttpPort), httpRedirectMux)
		if err != nil {
			fmt.Println("Failed to start server:", err)
			return
		}

	case "prod":
		err := tls.CheckTLS()
		if err != nil {
			log.Sugar().Errorf("%s", err)
		}

		log.Info("hi! i'm kyle!")

		// link
		link, err := utils.LoadLinksConf("/app/config/links.yaml")
		if err != nil {
			log.Sugar().Errorf("%s", err)
		}

		for _, l := range link.List {
			lCopy := l
			redirect.Redirects[l.Route] = &lCopy
		}

		// HTTP server
		httpRedirectMux := http.NewServeMux()
		httpRedirectMux.HandleFunc("/", redirectToHTTPS)

		go func() {
			log.Sugar().Info("Starting HTTP server on port:", httpPort)
			err := http.ListenAndServe(fmt.Sprintf(":%d", httpPort), httpRedirectMux)
			if err != nil {
				fmt.Println("Failed to start server:", err)
				return
			}
		}()

		// HTTPS 포트포워딩용 ServeMux 생성
		httpsMux := http.NewServeMux()
		httpsMux.HandleFunc("/", secureHandler)

		log.Sugar().Info("Starting HTTPs server on port:", httpsPort)
		err = http.ListenAndServeTLS(fmt.Sprintf(":%d", httpsPort), SSL_CERT_FILE, SSL_KEY_FILE, httpsMux)
		if err != nil {
			fmt.Println("Failed to start server:", err)
			return
		}
	default:
		fmt.Println("해위^^")
	}
}
