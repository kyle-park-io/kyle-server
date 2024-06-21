package tls

import (
	"fmt"
	"ingress-proxy/constants"
	"ingress-proxy/logger"
	"ingress-proxy/utils"
	"os/exec"

	"github.com/pkg/errors"
)

func CheckTLS() error {
	if !utils.FileExists(constants.SSL_CERT_FILE) || !utils.FileExists(constants.SSL_KEY_FILE) {
		logger.Log.Warn("Not exist pem files")
		logger.Log.Info("Try to get new tls")

		out, err := exec.Command("/app/install_certbot_dns_godaddy.sh").CombinedOutput()
		logger.Log.Info(string(out))
		if err != nil {
			return errors.Wrap(err, fmt.Sprintf("check ssl fail: %s", string(out)))
		}

		// out, err = exec.Command("/app/create_ssl_cert.sh_godaddy").CombinedOutput()
		out, err = exec.Command("/app/create_ssl_cert.sh_cloudflare").CombinedOutput()
		logger.Log.Info(string(out))
		if err != nil {
			return errors.Wrap(err, fmt.Sprintf("check ssl fail: %s", string(out)))
		}

		// copy to pv
		err = utils.CopyDir("/etc/letsencrypt", "/data/letsencrypt")
		if err != nil {
			return err
		}
	}
	return nil
}
