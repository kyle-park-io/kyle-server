package redis

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"net/url"

	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/types"
	"ingress-reverse-proxy/utils"
)

func HTTPToTCPHandler(w http.ResponseWriter, r *http.Request, link *types.Config) {
	// The manual /redis-tcp route: a way to poke the counter server by hand.
	// Presence itself does not come through here.
	logger.Log.Debugw("redis-tcp request", "path", r.URL.Path)

	targetURL := link.Url
	u, err := url.Parse(targetURL)
	if err != nil {
		logger.Log.Errorf("%s", err)
		return
	}
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

	urlPath := r.URL.Path
	_, pathSurfix := utils.SplitPath(urlPath)
	switch pathSurfix {
	case "/add":
		// The same identity the websocket uses. Sending r.RemoteAddr here,
		// as this did, wrote a Cloudflare edge address into the session set
		// -- one bogus "visitor" per call, on the exact model this change
		// exists to remove.
		visitor := IdentifyVisitor(r)
		payload, err := json.Marshal(map[string]string{
			"id":      visitor.ID,
			"country": visitor.Country,
			"browser": visitor.Browser,
			"os":      visitor.OS,
			"path":    r.URL.Query().Get("path"),
		})
		if err != nil {
			http.Error(w, "cannot encode visitor", http.StatusInternalServerError)
			return
		}
		fmt.Fprintf(conn, "ADDUSER %s\n", payload)
	case "/real":
		// REAL-TIME takes no argument; the address it used to be given was
		// ignored by the counter server and rejected by its parser.
		fmt.Fprint(conn, "REAL-TIME\n")
	default:
		http.Error(w, "unknown redis-tcp command", http.StatusNotFound)
		return
	}

	// 3. Receive the response from the server.
	response, err := bufio.NewReader(conn).ReadString('\n')
	if err != nil {
		logger.Log.Errorf("Error reading response: %+v", err)
		return
	}
	logger.Log.Debugw("redis-tcp reply", "reply", response)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(response))
}
