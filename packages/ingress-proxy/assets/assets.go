package assets

import (
	"ingress-proxy/logger"
	"net/http"
	"os"
)

var (
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
		"/cat-bg.jpg":      {contentType: "image/jpeg", dataPath: "/app/public/cat-bg.jpg"},
		"/chat-bg.jpg":     {contentType: "image/jpeg", dataPath: "/app/public/chat-bg.jpg"},
		"/defi-bg.jpg":     {contentType: "image/jpeg", dataPath: "/app/public/defi-bg.jpg"},
		"/github-bg.jpg":   {contentType: "image/jpeg", dataPath: "/app/public/github-bg.jpg"},
		"/gopher2-bg.jpg":  {contentType: "image/jpeg", dataPath: "/app/public/gopher2-bg.jpg"},
		"/kyle-bg.webp":    {contentType: "image/webp", dataPath: "/app/public/kyle-bg.webp"},
		"/linkedin-bg.jpg": {contentType: "image/jpeg", dataPath: "/app/public/linkedin-bg.jpg"},
		"/profile-bg.jpg":  {contentType: "image/jpeg", dataPath: "/app/public/profile-bg.jpg"},
		"/chart-bg.jpg":    {contentType: "image/jpeg", dataPath: "/app/public/chart-bg.jpg"},
		"/staking-bg.jpg":  {contentType: "image/jpeg", dataPath: "/app/public/staking-bg.jpg"},
		"/swap-bg.jpg":     {contentType: "image/jpeg", dataPath: "/app/public/swap-bg.jpg"},
		"/bridge-bg.jpg":   {contentType: "image/jpeg", dataPath: "/app/public/bridge-bg.jpg"},
	}
)

type Asset struct {
	contentType string
	dataPath    string
	data        []byte
}

func IsPathForAsset(path string) bool {
	_, ok := assets[path]
	return ok
}

func AssetHandler(w http.ResponseWriter, r *http.Request) {
	logger.Log.Info("AssetHandler : ")

	urlPath := r.URL.Path

	_, ok := assets[urlPath]
	if !ok {
		http.Error(w, "Image not found", http.StatusNotFound)
		return
	}

	item, found := cache.Get(urlPath)
	if !found {
		asset := assets[urlPath]
		data, err := os.ReadFile(asset.dataPath)
		if err != nil {
			http.Error(w, "Image not found", http.StatusNotFound)
			return
		}
		item := &Asset{contentType: asset.contentType, dataPath: asset.dataPath, data: data}
		cache.Set(urlPath, item)
	}

	w.Header().Set("Content-Type", item.contentType)
	w.Write(item.data)
}
