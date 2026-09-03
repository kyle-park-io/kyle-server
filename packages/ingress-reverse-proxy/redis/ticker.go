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
			// continue, not return: returning ended the ticker for the rest of
			// the process's life, so real-time counts stopped for good after a
			// single bad parse.
			logger.Log.Errorf("%s", err)
			continue
		}

		conn, err := net.Dial("tcp", u.Host)
		if err != nil {
			// This ran every second while a websocket was open, so a redis
			// that went away took the proxy down with it — no request needed.
			// A tick that cannot reach redis is a tick to skip.
			logger.Log.Errorf("Error connecting to server: %+v", err)
			continue
		}

		// logger.Log.Infoln("Try to get real-time user count from redis.")
		// // LocalAddr: redis client address, RemoteAddr: redis server address
		// logger.Log.Infof("TCP LocalAddr: %s, RemoteAddr: %s", conn.LocalAddr().String(), conn.RemoteAddr().String())

		message := "REAL-TIME\n"
		conn.Write([]byte(message))

		response, err := bufio.NewReader(conn).ReadString('\n')
		if err != nil {
			// Closed here as well: the only Close was at the bottom of the
			// loop, which this path skips, so a flaky redis leaked one
			// connection per second.
			logger.Log.Errorf("Error reading response: %+v", err)
			conn.Close()
			continue
		}
		// logger.Log.Infof("TCP Response: %s", response)

		// logger.Log.Infof("Current Real-Time User Count: %s", response)
		GlobalLogChannel <- response

		// close connection
		conn.Close()
	}
}
