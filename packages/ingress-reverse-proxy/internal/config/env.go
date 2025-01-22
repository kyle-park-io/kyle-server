package config

import (
	"os"

	"ingress-reverse-proxy/logger"

	"github.com/spf13/viper"
)

func SetEnv(env string) {
	if env == "prod" {
		os.Setenv("ROOT_PATH", "/app")
		viper.Set("ROOT_PATH", "/app")
	} else {
		os.Setenv("ROOT_PATH", "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy")
		viper.Set("ROOT_PATH", "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy")
	}

	os.Setenv("LOG_PATH", viper.GetString("ROOT_PATH")+"/logs")
	viper.Set("LOG_PATH", viper.GetString("ROOT_PATH")+"/logs")

	logger.InitLogger()
	logger.Log.Info("hi! i'm kyle!")

	os.Setenv("CONFIG_PATH", viper.GetString("ROOT_PATH")+"/config/common.yaml")
	if err := InitConfig(); err != nil {
		logger.Log.Fatalf("Check Errors, %v", err)
	}
}
