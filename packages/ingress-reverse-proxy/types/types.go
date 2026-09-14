package types

import "time"

type Config struct {
	Name  string `yaml:"name"`
	Route string `yaml:"route"`
	Url   string `yaml:"url"`
	// TokenEnv names an environment variable holding a shared secret. When
	// set, requests must send it in the X-Api-Token header (redirect.Authorized).
	TokenEnv string `yaml:"tokenEnv"`
	// WriteLimit caps how often one client address may send POST, PUT, PATCH
	// or DELETE requests to this link (redirect.WriteAllowed). Reads are not
	// limited.
	WriteLimit *RateLimit `yaml:"writeLimit"`
}

// RateLimit allows Burst requests at once, then one more every Every.
type RateLimit struct {
	Burst int           `yaml:"burst"`
	Every time.Duration `yaml:"every"`
}

type Configs struct {
	List []Config `yaml:"links"`
}
