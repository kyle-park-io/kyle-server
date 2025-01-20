package assets

import (
	"ingress-reverse-proxy/logger"
	"net/http"
	"os"
)

var assets map[string]*Asset

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

func init() {
	env := os.Getenv("GO_ENV")
	if env == "production" {
		assets = assetsForProd
	} else {
		assets = assetsForDev
	}
}
