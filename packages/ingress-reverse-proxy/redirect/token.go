package redirect

import (
	"crypto/subtle"
	"net/http"
	"os"

	"ingress-reverse-proxy/types"
)

// TokenHeader carries the shared secret for links that set tokenEnv.
const TokenHeader = "X-Api-Token"

// Authorized reports whether r may be proxied to link.
//
// A link without tokenEnv is public. For the others the request has to carry
// the value of that environment variable in TokenHeader. An unset or empty
// variable rejects every request, so a deployment that is missing its Secret
// closes the route instead of opening it to everyone.
//
// The header is removed either way, so the token never reaches the backend or
// its logs.
func Authorized(r *http.Request, link *types.Config) bool {
	if link.TokenEnv == "" {
		return true
	}

	got := r.Header.Get(TokenHeader)
	r.Header.Del(TokenHeader)

	want := os.Getenv(link.TokenEnv)
	if want == "" || got == "" {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(got), []byte(want)) == 1
}
