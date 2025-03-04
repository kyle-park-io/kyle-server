package redis

import (
	"bufio"
	"net"
	"net/url"
	"time"

	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/redirect"
)

var IsWebsocketRunning uint32

func GetRealTimeUser() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		if IsWebsocketRunning == 0 {
			continue
		}

		link := redirect.Redirects["/redis-tcp"]
		targetURL := link.Url
		u, err := url.Parse(targetURL)
		if err != nil {
			logger.Log.Errorf("%s", err)
			return
		}

		conn, err := net.Dial("tcp", u.Host)
		if err != nil {
			logger.Log.Fatalf("Error connecting to server: %+v", err)
		}

		// logger.Log.Infoln("Try to get real-time user count from redis.")
		// // LocalAddr: redis client address, RemoteAddr: redis server address
		// logger.Log.Infof("TCP LocalAddr: %s, RemoteAddr: %s", conn.LocalAddr().String(), conn.RemoteAddr().String())

		message := "REAL-TIME\n"
		conn.Write([]byte(message))

		response, err := bufio.NewReader(conn).ReadString('\n')
		if err != nil {
			logger.Log.Errorf("Error reading response: %+v", err)
			continue
		}
		// logger.Log.Infof("TCP Response: %s", response)

		// logger.Log.Infof("Current Real-Time User Count: %s", response)
		GlobalLogChannel <- response

		// close connection
		conn.Close()
	}
}
