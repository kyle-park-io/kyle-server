package redis

// An unreachable redis used to be Fatal, which exits the process from inside a
// request handler - one request against a missing upstream took the whole
// proxy down. Against the old code these tests do not fail, they kill the
// test binary.
import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

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

func TestPresenceCallsSurviveADeadCounterServer(t *testing.T) {
	// Nothing listens on port 1. These run on timers for the life of the
	// process, so an unreachable counter server has to be an error they
	// return, never a panic and never a hang.
	redirect.Redirects["/redis-tcp"] = &types.Config{Url: "http://127.0.0.1:1"}

	done := make(chan struct{})
	go func() {
		defer close(done)
		if err := TouchVisitor(Visitor{ID: "abc"}, "/blog"); err == nil {
			t.Error("expected an error touching an unreachable counter server")
		}
		if err := DropVisitor("abc"); err == nil {
			t.Error("expected an error dropping against an unreachable counter server")
		}
	}()

	select {
	case <-done:
	case <-time.After(10 * time.Second):
		t.Fatal("presence calls hung against an unreachable counter server")
	}
}

func TestLatestIsUsableBeforeTheFirstPoll(t *testing.T) {
	// Every websocket reads this on connect. Before the first poll it must
	// still marshal to empty arrays rather than nulls, which is what the
	// clients iterate.
	s := Latest()
	if s.Countries == nil || s.Pages == nil {
		t.Errorf("breakdowns must be empty slices, not nil: %+v", s)
	}
}

func TestParseSnapshotReadsBothProtocols(t *testing.T) {
	// The proxy and the counter server are separate images, so during a
	// rollout one of them is the old one. A bare number is the old reply,
	// and a count without a breakdown beats no count at all.
	got, err := parseSnapshot("3\n")
	if err != nil {
		t.Fatalf("bare number: %v", err)
	}
	if got.Count != 3 || len(got.Countries) != 0 {
		t.Errorf("bare number gave %+v", got)
	}

	got, err = parseSnapshot(`{"count":2,"countries":[{"key":"KR","n":2}],"pages":[]}` + "\n")
	if err != nil {
		t.Fatalf("json: %v", err)
	}
	if got.Count != 2 || len(got.Countries) != 1 || got.Countries[0].Key != "KR" {
		t.Errorf("json gave %+v", got)
	}

	for _, bad := range []string{"", "   \n", "not a snapshot"} {
		if _, err := parseSnapshot(bad); err == nil {
			t.Errorf("expected an error for %q", bad)
		}
	}
}
