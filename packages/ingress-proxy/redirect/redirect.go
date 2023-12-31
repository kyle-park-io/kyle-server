package redirect

import (
	"ingress-proxy/logger"
	"ingress-proxy/types"
	"ingress-proxy/utils"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

var (
	log = logger.InitLogger()
	// link      *types.Configs
	Redirects = map[string]*types.Config{}
)

func RedirectAssetHandler(w http.ResponseWriter, r *http.Request, pathSurfix string) {

	log.Sugar().Info("RedirectAssetHandler : ")

	parts := strings.Split(pathSurfix, ".")
	var secondPart string
	if len(parts) > 0 {
		secondPart = parts[1]
		log.Sugar().Info(secondPart)
	} else {
		log.Sugar().Error("url error")
		return
	}

	link, ok := Redirects["/"+secondPart]
	if !ok {
		log.Sugar().Error("url error")
		return
	}
	targetURL := link.Url
	u, err := url.Parse(targetURL)
	if err != nil {
		log.Sugar().Errorf("%s", err)
		return
	}
	rp := httputil.NewSingleHostReverseProxy(u)

	rp.ServeHTTP(w, r)
}

func RedirectHandler(w http.ResponseWriter, r *http.Request, link *types.Config) {
	// ctx := r.Context()
	// reverseproxy.ServeReverseProxy(ctx, w, r)

	log.Sugar().Info("RedirectHandler : ")
	targetURL := link.Url
	u, err := url.Parse(targetURL)
	if err != nil {
		log.Sugar().Errorf("%s", err)
		return
	}
	rp := httputil.NewSingleHostReverseProxy(u)

	rp.ServeHTTP(w, r)
}

func RedirectChangeHandler(w http.ResponseWriter, r *http.Request, link *types.Config) {

	log.Sugar().Info("RedirectChangedHandler : ")

	targetURL := link.Url
	u, err := url.Parse(targetURL)
	if err != nil {
		log.Sugar().Errorf("%s", err)
		return
	}
	rp := httputil.NewSingleHostReverseProxy(u)

	segments := strings.SplitN(r.URL.Path, "/", 3)
	var changedUrl string
	if len(segments) > 2 {
		changedUrl = "/" + segments[2]
	} else if len(segments) == 2 {
		changedUrl = "/"
	}
	log.Sugar().Infof("changed url: %s", changedUrl)

	originalDirector := rp.Director
	rp.Director = func(req *http.Request) {
		originalDirector(req)
		req.Host = u.Host
		req.URL.Path = changedUrl
		req.URL.Host = u.Host
		req.URL.Scheme = u.Scheme
		req.Header.Set("X-Forwarded-Host", req.Header.Get("Host"))
	}

	rp.ServeHTTP(w, r)
}

func RedirectAPIHandler(w http.ResponseWriter, r *http.Request, link *types.Config) {
	log.Sugar().Info("RedirectAPIHandler : ")

	urlPath := r.URL.Path
	_, pathSurfix := utils.SplitPath(urlPath)

	targetURL := link.Url
	u, err := url.Parse(targetURL)
	if err != nil {
		log.Sugar().Errorf("%s", err)
		return
	}
	rp := httputil.NewSingleHostReverseProxy(u)

	originalDirector := rp.Director
	rp.Director = func(req *http.Request) {
		originalDirector(req)
		req.Host = u.Host
		req.URL.Path = pathSurfix
		req.URL.Host = u.Host
		req.URL.Scheme = u.Scheme
		req.Header.Set("X-Forwarded-Host", req.Header.Get("Host"))
	}
	rp.ServeHTTP(w, r)
}

func Redirect404(w http.ResponseWriter, r *http.Request) {
	urlPath := r.URL.Path

	log.Sugar().Warnf("404: %s from %s", urlPath, r.RemoteAddr)

	targetURL := Redirects["/"].Url
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
