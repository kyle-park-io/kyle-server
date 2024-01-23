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
		// svg
		"/home.svg":        {contentType: "image/svg+xml", dataPath: "/app/public/home.svg"},
		"/notion-icon.svg": {contentType: "image/svg+xml", dataPath: "/app/public/notion-icon.svg"},
		// webp
		"/gopher1-bg.webp": {contentType: "image/webp", dataPath: "/app/public/gopher1-bg.webp"},
		"/dex-bg.webp":     {contentType: "image/webp", dataPath: "/app/public/dex-bg.webp"},
		// png
		"/linkedin-icon.png": {contentType: "image/png", dataPath: "/app/public/linkedin-icon.png"},
		"/github-icon.png":   {contentType: "image/png", dataPath: "/app/public/github-icon.png"},
		// jpg
		"/404-bg.jpg":      {contentType: "image/jpeg", dataPath: "/app/public/404-bg.jpg"},
		"/blog-bg.jpg":     {contentType: "image/jpeg", dataPath: "/app/public/blog-bg.jpg"},
		"/chat-bg.jpg":     {contentType: "image/jpeg", dataPath: "/app/public/chat-bg.jpg"},
		"/defi-bg.jpg":     {contentType: "image/jpeg", dataPath: "/app/public/defi-bg.jpg"},
		"/github-bg.jpg":   {contentType: "image/jpeg", dataPath: "/app/public/github-bg.jpg"},
		"/gopher2-bg.jpg":  {contentType: "image/jpeg", dataPath: "/app/public/gopher2-bg.jpg"},
		"/linkedin-bg.jpg": {contentType: "image/jpeg", dataPath: "/app/public/linkedin-bg.jpg"},
		"/profile-bg.jpg":  {contentType: "image/jpeg", dataPath: "/app/public/profile-bg.jpg"},
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
