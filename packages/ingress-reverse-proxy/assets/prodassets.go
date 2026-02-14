package assets

var assetsForProd = map[string]*Asset{
	// root
	"/favicon.ico": {contentType: "image/x-icon", dataPath: "/app/public/root/favicon.ico"},
	"/robots.txt":  {contentType: "text/plain", dataPath: "/app/public/root/robots.txt"},
	"/sitemap.xml": {contentType: "text/xml", dataPath: "/app/public/root/sitemap.xml"},
	"/ads.txt":     {contentType: "text/plain", dataPath: "/app/public/root/ads.txt"},
	// svg
	"/home.svg":          {contentType: "image/svg+xml", dataPath: "/app/public/home.svg"},
	"/notion-icon.svg":   {contentType: "image/svg+xml", dataPath: "/app/public/notion-icon.svg"},
	"/medium-icon.svg":   {contentType: "image/svg+xml", dataPath: "/app/public/medium-icon.svg"},
	"/chat2-bg.svg":      {contentType: "image/svg+xml", dataPath: "/app/public/chat2-bg.svg"},
	"/duck-bg.svg":       {contentType: "image/svg+xml", dataPath: "/app/public/duck-bg.svg"},
	"/telegram-icon.svg": {contentType: "image/svg+xml", dataPath: "/app/public/telegram-icon.svg"},
	// webp
	"/gopher1-bg.webp": {contentType: "image/webp", dataPath: "/app/public/gopher1-bg.webp"},
	"/dex-bg.webp":     {contentType: "image/webp", dataPath: "/app/public/dex-bg.webp"},
	"/kyle-b-bg.webp":  {contentType: "image/webp", dataPath: "/app/public/kyle-b-bg.webp"},
	// png
	"/linkedin-icon.png": {contentType: "image/png", dataPath: "/app/public/linkedin-icon.png"},
	"/github-icon.png":   {contentType: "image/png", dataPath: "/app/public/github-icon.png"},
	"/khu-icon.png":      {contentType: "image/png", dataPath: "/app/public/khu-icon.png"},
	// jpg
	"/404-bg.jpg":         {contentType: "image/jpeg", dataPath: "/app/public/404-bg.jpg"},
	"/blog-bg.jpg":        {contentType: "image/jpeg", dataPath: "/app/public/blog-bg.jpg"},
	"/cat-bg.jpg":         {contentType: "image/jpeg", dataPath: "/app/public/cat-bg.jpg"},
	"/chat-bg.jpg":        {contentType: "image/jpeg", dataPath: "/app/public/chat-bg.jpg"},
	"/defi-bg.jpg":        {contentType: "image/jpeg", dataPath: "/app/public/defi-bg.jpg"},
	"/github-bg.jpg":      {contentType: "image/jpeg", dataPath: "/app/public/github-bg.jpg"},
	"/gopher2-bg.jpg":     {contentType: "image/jpeg", dataPath: "/app/public/gopher2-bg.jpg"},
	"/kyle-bg.webp":       {contentType: "image/webp", dataPath: "/app/public/kyle/kyle-bg.webp"},
	"/linkedin-bg.jpg":    {contentType: "image/jpeg", dataPath: "/app/public/linkedin-bg.jpg"},
	"/profile-bg.jpg":     {contentType: "image/jpeg", dataPath: "/app/public/profile-bg.jpg"},
	"/chart-bg.jpg":       {contentType: "image/jpeg", dataPath: "/app/public/chart-bg.jpg"},
	"/staking-bg.jpg":     {contentType: "image/jpeg", dataPath: "/app/public/staking-bg.jpg"},
	"/swap-bg.jpg":        {contentType: "image/jpeg", dataPath: "/app/public/swap-bg.jpg"},
	"/bridge-bg.jpg":      {contentType: "image/jpeg", dataPath: "/app/public/bridge-bg.jpg"},
	"/bitcoin-bg.jpg":     {contentType: "image/jpeg", dataPath: "/app/public/bitcoin-bg.jpg"},
	"/chain-bg.jpg":       {contentType: "image/jpeg", dataPath: "/app/public/chain-bg.jpg"},
	"/wedding-bg.jpg":     {contentType: "image/jpeg", dataPath: "/app/public/wedding-bg.jpg"},
	"/distributed-bg.jpg": {contentType: "image/jpeg", dataPath: "/app/public/distributed-bg.jpg"},
	"/timestamp-bg.jpg":   {contentType: "image/jpeg", dataPath: "/app/public/timestamp-bg.jpg"},
	// jpeg
	"/tracker-bg.jpeg": {contentType: "image/jpeg", dataPath: "/app/public/tracker-bg.jpeg"},
	// pdf
	"/pdf/jungho_park_cv.pdf": {contentType: "application/pdf", dataPath: "/app/public/pdf/jungho_park_cv.pdf"},
	// kyle-dex swagger
	"/dex/api-docs/favicon-32x32.png": {contentType: "image/png", dataPath: "/app/public/swagger-favicon-32x32.png"},
}
