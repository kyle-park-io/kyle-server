package utils

import (
	"os"

	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/types"

	"github.com/pkg/errors"
	"gopkg.in/yaml.v3"
)

func LoadLinksConf(path string) (*types.Configs, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		logger.Log.Error(err)
		return nil, errors.Wrap(err, "fail to load links conf")
	}

	var configs types.Configs
	err = yaml.Unmarshal(data, &configs)
	if err != nil {
		logger.Log.Error(err)
		return nil, errors.Wrap(err, "fail to load links conf")
	}

	return &configs, nil
}
