package types

type Config struct {
	Name  string `yaml:"name"`
	Route string `yaml:"route"`
	Url   string `yaml:"url"`
	// TokenEnv names an environment variable holding a shared secret. When
	// set, requests must send it in the X-Api-Token header (redirect.Authorized).
	TokenEnv string `yaml:"tokenEnv"`
}

type Configs struct {
	List []Config `yaml:"links"`
}
