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
	"/x-icon.svg":        {contentType: "image/svg+xml", dataPath: "/app/public/x-icon.svg"},
	// webp
	"/gopher1-bg.webp": {contentType: "image/webp", dataPath: "/app/public/gopher1-bg.webp"},
	"/dex-bg.webp":     {contentType: "image/webp", dataPath: "/app/public/dex-bg.webp"},
	"/kyle-b-bg.webp":  {contentType: "image/webp", dataPath: "/app/public/kyle-b-bg.webp"},
	// png
	"/linkedin-icon.png": {contentType: "image/png", dataPath: "/app/public/linkedin-icon.png"},
	"/github-icon.png":   {contentType: "image/png", dataPath: "/app/public/github-icon.png"},
	"/khu-icon.png":      {contentType: "image/png", dataPath: "/app/public/khu-icon.png"},
	"/mantle-icon.png":   {contentType: "image/png", dataPath: "/app/public/mantle-icon.png"},
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
	// devrel event photos
	// Not required by the site: the SolidJS app imports these through the
	// @public alias, so webpack bundles them and serves them from
	// /blog-static. Registered here only so the originals stay reachable at
	// a stable root path.
	"/devrel/campus-ajou.webp":             {contentType: "image/webp", dataPath: "/app/public/devrel/campus-ajou.webp"},
	"/devrel/campus-ewha.webp":             {contentType: "image/webp", dataPath: "/app/public/devrel/campus-ewha.webp"},
	"/devrel/campus-inha.webp":             {contentType: "image/webp", dataPath: "/app/public/devrel/campus-inha.webp"},
	"/devrel/campus-kaist.webp":            {contentType: "image/webp", dataPath: "/app/public/devrel/campus-kaist.webp"},
	"/devrel/campus-korea-university.webp": {contentType: "image/webp", dataPath: "/app/public/devrel/campus-korea-university.webp"},
	"/devrel/campus-kwangwoon.webp":        {contentType: "image/webp", dataPath: "/app/public/devrel/campus-kwangwoon.webp"},
	"/devrel/campus-skku.webp":             {contentType: "image/webp", dataPath: "/app/public/devrel/campus-skku.webp"},
	"/devrel/hackerhouse-session.webp":     {contentType: "image/webp", dataPath: "/app/public/devrel/hackerhouse-session.webp"},
	"/devrel/hackerhouse-workshop.webp":    {contentType: "image/webp", dataPath: "/app/public/devrel/hackerhouse-workshop.webp"},
	"/devrel/hero-workshop.webp":           {contentType: "image/webp", dataPath: "/app/public/devrel/hero-workshop.webp"},
	"/devrel/mogakko.webp":                 {contentType: "image/webp", dataPath: "/app/public/devrel/mogakko.webp"},
	"/devrel/onboarding-livebuild.webp":    {contentType: "image/webp", dataPath: "/app/public/devrel/onboarding-livebuild.webp"},
	"/devrel/onboarding-session.webp":      {contentType: "image/webp", dataPath: "/app/public/devrel/onboarding-session.webp"},
	"/devrel/q402-graph.webp":              {contentType: "image/webp", dataPath: "/app/public/devrel/q402-graph.webp"},
	"/devrel/q402-group.webp":              {contentType: "image/webp", dataPath: "/app/public/devrel/q402-group.webp"},
	"/devrel/q402-keynote.webp":            {contentType: "image/webp", dataPath: "/app/public/devrel/q402-keynote.webp"},
	"/devrel/q402-session.webp":            {contentType: "image/webp", dataPath: "/app/public/devrel/q402-session.webp"},
	// pdf
	"/cv/jungho_park_cv_latest.pdf": {contentType: "application/pdf", dataPath: "/app/public/cv/jungho_park_cv_latest.pdf"},
	// kyle-dex swagger
	"/dex/api-docs/favicon-32x32.png": {contentType: "image/png", dataPath: "/app/public/swagger-favicon-32x32.png"},
}
