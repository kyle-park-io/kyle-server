package handlers

import (
	"net/http"

	"ingress-reverse-proxy/logger"
)

func ProxyHandler(w http.ResponseWriter, r *http.Request) {
	// request
	logger.Log.Info("host: ", r.Host)
	logger.Log.Info("url: ", r.URL.String())
	logger.Log.Info("path: ", r.URL.Path)
	logger.Log.Info("query: ", r.URL.Query())

	// ctx := r.Context()
	// reverseproxy.ServeReverseProxy(ctx, w, r)

	// urlPath := r.URL.Path
	// pathPrefix, pathSurfix := utils.SplitPath(urlPath)
	// logger.Log.Info(pathSurfix)

	// targetURL := "http://localhost:8081"
	// u, err := url.Parse(targetURL)
	// if err != nil {
	// 	logger.Log.Errorf("%s", err)
	// 	return
	// }
	// rp := httputil.NewSingleHostReverseProxy(u)

	// originalDirector := rp.Director
	// // Director 함수를 오버라이드
	// rp.Director = func(req *http.Request) {
	// 	// 원래 Director 함수 호출
	// 	originalDirector(req)
	// 	// 요청의 경로를 404로 변경
	// 	req.Host = u.Host
	// 	req.URL.Path = "/404"
	// 	req.URL.Host = u.Host
	// 	req.URL.Scheme = u.Scheme
	// 	req.Header.Set("X-Forwarded-Host", req.Header.Get("Host"))
	// }

	// rp.ServeHTTP(w, r)
}
