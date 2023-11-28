package tls

import (
	"fmt"
	"ingress-proxy/logger"
	"ingress-proxy/utils"
	"os/exec"

	"github.com/pkg/errors"
)

var log = logger.InitLogger()

const (
	SSL_CERT_FILE = "/data/letsencrypt/live/jungho.dev/fullchain.pem"
	SSL_KEY_FILE  = "/data/letsencrypt/live/jungho.dev/privkey.pem"
)

func CheckTLS() error {
	if !utils.FileExists(SSL_CERT_FILE) || !utils.FileExists(SSL_KEY_FILE) {
		log.Warn("Not exist pem files")
		log.Info("Try to get new tls")

		out, err := exec.Command("/app/install_certbot_dns_godaddy.sh").CombinedOutput()
		log.Info(string(out))
		if err != nil {
			return errors.Wrap(err, fmt.Sprintf("check ssl fail: %s", string(out)))
		}

		out, err = exec.Command("/app/create_ssl_cert.sh").CombinedOutput()
		log.Info(string(out))
		if err != nil {
			return errors.Wrap(err, fmt.Sprintf("check ssl fail: %s", string(out)))
		}
	}
	return nil
}
