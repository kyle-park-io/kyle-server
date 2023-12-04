package assets

import (
	"ingress-proxy/logger"
	"io"
	"net/http"
	"os"
)

type Asset struct {
	contentType string
	dataPath    string
}

var (
	log    = logger.InitLogger()
	assets = map[string]*Asset{
		"/favicon.ico": {contentType: "image/x-icon", dataPath: "/app/public/favicon.ico"},
		"/ads.txt":     {contentType: "text/plain", dataPath: "/app/public/ads.txt"},
		"/robots.txt":  {contentType: "text/plain", dataPath: "/app/public/robots.txt"},
		"/sitemap.xml": {contentType: "text/xml", dataPath: "/app/public/sitemap.xml"},
		"/home.svg":    {contentType: "image/svg+xml", dataPath: "/app/public/home.svg"},
	}
)

func IsPathForAsset(path string) bool {
	_, ok := assets[path]
	return ok
}

func AssetHandler(w http.ResponseWriter, r *http.Request) {
	urlPath := r.URL.Path

	a, ok := assets[urlPath]
	if !ok {
		return
	}

	file, err := os.Open(a.dataPath)
	if err != nil {
		http.Error(w, "File not found.", 404)
		return
	}
	defer file.Close()

	w.Header().Set("Content-Type", a.contentType)

	_, err = io.Copy(w, file)
	if err != nil {
		http.Error(w, "Error serving the favicon.ico", http.StatusInternalServerError)
	}
}
