package handlers

import (
	"ingress-reverse-proxy/assets"
	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/redirect"
	"ingress-reverse-proxy/utils"
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
		logger.Log.Info("pathPrefix: ", pathPrefix)
		logger.Log.Info("pathSurfix: ", pathSurfix)

		// check 404
		// TODO: elaborate on the expression of a 404 error
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
			case "api-tracker":
				// redirect.RedirectAPIHandler(w, r, link)
				redirect.RedirectHandler(w, r, link)

			// basic(URL directly)
			case "blog":
				redirect.RedirectHandler(w, r, link)
			case "dex":
				// redirect.RedirectChangeHandler(w, r, link)
				redirect.RedirectHandler(w, r, link)
			case "recoder":
				// redirect.RedirectChangeHandler(w, r, link)
				redirect.RedirectHandler(w, r, link)
			case "tracker":
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
