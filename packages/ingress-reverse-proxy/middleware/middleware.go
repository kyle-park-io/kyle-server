package middleware

import (
	"net/http"

	"ingress-reverse-proxy/cors"
)

func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// CORS 헤더 설정
		cors.EnableCors(w)

		// Preflight 요청에 대한 처리
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// Preflight 요청이 아닌 경우 다음 핸들러로 요청을 전달
		next.ServeHTTP(w, r)
	})
}
