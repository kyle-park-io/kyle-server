package tls

import (
	"fmt"
	"ingress-reverse-proxy/constants"
	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/utils"
	"os/exec"

	"github.com/pkg/errors"
)

func CheckTLS() error {
	if !utils.FileExists(constants.PV_SSL_CERT_FILE) || !utils.FileExists(constants.PV_SSL_KEY_FILE) {
		logger.Log.Warn("Not exist pem files")
		logger.Log.Info("Try to get new tls")

		// out, err := exec.Command("/app/scripts/install_certbot_dns_godaddy.sh").CombinedOutput()
		// logger.Log.Info(string(out))
		// if err != nil {
		// 	return errors.Wrap(err, fmt.Sprintf("check ssl fail: %s", string(out)))
		// }
		// out, err = exec.Command("/app/scripts/create_ssl_cert_godaddy.sh").CombinedOutput()

		out, err := exec.Command("/app/scripts/create_ssl_cert_cloudflare.sh").CombinedOutput()
		logger.Log.Info(string(out))
		if err != nil {
			return errors.Wrap(err, fmt.Sprintf("check ssl fail: %s", string(out)))
		}

		// copy to pv
		// err = utils.CopyDir("/etc/letsencrypt", "/data/letsencrypt")
		err = utils.CopyFolder("/etc/letsencrypt", "/data/letsencrypt")
		if err != nil {
			return err
		}
	} else {
		// err := utils.CopyDir("/data/letsencrypt", "/etc/letsencrypt")
		err := utils.CopyFolder("/data/letsencrypt", "/etc/letsencrypt")
		if err != nil {
			return err
		}
	}

	return nil
}
