package tls

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	cryptotls "crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"math/big"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestServesTheRenewedCertificateOnceReloaded(t *testing.T) {
	// The bug this replaces: the server read the certificate once at startup,
	// so a renewal did nothing until the pod happened to restart. If it did
	// not restart before the old certificate expired, the origin served an
	// expired certificate.
	le := newLetsEncryptDir(t)
	le.archive(9, time.Now().Add(10*24*time.Hour))
	le.archive(10, time.Now().Add(90*24*time.Hour))
	le.linkLiveTo(9)

	certs, err := NewCertReloader(le.liveCert(), le.liveKey())
	if err != nil {
		t.Fatal(err)
	}
	addr := serve(t, certs)
	if got := servedSerial(t, addr); got != 9 {
		t.Fatalf("before renewal served serial %d, want 9", got)
	}

	le.linkLiveTo(10) // what certbot renew does
	swapped, err := certs.Reload()
	if err != nil {
		t.Fatal(err)
	}
	if !swapped {
		t.Error("Reload reported no swap for a renewed certificate")
	}
	if got := servedSerial(t, addr); got != 10 {
		t.Errorf("after renewal served serial %d, want 10", got)
	}
}

func TestKeepsTheNewerCertificateWhenTheLinksPointBackAtAnOlderOne(t *testing.T) {
	// renew_ssl_cert.sh has pointed the live links at version 1, which expired
	// in 2024, for about a second every night before certbot put them back.
	// A reload in that second must not swap the good certificate out.
	le := newLetsEncryptDir(t)
	le.archive(1, time.Now().Add(-30*24*time.Hour))
	le.archive(10, time.Now().Add(90*24*time.Hour))
	le.linkLiveTo(10)

	certs, err := NewCertReloader(le.liveCert(), le.liveKey())
	if err != nil {
		t.Fatal(err)
	}
	addr := serve(t, certs)

	le.linkLiveTo(1)
	swapped, err := certs.Reload()
	if err != nil {
		t.Fatal(err)
	}
	if swapped {
		t.Error("Reload reported a swap to an older certificate")
	}
	if got := servedSerial(t, addr); got != 10 {
		t.Errorf("served serial %d, want 10", got)
	}
}

func TestKeepsServingWhenTheFilesOnDiskCannotBeLoaded(t *testing.T) {
	cases := []struct {
		name    string
		corrupt func(le letsEncryptDir)
	}{
		{
			// certbot re-points the four links one at a time, so a reload can
			// land between the certificate and the key.
			name: "the certificate is renewed but the key is not yet",
			corrupt: func(le letsEncryptDir) {
				le.link("fullchain.pem", "fullchain10.pem")
			},
		},
		{
			name: "the files are gone",
			corrupt: func(le letsEncryptDir) {
				le.remove("fullchain.pem")
				le.remove("privkey.pem")
			},
		},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			le := newLetsEncryptDir(t)
			le.archive(9, time.Now().Add(10*24*time.Hour))
			le.archive(10, time.Now().Add(90*24*time.Hour))
			le.linkLiveTo(9)

			certs, err := NewCertReloader(le.liveCert(), le.liveKey())
			if err != nil {
				t.Fatal(err)
			}
			addr := serve(t, certs)

			tc.corrupt(le)
			if _, err := certs.Reload(); err == nil {
				t.Error("Reload returned no error")
			}
			if got := servedSerial(t, addr); got != 9 {
				t.Errorf("served serial %d, want 9", got)
			}
		})
	}
}

func TestRefusesToStartWithoutACertificate(t *testing.T) {
	// Failing at startup is loud; a server that starts and then fails every
	// handshake is not.
	dir := t.TempDir()
	_, err := NewCertReloader(filepath.Join(dir, "fullchain.pem"), filepath.Join(dir, "privkey.pem"))
	if err == nil {
		t.Error("NewCertReloader returned no error for missing files")
	}
}

