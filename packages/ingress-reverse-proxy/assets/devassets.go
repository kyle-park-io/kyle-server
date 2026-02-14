package assets

var assetsForDev = map[string]*Asset{
	// root
	"/favicon.ico": {contentType: "image/x-icon", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/root/favicon.ico"},
	"/robots.txt":  {contentType: "text/plain", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/root/robots.txt"},
	"/sitemap.xml": {contentType: "text/xml", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/root/sitemap.xml"},
	"/ads.txt":     {contentType: "text/plain", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/root/ads.txt"},
	// svg
	"/home.svg":          {contentType: "image/svg+xml", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/home.svg"},
	"/notion-icon.svg":   {contentType: "image/svg+xml", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/notion-icon.svg"},
	"/medium-icon.svg":   {contentType: "image/svg+xml", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/medium-icon.svg"},
	"/chat2-bg.svg":      {contentType: "image/svg+xml", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/chat2-bg.svg"},
	"/duck-bg.svg":       {contentType: "image/svg+xml", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/duck-bg.svg"},
	"/telegram-icon.svg": {contentType: "image/svg+xml", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/telegram-icon.svg"},
	// webp
	"/gopher1-bg.webp": {contentType: "image/webp", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/gopher1-bg.webp"},
	"/dex-bg.webp":     {contentType: "image/webp", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/dex-bg.webp"},
	"/kyle-b-bg.webp":  {contentType: "image/webp", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/kyle-b-bg.webp"},
	// png
	"/linkedin-icon.png": {contentType: "image/png", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/linkedin-icon.png"},
	"/github-icon.png":   {contentType: "image/png", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/github-icon.png"},
	"/khu-icon.png":      {contentType: "image/png", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/khu-icon.png"},
	// jpg
	"/404-bg.jpg":         {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/404-bg.jpg"},
	"/blog-bg.jpg":        {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/blog-bg.jpg"},
	"/cat-bg.jpg":         {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/cat-bg.jpg"},
	"/chat-bg.jpg":        {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/chat-bg.jpg"},
	"/defi-bg.jpg":        {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/defi-bg.jpg"},
	"/github-bg.jpg":      {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/github-bg.jpg"},
	"/gopher2-bg.jpg":     {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/gopher2-bg.jpg"},
	"/kyle-bg.webp":       {contentType: "image/webp", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/kyle/kyle-bg.webp"},
	"/linkedin-bg.jpg":    {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/linkedin-bg.jpg"},
	"/profile-bg.jpg":     {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/profile-bg.jpg"},
	"/chart-bg.jpg":       {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/chart-bg.jpg"},
	"/staking-bg.jpg":     {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/staking-bg.jpg"},
	"/swap-bg.jpg":        {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/swap-bg.jpg"},
	"/bridge-bg.jpg":      {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/bridge-bg.jpg"},
	"/bitcoin-bg.jpg":     {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/bitcoin-bg.jpg"},
	"/chain-bg.jpg":       {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/chain-bg.jpg"},
	"/wedding-bg.jpg":     {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/wedding-bg.jpg"},
	"/distributed-bg.jpg": {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/distributed-bg.jpg"},
	"/timestamp-bg.jpg":   {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/timestamp-bg.jpg"},
	// jpeg
	"/tracker-bg.jpeg": {contentType: "image/jpeg", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/tracker-bg.jpeg"},
	// pdf
	"/pdf/jungho_park_cv.pdf": {contentType: "application/pdf", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/pdf/jungho_park_cv.pdf"},
	// kyle-dex swagger
	"/dex/api-docs/favicon-32x32.png": {contentType: "image/png", dataPath: "/home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public/swagger-favicon-32x32.png"},
}
