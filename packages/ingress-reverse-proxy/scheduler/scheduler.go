package scheduler

import "ingress-reverse-proxy/redis"

func RunScheduler() {
	// Keeps the presence snapshot fresh for every open websocket to read.
	// It replaces a ticker that opened a new TCP connection to the counter
	// server every second for as long as anybody was connected.
	go redis.PollPresence()
}
