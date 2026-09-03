package redis

// An unreachable redis used to be Fatal, which exits the process from inside a
// request handler — one request against a missing upstream took the whole proxy
// down. Against the old code these tests do not fail, they kill the test binary.
import (
	"net/http"
	"net/http/httptest"
	"testing"

	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/redirect"
	"ingress-reverse-proxy/types"
)

func init() { logger.InitLogger() }

func TestHTTPToTCPHandlerSurvivesDeadUpstream(t *testing.T) {
	// Nothing listens on port 1, so net.Dial fails immediately.
	link := &types.Config{Url: "http://127.0.0.1:1"}
	req := httptest.NewRequest(http.MethodGet, "/redis-tcp/add", nil)
	rec := httptest.NewRecorder()

	HTTPToTCPHandler(rec, req, link)

	if rec.Code != http.StatusBadGateway {
		t.Fatalf("expected 502 for an unreachable upstream, got %d", rec.Code)
	}
}

func TestUpdateRealTimeUserSurvivesDeadUpstream(t *testing.T) {
	redirect.Redirects["/redis-tcp"] = &types.Config{Url: "http://127.0.0.1:1"}
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	// Neither returns a value; reaching the next line is the assertion.
	UpdateRealTimeUser(req)
	UpdateRealTimeUser2("1.2.3.4:5678")
}
