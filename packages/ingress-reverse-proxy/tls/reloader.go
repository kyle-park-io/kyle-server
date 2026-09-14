package tls

import (
	cryptotls "crypto/tls"
	"crypto/x509"
	"sync"
	"time"

	"ingress-reverse-proxy/logger"

	"github.com/pkg/errors"
)

// CertReloader serves the certificate certbot renews in place. The server used
// to read the files once at startup, so a renewal did nothing until the pod
// happened to restart.
type CertReloader struct {
	certFile, keyFile string

	mu       sync.RWMutex
	cert     *cryptotls.Certificate
	notAfter time.Time
}

func NewCertReloader(certFile, keyFile string) (*CertReloader, error) {
	r := &CertReloader{certFile: certFile, keyFile: keyFile}
	if _, err := r.Reload(); err != nil {
		return nil, err
	}
	return r, nil
}

// Reload reads the files again and swaps to them only if they hold a
// certificate that expires later than the one being served. A pair it cannot
// load, or an older certificate, leaves the current one in place.
func (r *CertReloader) Reload() (bool, error) {
	cert, err := cryptotls.LoadX509KeyPair(r.certFile, r.keyFile)
	if err != nil {
		return false, errors.Wrap(err, "load certificate")
	}
	leaf, err := x509.ParseCertificate(cert.Certificate[0])
	if err != nil {
		return false, errors.Wrap(err, "parse certificate")
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	if !leaf.NotAfter.After(r.notAfter) {
		return false, nil
	}
	r.cert = &cert
	r.notAfter = leaf.NotAfter
	return true, nil
}

func (r *CertReloader) GetCertificate(*cryptotls.ClientHelloInfo) (*cryptotls.Certificate, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.cert, nil
}

// Watch reloads every interval, forever.
func (r *CertReloader) Watch(interval time.Duration) {
	for range time.Tick(interval) {
		swapped, err := r.Reload()
		if err != nil {
			logger.Log.Warn("Failed to reload TLS certificate, keeping the current one: ", err)
			continue
		}
		if swapped {
			logger.Log.Info("Reloaded renewed TLS certificate")
		}
	}
}
