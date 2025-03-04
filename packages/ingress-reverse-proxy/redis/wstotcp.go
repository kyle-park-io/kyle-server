package redis

import (
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"ingress-reverse-proxy/logger"
	"ingress-reverse-proxy/types"

	"github.com/gorilla/websocket"
	"go.uber.org/zap"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var GlobalLogChannel = make(chan string, 10)

var connections sync.Map

var lastPongTime time.Time

func WSToTCPHandler(w http.ResponseWriter, r *http.Request, link *types.Config) {

	logger.Log.Infoln("Connection initiated")

	// Upgrade the HTTP connection to a WebSocket connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logger.Log.Error("Failed to upgrade to WebSocket", zap.Error(err))

		// response
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to upgrade WebSocket"))
		return
	}

	// Open getting real-time user count
	atomic.StoreUint32(&IsWebsocketRunning, 1)

	// Add the new connection to the connections map
	addConnection(conn)

	// Ensure the connection is removed on function exit
	defer func() {
		removeConnection(conn)
		conn.Close()
	}()

	// Set a Pong handler to verify the connection is alive
	conn.SetPongHandler(func(appData string) error {
		lastPongTime = time.Now()
		logger.Log.Info("Pong received at", zap.Time("time", lastPongTime))
		return nil
	})

	// Start a goroutine to send periodic Ping messages to the client
	go sendPing(conn, r.RemoteAddr)

	// Listen for incoming messages on GlobalLogChannel and broadcast them
	for msg := range GlobalLogChannel {
		broadcastMessage(msg)
	}
}

// Periodically send Ping messages to the WebSocket client to ensure the connection is active
func sendPing(conn *websocket.Conn, clientAddr string) {
	ticker := time.NewTicker(30 * time.Second) // Interval between Ping messages
	defer ticker.Stop()

	for range ticker.C {
		if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
			logger.Log.Error("Ping failed, removing(closing) connection", zap.Error(err))
			removeConnection(conn)

			// Close getting real-time user count
			if getConnectionCount() == 0 {
				atomic.StoreUint32(&IsWebsocketRunning, 0)
			}

			conn.Close()
			return
		}

		// update redis
		UpdateRealTimeUser2(clientAddr)
	}
}

// Broadcast messages to all connected clients
func broadcastMessage(message string) {
	connections.Range(func(key, value interface{}) bool {
		conn := key.(*websocket.Conn)
		if err := conn.WriteMessage(websocket.TextMessage, []byte(message)); err != nil {
			logger.Log.Error("Failed to send message to client, removing(closing) connection", zap.Error(err))
			removeConnection(conn)
			conn.Close() // Close the faulty connection
		}
		return true
	})
}

// Add a WebSocket connection to the connections map
func addConnection(conn *websocket.Conn) {
	connections.Store(conn, true)
}

// Remove a WebSocket connection from the connections map
func removeConnection(conn *websocket.Conn) {
	connections.Delete(conn)
}

// Shut down the WebSocket server and close all connections
func shutdownServer() {
	logger.Log.Info("Shutting down WebSocket server...")
	closeAllConnections()
}

// Close all active WebSocket connections
func closeAllConnections() {
	connections.Range(func(key, value interface{}) bool {
		conn := key.(*websocket.Conn)
		conn.Close()             // Close the WebSocket connection
		connections.Delete(conn) // Remove from the map
		return true
	})
	logger.Log.Info("All connections have been closed.")
}

// Get the number of active connections
func getConnectionCount() int {
	count := 0
	connections.Range(func(key, value interface{}) bool {
		count++
		return true
	})
	return count
}
