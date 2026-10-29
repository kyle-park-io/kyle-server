# PARK JUNGHO (Kyle) - CV

**Backend Engineer for Blockchain and Quantitative Trading Systems**

Backend engineer building cross-chain bridges, smart contracts, and trading systems in Rust, Go, and TypeScript. In 2026, Developer Relations Engineer for Korea at Mantle: led builder onboarding for a global hackathon, ran builder workshops, wrote Korean technical docs, and built the 16-module content pipeline the Korea team uses daily.

---

## CONTACT

- **Email**: andy3638@naver.com · **Telegram**: https://t.me/kyleparkio
- **GitHub**: https://github.com/kyle-park-io · **Portfolio**: https://jungho.dev
- **Quant Career**: https://jungho.dev/quant · **Personal Trading Strategies**: https://jungho.dev/personal-quant
- **Live Quant Trading Dashboard**: https://kyle-quant.xyz · password demo2025

---

## PROFESSIONAL EXPERIENCE

### **Mantle**

**Developer Relations Engineer** | Apr 2026 - Oct 2026 (7 months)\
_Tech Stack: TypeScript, Next.js, PostgreSQL, Solidity_

- **Sole designer and implementer of the Korea team's content operations pipeline, deployed to the team (16 modules)**
  - X/Lark collection, Korean translation, per-channel conversion (press releases included), two-stage human review, Telegram/X delivery. A reviewer who never opens a terminal approves the copy and sends it from the same screen (mantle-kr-herald, private repository, available on request)

- **Sole author of the Korean technical documentation set (5 documents)**
  - Mantle block explorer (beginner and deep-dive editions), a DEX comparative deep dive, an AI agent trading path guide, and an asset-withdrawal guide. The deep-dive edition covers modular architecture, Rollup vs. Validium classification, L2's dual gas structure, and why Mantle sits at L2Beat Stage 0. [Docs hub](https://kyle-park.notion.site/Docs-3675e2b105168061b410fdf801eeaac8)

- **Designed and delivered hands-on technical onboarding curriculum**
  - Mantle infra setup, Bybit API, Byreal Skills CLI, MerchantMoe/Agni/Fluxion integrations, testnet contract deployment labs, and a live-built stablecoin pair-trading bot

- **Owned Korea builder onboarding for The Turing Test Hackathon 2026**
  - Built the Korean builder funnel across the full 6-week registration-to-submission window of Phase 2, in a $120K two-phase global flagship program. An offline co-working session, the Seoul hacker house workshop (100+ builders), a live online workshop, and 3 external partner events

- **Ran the Q402 builder workshop on agent payments (Mantle × Quack AI, Aug 2026): 42 builders, 488 on-chain payments in three hours**
  - Each builder connected Q402 to their own AI agent over MCP and paid on Mantle mainnet from the chat window, with no wallet app, no signing prompt, and no MNT for gas. Built the night's operations site myself from three days before the event through the day itself (Next.js, PostgreSQL, Vercel, Q402 MCP): wallet registration, live leaderboard, quest verification, and a QR payment bridge, with every badge judged by reading the chain

