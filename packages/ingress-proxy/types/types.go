package types

type Config struct {
	Name  string `yaml:"name"`
	Route string `yaml:"route"`
	Url   string `yaml:"url"`
}

type Configs struct {
	List []Config `yaml:"links"`
}
