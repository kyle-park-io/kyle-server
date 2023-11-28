package utils

import "strings"

func SplitPath(urlPath string) (prefix, surfix string) {
	if len(urlPath) == 0 {
		return "/", ""
	}

	if urlPath[0] == '/' {
		urlPath = urlPath[1:]
	}

	i := strings.Index(urlPath, "/")
	if i < 0 {
		return "/" + urlPath, ""
	}

	return "/" + urlPath[:i], urlPath[i:]
}