- **Taught a stablecoin payments class at Inha University (Oct 2026): 30 of 34 participants completed the classmate transfer, 22 the agent payment**
  - A 165-minute session of the Digital Assets and Market Infrastructure course for finance students, on how stablecoin payments move and what changes when an AI agent pays. Students made a wallet on their phones, sent testnet USDC to a classmate and read the receipt on a block explorer, then signed a spending limit for an AI agent in claude.ai or Codex and watched a request past the limit get refused by both the lab server and the USDC contract. Closed on Korea's won-stablecoin bills, read issue by issue against the USDC the class had just sent. Ran on the lab kit first built for the Q402 workshop, moved to Ethereum Sepolia and Circle's testnet USDC, with the lab server paying the gas. [Slides (Korean)](https://pay-lab-inha.vercel.app/slides)

- **Ran a 7-university blockchain-club campus tour as sole speaker, completed in 3 weeks**
  - KAIST, Korea University, Sungkyunkwan, Ewha Womans, Ajou, Inha, Kwangwoon. Four clubs published their own session recaps unprompted, and one-off visits turned into standing partnerships

- **Co-hosted the monthly Korean livestream: August's post reached 18.0K, the second-highest-reach post on the account over Apr-Sep 2026**
  - July carried Mantle's third anniversary; August ran as a Mantle × Stable collaboration covering the USDT0 stablecoin ecosystem and Chainlink CCIP bridging; September, ahead of KBW, closed with a workshop on choosing among Mantle's RPC providers by request cost. Wrote the July RFQ session up as a standalone Korean article

- **Ran the Korean official account: 279 posts, 246K impressions, 1.74% engagement rate over Apr-Sep 2026 (1.7× the global account's 1.03%)**
  - Korea-originated campaigns and event announcements took all six highest-reach slots

### **Kronon Labs Co., Ltd.**

**Trading System Backend Engineer** | Apr 2025 - Nov 2025 (8 months)\
_Tech Stack: Go (Fiber, Fx, gRPC), Python (Django), PostgreSQL, MongoDB, AWS (ECS, ECR, EC2, Parameter Store, KMS), Docker_

- **CEX Cross-Exchange Arbitrage System (Rothchild)**: a Taker-Taker and Maker-Taker arbitrage system built with the team. Its Go strategy engine trades spreads across Binance, Bybit, Bitget, KuCoin, MEXC, Gate.io, and Bithumb spot markets, Bybit against Jupiter, Bithumb and Upbit KRW markets against Bybit, and the perpetual DEXs Paradex, Backpack, Extended, and Rails. Built its exchange-facing backend: order APIs and user-data WebSockets for 8 exchanges including Gate.io, plus Solana DEX, balances, PnL, a delta manager, and a dashboard tracking PnL and positions in real time
- **Solana DEX Trading Infrastructure**: on-chain trading bots in Go implementing in-house alpha strategies (New Pair Detection, Back From The Dead, Fat LP Analysis), with GoPlus security and wallet and holder entry filters, Jupiter swaps and trigger orders, a price cache with 5-minute and 1-hour volatility, tiered sell rules, and Helius WebSocket monitoring of Pump.fun, Raydium, Orca, and Meteora pools
- **Trading Metrics Collection & Analytics**: an altcoin performance chart backend built with the team: a Django API ranking the top 50 altcoins against BTC, open-interest-to-market-cap ratios from Velo, and kline changes stored in MongoDB. Built its Bybit 1-minute kline WebSocket collector and kline API and added time ranges and BTC change rates to the performance API; also designed a batched metrics collector for strategy detectors
- **AI Sentiment Engine & Exchange Listing Sniper**: built with the team, a sentiment engine that scores news Telegram channels and KOL tweets with several OpenAI assistants and routes signals to Binance and Bybit futures orders, and a listing sniper that catches Upbit and Bithumb listing announcements and sends new symbols over gRPC to order servers in Tokyo and Singapore that place Binance futures, MEXC, and Bybit orders. Right after joining, ran the earlier listing detector, which watched Upbit and Bithumb notices and ordered on Binance futures, Bybit, MEXC, and OKX, in a dev environment and wrote up seven improvements
- **Prediction Market Monitoring (Totoro)**: with the team, a module that pairs Polymarket and Kalshi NFL and Premier League markets by match and pulls their prices

### **Medium Inc.**

**Backend Engineer** | Sep 2022 - Feb 2024 (1 year 6 months)\
_Tech Stack: Go, TypeScript (NestJS), Solidity, Hyperledger Fabric, Kafka, MySQL, AWS, Docker_

- **Cross-Chain Bridge Infrastructure**: a multisig-verified bridge linking the company L1 mainnet RIGO (Cosmos Tendermint with EVM), the private consortium chain MDL (a Hyperledger Fabric 2.2 fork), and Ethereum, with a Kafka event pipeline, 17 bridge chaincodes, and Solidity contracts
- **Security Token Platform (ERC-1400)**: an STO token designed and built as a Go chaincode on Hyperledger Fabric to the ERC-1400 interface: partition-based issue, transfer, and redeem, and token wallets
- **RIGO Chain Communicator**: a Go client sending RIGO transactions over Tendermint RPC, deployed in-house
- **Hyperledger Fabric Network Automation**: Docker Compose and Bash setups for a 3-org, 2-orderer network with CouchDB and a block explorer, plus Docker-free variants

### **BF Labs Inc.**

**Backend Engineer** | Aug 2022 - Sep 2022 (2 months)\
_Tech Stack: Node.js, Express, MariaDB, AWS S3_

- **Government Research Project**: built the report intake and lookup REST API server for an IITP (Institute of Information & Communications Technology Planning & Evaluation) funded project with Node.js, Express, Sequelize, and MariaDB: JWT login, S3 image upload, report search, and a 5-table database schema

---

## EDUCATION & LANGUAGES

- **Kyung Hee University, Seoul**: Bachelor of Engineering in Mechanical Engineering | Mar 2014 - Aug 2022
- **English**: TOEIC Speaking 150/200, Intermediate High · **Korean**: Native
---

## TECHNICAL SKILLS

- **Languages**: Rust, Go, Python, TypeScript
- **Backend Frameworks**: NestJS, Next.js, Fastify, Gin, Fiber, Fx
- **Blockchain**: Solidity (Foundry, Hardhat), Solana (Rust), Hyperledger Fabric
- **Frontend**: React, SolidJS, Astro
- **Infrastructure**: AWS, GCP, Docker, Kubernetes, PostgreSQL, MySQL, Kafka, Redis, Vercel
- **AI Tooling**: Claude Code, Codex, MCP servers, agent skills and trigger evals, agent-in-the-loop pipelines
- **Specializations**: Financial Market Protocols, DeFi Protocols, DEX/CEX Trading Systems, High-Frequency Trading, Medium-Frequency Trading, Cross-Chain Bridges, Internal Tooling & Workflow Automation, Technical Writing

---

## SELECTED PROJECTS

### **mantle-kr-herald**: Content Operations Pipeline (Mantle KR)

_Tech Stack: TypeScript, PostgreSQL, Vercel, Vitest_ · Private repository, available on request

- Sole designer and implementer of the Korea team's content operations pipeline, deployed to the team. **16 modules**, 1,051 commits from July to October 2026, 400 test files (4,801 test cases)
- Translation and conversion run **agent-in-the-loop**: a local coding agent fills a purpose-built worksheet and a human approves the result, behind two mandatory approval gates
- Migrated the record of truth from files to **PostgreSQL and shipped it serverless on Vercel**, so a reviewer who never opens a terminal approves the copy and sends it to Telegram and X from one screen. Persistence sits behind a port in a **hexagonal structure**, so swapping the store stayed at the adapter level. File-lock serialization does not survive serverless, so a dropped ledger row could republish a live post twice; a unique index closes that hazard. Storage adapters are tested against **real Postgres, not a mock**: PGlite boots one in-process
- **Translation memory** mines both official accounts and feeds only human-approved EN↔KO pairs into the few-shot set. A glossary miner proposes Korean renderings and a tuned **rejection threshold** decides which survive, which is the difference between a discriminator and a rubber stamp

### **trustline**: Off-Chain Security Scanner for Web3 Projects

_Tech Stack: TypeScript, Node.js, GitHub Actions_ · https://github.com/kyle-park-io/trustline

- Built after leading the response to a real breach, a Next.js server taken through React2Shell (CVE-2025-55182). **9 scan modules** check the off-chain stack before deploy for the mistakes that let one breach spread: secrets in build output, management ports open to the internet, over-privileged cloud IAM, account-wide credentials, persistence artifacts, and disabled audit logs
- Published on **npm** (`npx trustline-scanner scan .`) and as a **GitHub Marketplace Action**, with SARIF output for GitHub code scanning. A read-only on-chain command recovers the EtherRAT malware's command-and-control values from Ethereum smart contracts and maps the contracts around them; the findings feed the scanner's IOC set

### **skills**: Agent Skill Marketplace for Claude Code and Codex

_Tech Stack: Agent skills, Python, Bash_ · Private repository, available on request

- Turns repeated engineering decisions into skills, packaged as **7 domain plugins** that each repository enables as needed. One source file generates the manifests for both Claude Code and Codex
- **Trigger evals for 8 skills.** The negative queries are the ones that belong to a neighbouring skill, which is what separates a precise trigger from a loose one
- Stack presets (Postgres backend, Next.js on Vercel, Terraform, data analytics) so a new repository starts with the right skills on, plus tested guard hooks on agent file writes and commands

### **writing-guides**: Instructions for Agent-Written Copy

_Tech Stack: Markdown, Node.js, Python_ · Private repository, available on request

- 62 guides for Korean copy, screen copy, translation, talk scripts, and documents. Every rule is tagged with its evidence: a piece of feedback, a published post, or a measurement
- A pre-commit checker (links and anchors, dashes, evidence tags, index completeness, stock closing phrases, section numbering) and a presentation toolchain that builds the PDF, HTML, speaker script, and slide images from one master file

### **muster**: Local Scheduler Dashboard

_Tech Stack: React, Vite, Tailwind CSS, Fastify_ · https://github.com/kyle-park-io/muster

- One screen for Windows Task Scheduler, systemd timers, cron, and Codex and Claude schedules across Windows, WSL, macOS, and Linux. Bound to 127.0.0.1, with a confirmation step that shows the exact command for every change

### **Binance Triangular Arbitrage System**

_Tech Stack: Rust, FIX Protocol, SBE (Simple Binary Encoding)_

- Triangular arbitrage engine that receives order books and sends orders over Binance FIX API sessions in SBE encoding, computing fee-adjusted opportunities on the BTC, ETH, and USDT triangle

### **Polymarket & Crypto Prediction Markets**

_Tech Stack: Go_

- Prediction-market arbitrage and 15-minute crypto momentum trading on sub-$1 mispricings

---

## AWARDS & CERTIFICATIONS

- **1st Place, Mantle Global Hackathon 2025** (DeFi & Composabilities Track Winner, DOOR Protocol) | Feb 2026
  - Wrote the 7 core contracts (150 test functions) for senior/junior tranche vaults (ERC-4626), a safety module, withdrawal epochs, and a rate oracle, plus the Next.js dashboard and keeper bot
- **3rd Place, Seoulana Hackathon 2025** (Solana blockchain development competition) | Apr 2025
  - Built the Orca Whirlpool pool, position, and liquidity transactions for the entry, Stream Square
- **Engineer General Machinery** (Human Resources Development Service of Korea) | Dec 2020

---

## LEADERSHIP & RESEARCH

### **Orakle: KAIST-based Blockchain Research Society**

**Vice President (8th Cohort)** | Mar 2026 - Present · **Team Leader, ODA Team (7th Cohort)** | Sep 2025 - Feb 2026

- Society operations and program direction. Organized the 8th cohort's final research conference (Sep 2026, Hana Bank Lounge, Samseong)

- **Sole author of the 7th cohort's five published DeFi research papers** (CC BY 4.0): https://github.com/orakle-7th-sda/conference-pdf
  - Comprehensive stablecoin depeg survey across CEX venues (2018 - Feb 2026) and on-chain venues (2022 - Feb 2026), by venue, magnitude, cause, and duration
  - Solana searcher/solver strategy design. Six strategy families for real-time depeg arbitrage on Jito bundles, Jupiter v6, and Helius WebSocket
  - Plus a 17-category DeFi ecosystem taxonomy and a cross-category stablecoin map

- **6th Cohort BTCFi Bitcoin Options Service** (May 2025 - Nov 2025): one-way option proof of concept on BitVMX-CPU, a Go backend (60 REST APIs, WebSocket, PostgreSQL), and the BitStriker frontend (React, MutinyNet wallet support)

