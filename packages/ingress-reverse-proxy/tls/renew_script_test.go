package tls

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

func TestRenewScriptLinksLiveToTheNewestArchivedVersion(t *testing.T) {
	// After a restart, live/ holds plain files copied back from the PVC, and
	// certbot refuses to touch a lineage whose live files are not symlinks.
	// The script used to fix that by linking to version 1, which expired in
	// 2024. If certbot then failed before re-pointing the links, the nightly
	// sync copied version 1 to the PVC, and the next restart served it.
	le := t.TempDir()
	archive := filepath.Join(le, "archive/jungho.dev")
	live := filepath.Join(le, "live/jungho.dev")
	for _, d := range []string{archive, live} {
		if err := os.MkdirAll(d, 0o755); err != nil {
			t.Fatal(err)
		}
	}
	kinds := []string{"cert", "chain", "fullchain", "privkey"}
	// 9 and 10 together: a lexical sort picks 9.
	for _, n := range []int{1, 2, 9, 10} {
		for _, kind := range kinds {
			name := fmt.Sprintf("%s%d.pem", kind, n)
			if err := os.WriteFile(filepath.Join(archive, name), []byte(name), 0o644); err != nil {
				t.Fatal(err)
			}
		}
	}
	for _, kind := range kinds {
		if err := os.WriteFile(filepath.Join(live, kind+".pem"), []byte("restored from the PVC"), 0o644); err != nil {
			t.Fatal(err)
		}
	}

	bin := t.TempDir()
	certbotArgs := filepath.Join(bin, "certbot-args")
	fakeCertbot := "#!/bin/sh\necho \"$@\" > " + certbotArgs + "\n"
	if err := os.WriteFile(filepath.Join(bin, "certbot"), []byte(fakeCertbot), 0o755); err != nil {
		t.Fatal(err)
	}

	cmd := exec.Command("sh", "../scripts/renew_ssl_cert.sh")
	cmd.Env = append(os.Environ(), "LETSENCRYPT_DIR="+le, "PATH="+bin+":"+os.Getenv("PATH"))
	if out, err := cmd.CombinedOutput(); err != nil {
		t.Fatalf("script failed: %v\n%s", err, out)
	}

	for _, kind := range kinds {
		link := filepath.Join(live, kind+".pem")
		info, err := os.Lstat(link)
		if err != nil {
			t.Fatal(err)
		}
		if info.Mode()&os.ModeSymlink == 0 {
			t.Errorf("%s.pem is not a symlink", kind)
			continue
		}
		got, err := os.ReadFile(link)
		if err != nil {
			t.Fatal(err)
		}
		if want := kind + "10.pem"; string(got) != want {
			t.Errorf("%s.pem resolves to %s, want %s", kind, got, want)
		}
	}

	args, err := os.ReadFile(certbotArgs)
	if err != nil {
		t.Fatalf("certbot was not run: %v", err)
	}
	if got := strings.TrimSpace(string(args)); got != "renew --quiet" {
		t.Errorf("certbot ran with %q, want %q", got, "renew --quiet")
	}
}
