package utils

import (
	"ingress-proxy/logger"
	"ingress-proxy/types"
	"os"

	"github.com/pkg/errors"
	"gopkg.in/yaml.v3"
)

var log = logger.InitLogger()

func LoadLinksConf(path string) (*types.Configs, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		log.Sugar().Error(err)
		return nil, errors.Wrap(err, "fail to load links conf")
	}

	var configs types.Configs
	err = yaml.Unmarshal(data, &configs)
	if err != nil {
		log.Sugar().Error(err)
		return nil, errors.Wrap(err, "fail to load links conf")
	}

	return &configs, nil
}
