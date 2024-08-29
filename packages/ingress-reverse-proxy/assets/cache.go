package assets

import (
	"ingress-reverse-proxy/logger"
	"os"
	"sync"
)

var (
	cache = NewCache()
)

type Cache struct {
	items map[string]*Asset
	mutex sync.RWMutex
}

func NewCache() *Cache {
	return &Cache{
		items: make(map[string]*Asset),
	}
}

func (c *Cache) Set(key string, value *Asset) {
	c.mutex.Lock()
	defer c.mutex.Unlock()
	c.items[key] = value
}

func (c *Cache) Get(key string) (*Asset, bool) {
	c.mutex.RLock()
	defer c.mutex.RUnlock()
	item, exists := c.items[key]
	return item, exists
}

func InitCache() error {
	for key, value := range assets {
		logger.Log.Infof("Key: %s, Value: %v\n", key, value)
		data, err := os.ReadFile(value.dataPath)
		if err != nil {
			logger.Log.Error("Image not found")
			return err
		}
		item := &Asset{contentType: value.contentType, dataPath: value.dataPath, data: data}
		cache.Set(key, item)
	}
	return nil
}
