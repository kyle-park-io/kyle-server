package redirect

import (
	"net/http/httptest"
	"testing"

	"ingress-reverse-proxy/types"
)

func TestAuthorized(t *testing.T) {
	const env = "TEST_INGRESS_API_TOKEN"
	protected := &types.Config{Name: "api-quant2", TokenEnv: env}
	public := &types.Config{Name: "api-quant3"}

	cases := []struct {
		name   string
		link   *types.Config
		secret string
		header string
		want   bool
	}{
		{"public link needs no token", public, "", "", true},
		{"missing header is rejected", protected, "s3cret", "", false},
		{"wrong token is rejected", protected, "s3cret", "guess", false},
		{"prefix of the token is rejected", protected, "s3cret", "s3c", false},
		{"unset secret rejects even an empty header", protected, "", "", false},
		{"unset secret rejects any header", protected, "", "anything", false},
		{"matching token is accepted", protected, "s3cret", "s3cret", true},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Setenv(env, tc.secret)
			r := httptest.NewRequest("GET", "/api-quant2/v1/balances", nil)
			if tc.header != "" {
				r.Header.Set(TokenHeader, tc.header)
			}

			if got := Authorized(r, tc.link); got != tc.want {
				t.Fatalf("Authorized() = %v, want %v", got, tc.want)
			}
			if r.Header.Get(TokenHeader) != "" {
				t.Fatalf("%s header was not removed before proxying", TokenHeader)
			}
		})
	}
}
