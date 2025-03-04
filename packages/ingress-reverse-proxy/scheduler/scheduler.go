package scheduler

import "ingress-reverse-proxy/redis"

func RunScheduler() {
	// redis ticker
	go redis.GetRealTimeUser()
}
