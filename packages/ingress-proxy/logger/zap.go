package logger

import (
	"go.uber.org/zap"
)

func InitLogger() *zap.Logger {
	log, err := zap.NewDevelopment()
	if err != nil {
		panic(err)
	}
	return log
}
