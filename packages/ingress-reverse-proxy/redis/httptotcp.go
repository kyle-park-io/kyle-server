package redis

import (
	"bufio"
	"fmt"
	"net"
	"net/http"
	"net/url"

	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/redirect"
	"ingress-reverse-proxy/types"
	"ingress-reverse-proxy/utils"
)

func UpdateRealTimeUser(r *http.Request) {
	logger.Log.Infoln("UpdateRealTimeUser: ")
	// RemoteAddr
	logger.Log.Infoln("RemoteAddr: ", r.RemoteAddr)

	link := redirect.Redirects["/redis-tcp"]
	targetURL := link.Url
	u, err := url.Parse(targetURL)
	if err != nil {
		logger.Log.Errorf("%s", err)
		return
	}

	// 1. Connect to the server.
	conn, err := net.Dial("tcp", u.Host)
	if err != nil {
		logger.Log.Fatalf("Error connecting to server: %+v", err)
	}
	defer conn.Close()
	logger.Log.Infoln("Connected to the server. Type commands (e.g. ADDUSER, REAL-TIME, PING, HELLO, TIME, EXIT)")
	logger.Log.Infof("TCP LocalAddr: %s, RemoteAddr: %s", conn.LocalAddr().String(), conn.RemoteAddr().String())

	message := fmt.Sprintf("ADDUSER %s\n", r.RemoteAddr)
	conn.Write([]byte(message))

	// 3. Receive the response from the server.
	response, err := bufio.NewReader(conn).ReadString('\n')
	if err != nil {
		logger.Log.Errorf("Error reading response: %+v", err)
		return
	}
	logger.Log.Infof("TCP Response: %s", response)
}

func HTTPToTCPHandler(w http.ResponseWriter, r *http.Request, link *types.Config) {
	logger.Log.Infoln("HTTPToTCPHandler: ")

	targetURL := link.Url
	u, err := url.Parse(targetURL)
	if err != nil {
		logger.Log.Errorf("%s", err)
		return
	}
	// RemoteAddr
	logger.Log.Infoln("RemoteAddr: ", r.RemoteAddr)

	// 1. Connect to the server.
	conn, err := net.Dial("tcp", u.Host)
	if err != nil {
		logger.Log.Fatalf("Error connecting to server: %+v", err)
	}
	defer conn.Close()
	logger.Log.Infoln("Connected to the server. Type commands (e.g. ADDUSER, REAL-TIME, PING, HELLO, TIME, EXIT)")
	logger.Log.Infof("TCP LocalAddr: %s, RemoteAddr: %s", conn.LocalAddr().String(), conn.RemoteAddr().String())

	// brach request
	urlPath := r.URL.Path
	_, pathSurfix := utils.SplitPath(urlPath)
	switch pathSurfix {
	case "/add":
		message := fmt.Sprintf("ADDUSER %s\n", r.RemoteAddr)
		conn.Write([]byte(message))
	case "/real":
		message := fmt.Sprintf("REAL-TIME %s\n", r.RemoteAddr)
		conn.Write([]byte(message))
	}

	// 3. Receive the response from the server.
	response, err := bufio.NewReader(conn).ReadString('\n')
	if err != nil {
		logger.Log.Errorf("Error reading response: %+v", err)
		return
	}
	logger.Log.Infof("TCP Response: %s", response)

	// response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(response))
}
