package handlers

import (
	"ingress-proxy/assets"
	"ingress-proxy/logger"
	"ingress-proxy/redirect"
	"ingress-proxy/utils"
	"net/http"
)

func MainHandler(w http.ResponseWriter, r *http.Request) {
	// request
	logger.Log.Info("host: ", r.Host)
	logger.Log.Info("url: ", r.URL.String())
	logger.Log.Info("path: ", r.URL.Path)
	logger.Log.Info("query: ", r.URL.Query())

	urlPath := r.URL.Path
	// asset files
	if assets.IsPathForAsset(urlPath) {
		assets.AssetHandler(w, r)
	} else {
		pathPrefix, pathSurfix := utils.SplitPath(urlPath)
		logger.Log.Info(pathPrefix)
		logger.Log.Info(pathSurfix)

		// check 404
		link, ok := redirect.Redirects[pathPrefix]
		if !ok {
			redirect.Redirect404(w, r)
		} else {
			switch link.Name {
			// asset js, css(current no used, assets -> static branch)
			case "assets":
				redirect.RedirectAssetHandler(w, r, pathSurfix)
			// api
			case "api-blog":
				redirect.RedirectAPIHandler(w, r, link)
			case "api-dex":
				// redirect.RedirectAPIHandler(w, r, link)
				redirect.RedirectHandler(w, r, link)
			case "api-chat":
				redirect.RedirectAPIHandler(w, r, link)
			// basic
			case "blog":
				redirect.RedirectHandler(w, r, link)
			case "dex":
				// redirect.RedirectChangeHandler(w, r, link)
				redirect.RedirectHandler(w, r, link)
			// static
			case "blog-static":
				redirect.RedirectHandler(w, r, link)
			case "dex-static":
				redirect.RedirectHandler(w, r, link)
			// extra
			default:
				redirect.RedirectHandler(w, r, link)
			}
		}
	}
}
