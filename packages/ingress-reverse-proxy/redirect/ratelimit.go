package redirect

import (
	"fmt"
	"math"
	"net/http"
	"strconv"
	"sync"
	"time"

	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/types"
)

// sweepAt is how many addresses a limiter tracks before it forgets the ones
// whose allowance has fully refilled, so the map cannot grow without bound.
const sweepAt = 1024

// writeLimiter is a token bucket per client address: each address may send
// burst writes at once, and regains one every `every`.
type writeLimiter struct {
	mu      sync.Mutex
	burst   float64
	every   time.Duration
	buckets map[string]*bucket
	now     func() time.Time
}

type bucket struct {
	tokens float64
	last   time.Time
}

func newWriteLimiter(limit types.RateLimit, now func() time.Time) *writeLimiter {
	burst := limit.Burst
	if burst < 1 {
		burst = 1
	}
	every := limit.Every
	if every <= 0 {
		every = time.Minute
	}
	return &writeLimiter{
		burst:   float64(burst),
		every:   every,
		buckets: make(map[string]*bucket),
		now:     now,
	}
}

// allow spends one write for key. When none is left it reports how long until
// the next one is available.
func (l *writeLimiter) allow(key string) (bool, time.Duration) {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := l.now()
	if len(l.buckets) >= sweepAt {
		l.sweep(now)
	}

	b, ok := l.buckets[key]
	if !ok {
		b = &bucket{tokens: l.burst, last: now}
		l.buckets[key] = b
	}

	b.tokens = math.Min(l.burst, b.tokens+float64(now.Sub(b.last))/float64(l.every))
	b.last = now

	if b.tokens >= 1 {
		b.tokens--
		return true, 0
	}
	return false, time.Duration((1 - b.tokens) * float64(l.every))
}

// sweep drops addresses that would be back at a full allowance anyway.
func (l *writeLimiter) sweep(now time.Time) {
	full := time.Duration(l.burst * float64(l.every))
	for key, b := range l.buckets {
		if now.Sub(b.last) >= full {
			delete(l.buckets, key)
		}
	}
}

var (
	writeLimitersMu sync.Mutex
	writeLimiters   = map[string]*writeLimiter{}
)

func limiterFor(link *types.Config) *writeLimiter {
	writeLimitersMu.Lock()
	defer writeLimitersMu.Unlock()

	l, ok := writeLimiters[link.Route]
	if !ok {
		l = newWriteLimiter(*link.WriteLimit, time.Now)
		writeLimiters[link.Route] = l
	}
	return l
}

func isWrite(method string) bool {
	switch method {
	case http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete:
		return true
	}
	return false
}

// WriteAllowed applies link.WriteLimit to r. Reads are never limited. When a
// write is over the limit it answers 429 with Retry-After and a JSON error
// the kyle-quant dashboard shows as is, and returns false: the caller must not
// proxy the request.
func WriteAllowed(w http.ResponseWriter, r *http.Request, link *types.Config) bool {
	if link.WriteLimit == nil || !isWrite(r.Method) {
		return true
	}

	ip := ClientIP(r)
	ok, wait := limiterFor(link).allow(ip)
	if ok {
		return true
	}

	secs := int(math.Ceil(wait.Seconds()))
	logger.Log.Warnf("429: %s %s from %s, retry in %ds", r.Method, r.URL.Path, ip, secs)

	w.Header().Set("Retry-After", strconv.Itoa(secs))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusTooManyRequests)
	fmt.Fprintf(w, `{"error":"Too many changes from this address. Try again in %d seconds."}`, secs)
	return false
}