// letsEncryptDir mirrors the layout certbot keeps: numbered versions under
// archive/, and symlinks under live/ pointing at the current one.
type letsEncryptDir struct {
	t    *testing.T
	root string
}

func newLetsEncryptDir(t *testing.T) letsEncryptDir {
	root := t.TempDir()
	for _, d := range []string{"archive/jungho.dev", "live/jungho.dev"} {
		if err := os.MkdirAll(filepath.Join(root, d), 0o755); err != nil {
			t.Fatal(err)
		}
	}
	return letsEncryptDir{t: t, root: root}
}

func (le letsEncryptDir) liveCert() string {
	return filepath.Join(le.root, "live/jungho.dev/fullchain.pem")
}

func (le letsEncryptDir) liveKey() string {
	return filepath.Join(le.root, "live/jungho.dev/privkey.pem")
}

// archive writes version n: a self-signed certificate whose serial is n, and
// its key.
func (le letsEncryptDir) archive(n int64, notAfter time.Time) {
	t := le.t
	key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		t.Fatal(err)
	}
	template := &x509.Certificate{
		SerialNumber: big.NewInt(n),
		Subject:      pkix.Name{CommonName: "jungho.dev"},
		DNSNames:     []string{"jungho.dev"},
		NotBefore:    notAfter.Add(-90 * 24 * time.Hour),
		NotAfter:     notAfter,
	}
	der, err := x509.CreateCertificate(rand.Reader, template, template, &key.PublicKey, key)
	if err != nil {
		t.Fatal(err)
	}
	keyDER, err := x509.MarshalPKCS8PrivateKey(key)
	if err != nil {
		t.Fatal(err)
	}
	dir := filepath.Join(le.root, "archive/jungho.dev")
	writePEM(t, filepath.Join(dir, fmt.Sprintf("fullchain%d.pem", n)), "CERTIFICATE", der)
	writePEM(t, filepath.Join(dir, fmt.Sprintf("privkey%d.pem", n)), "PRIVATE KEY", keyDER)
}

func (le letsEncryptDir) linkLiveTo(n int64) {
	le.link("fullchain.pem", fmt.Sprintf("fullchain%d.pem", n))
	le.link("privkey.pem", fmt.Sprintf("privkey%d.pem", n))
}

// link does what ln -sf does: replace live/<name> with a symlink to
// archive/<target>.
func (le letsEncryptDir) link(name, target string) {
	le.remove(name)
	err := os.Symlink(filepath.Join(le.root, "archive/jungho.dev", target), filepath.Join(le.root, "live/jungho.dev", name))
	if err != nil {
		le.t.Fatal(err)
	}
}

func (le letsEncryptDir) remove(name string) {
	err := os.Remove(filepath.Join(le.root, "live/jungho.dev", name))
	if err != nil && !os.IsNotExist(err) {
		le.t.Fatal(err)
	}
}

func writePEM(t *testing.T, path, blockType string, der []byte) {
	t.Helper()
	if err := os.WriteFile(path, pem.EncodeToMemory(&pem.Block{Type: blockType, Bytes: der}), 0o600); err != nil {
		t.Fatal(err)
	}
}

// serve starts an HTTPS server wired the way main.go wires the real one.
func serve(t *testing.T, certs *CertReloader) string {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	srv := &http.Server{
		Handler:   http.NotFoundHandler(),
		TLSConfig: &cryptotls.Config{GetCertificate: certs.GetCertificate},
	}
	go srv.ServeTLS(ln, "", "")
	t.Cleanup(func() { srv.Close() })
	return ln.Addr().String()
}

// servedSerial opens a TLS connection and returns the serial of the
// certificate the server presented.
func servedSerial(t *testing.T, addr string) int64 {
	t.Helper()
	conn, err := cryptotls.Dial("tcp", addr, &cryptotls.Config{ServerName: "jungho.dev", InsecureSkipVerify: true})
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close()
	return conn.ConnectionState().PeerCertificates[0].SerialNumber.Int64()
}
