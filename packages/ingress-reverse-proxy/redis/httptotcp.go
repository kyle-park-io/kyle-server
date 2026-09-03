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
	// RemoteAddr (Client Address)
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
		// This tracks a visitor; it is not what the caller was asked for. A
		// Fatal here took the whole proxy down with it, so one unreachable
		// redis turned every incoming request into a process exit and the
		// site went with it.
		logger.Log.Errorf("Error connecting to server: %+v", err)
		return
	}
	defer conn.Close()
	logger.Log.Infoln("Connected to the server. Type commands (e.g. ADDUSER, REAL-TIME, PING, HELLO, TIME, EXIT)")
	// LocalAddr: redis client address, RemoteAddr: redis server address
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

func UpdateRealTimeUser2(clientAddr string) {
	logger.Log.Infoln("UpdateRealTimeUser: ")

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
		logger.Log.Errorf("Error connecting to server: %+v", err)
		return
	}
	defer conn.Close()
	// logger.Log.Infoln("Connected to the server. Type commands (e.g. ADDUSER, REAL-TIME, PING, HELLO, TIME, EXIT)")
	// // LocalAddr: redis client address, RemoteAddr: redis server address
	// logger.Log.Infof("TCP LocalAddr: %s, RemoteAddr: %s", conn.LocalAddr().String(), conn.RemoteAddr().String())

	message := fmt.Sprintf("ADDUSER %s\n", clientAddr)
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
	// RemoteAddr (Client Address)
	logger.Log.Infoln("RemoteAddr: ", r.RemoteAddr)

	// 1. Connect to the server.
	conn, err := net.Dial("tcp", u.Host)
	if err != nil {
		// An unreachable upstream is the client's answer, not the server's
		// end. This used to be Fatal, which exited the process mid-request.
		logger.Log.Errorf("Error connecting to server: %+v", err)
		http.Error(w, "upstream unavailable", http.StatusBadGateway)
		return
	}
	defer conn.Close()
	logger.Log.Infoln("Connected to the server. Type commands (e.g. ADDUSER, REAL-TIME, PING, HELLO, TIME, EXIT)")
	// LocalAddr: redis client address, RemoteAddr: redis server address
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
