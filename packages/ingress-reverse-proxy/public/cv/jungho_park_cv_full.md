# PARK JUNGHO (Kyle) - Full CV

**Backend Engineer for Quantitative Trading and Blockchain Systems**

Backend engineer building cross-exchange arbitrage, on-chain trading, and cross-chain bridges in Rust, Go, and TypeScript. At Kronon Labs, owned 8-exchange order connectivity, PnL, and delta management in the team's arbitrage system. In 2026, joined Mantle, a global company, as Developer Relations Engineer and built the Korea team's content pipeline.

---

## CONTACT

- **Email**: andy3638@naver.com · **Telegram**: https://t.me/kyleparkio
- **GitHub**: https://github.com/kyle-park-io · **Portfolio**: https://jungho.dev
- **Quant Career**: https://jungho.dev/quant · **Personal Trading Strategies**: https://jungho.dev/personal-quant
- **Live Quant Trading Dashboard**: https://kyle-quant.xyz
- **Resume**: https://jungho.dev/cv/jungho_park_cv_latest.pdf

---

## PROFESSIONAL EXPERIENCE

### **Mantle**

**Developer Relations Engineer** | Apr 2026 - Oct 2026 (7 months)\
*Global institutional infrastructure for real-world assets on the Ethereum L2 Mantle Network*\
_Tech Stack: TypeScript, Next.js, PostgreSQL, Solidity_

- **Owned Korea builder onboarding for The Turing Test Hackathon 2026**: a $120K two-phase global flagship hackathon. In Phase 1, the ClawHack AI trading agent contest, ran an X live workshop on building agents and recruited Korean whitelist participants over Telegram. A Korean participant's agent won the volume track at $10.31M, and 12 tracked Korean wallets made up 26.88% of volume. Reported Korean results from the leaderboard API to the global team with Phase 2 requests. Over the 6 weeks of Phase 2, ran an offline co-working session (48 registrations), a live online workshop, and the Seoul hacker house workshop and fireside chat (100+ builders). Presented the hackathon at The Age of Agentic AI meetup, the Mantle Seoul workshop, and the AI community Solp Club

- **Ran the Q402 builder workshop on agent payments (Mantle × Quack AI, Aug 2026)**: 42 builders connected Q402 to their own AI agents over MCP and paid on Mantle mainnet from the chat window, with no wallet app, no signing prompt, and no MNT for gas. Built the operations site as the first version of pay-lab: wallet registration, live leaderboard, quest verification, and a QR payment bridge, with badges and quests judged from on-chain data. 488 on-chain payments in three hours

- **Designed, built, and deployed the Korea team's content operations pipeline**: English posts from Mantle's official X account and messages from the internal Lark chat are collected, translated into Korean, rewritten per channel including press releases, and sent to Telegram and X. Schedulers collect X posts, translate, and convert. Claude Code, a terminal tool, drafts the translations, but reviewers never open a terminal: they approve the translation and then each channel version in the browser before sending. From July 2026 the Korean official account's posts were translated and reviewed in it before posting; by October it had collected 446 X posts and made 162 translations and 837 channel versions

- **Ran the Korean official account**: 279 posts, 246K impressions, and a 1.74% engagement rate over Apr-Sep 2026, 1.7× the global account's 1.03%. Korea-team campaigns and event notices took the top six posts by reach

- **Taught a stablecoin payments class at Inha University (Oct 2026)**: a session of the Digital Assets and Market Infrastructure course for finance students, on how stablecoin payments move and what changes when an AI agent pays. Ran two labs on pay-lab: students made a wallet on their phones, sent testnet USDC to a classmate and read the receipt on a block explorer, then signed a spending limit for an AI agent in claude.ai or Codex and watched a request past the limit get refused by both the lab server and the USDC contract. Covered Korea's pending won-stablecoin bills issue by issue: who may issue, reserves and redemption, and interest\
  Link to the slides, in Korean: https://pay-lab-inha.vercel.app/slides

- **Wrote the Korean technical documentation set (5 documents)**: Mantle block explorer (beginner and deep-dive editions), a DEX comparative deep dive, an AI agent trading path guide, and an asset-withdrawal guide. The deep-dive edition covers modular architecture, Rollup vs. Validium classification, L2's dual gas structure, and why Mantle sits at L2Beat Stage 0\
  Link to the documents: https://kyle-park.notion.site/Docs-3675e2b105168061b410fdf801eeaac8

- **Co-hosted the Korean X livestream and presented its technical session (Apr - Sep 2026)**: co-hosted from April, ran the Phase 1 and 2 hackathon segments with ClawHack agent traders as guests, and from July presented a technical session monthly. July's RFQ session set AMM, on-chain CLOB, RFQ, and intent execution side by side and became a standalone X article. August's bridge session covered Lock & Mint against Burn & Mint and Mantle's bridge routes: the canonical bridge, LayerZero OFT, and Chainlink CCIP. September's RPC workshop compared seven Mantle RPC providers and priced three of them per month by app type. The August live post drew 18.0K views, the Korean account's second-highest over Apr-Sep 2026

- **Campus tour of university blockchain clubs (May 2026)**: presented Mantle's builder programs and hackathon tracks at seven clubs over three weeks: KAIST, Korea University, Sungkyunkwan, Ewha Womans, Ajou, Inha, and Kwangwoon. Ran a Mantle testnet contract deployment lab at Sungkyunkwan and a live build of a stablecoin pair-trading bot at Ewha. The Korea University, Ewha, Sungkyunkwan, and KAIST clubs posted session recaps on their X accounts. In the campus research contest introduced on the tour, a Sungkyunkwan club member won the grand prize and the Kwangwoon club won the most-participating-club award

### **Kronon Labs Co., Ltd.**

**Trading System Backend Engineer** | Apr 2025 - Nov 2025 (8 months)\
_Tech Stack: Go (Fiber, Fx, gRPC), Python (Django), PostgreSQL, MongoDB, AWS (ECS, ECR, EC2, Parameter Store, KMS), Docker_

- **CEX Cross-Exchange Arbitrage System (Rothchild)**: a Taker-Taker and Maker-Taker arbitrage system built with the team. Its Go strategy engine trades spreads across Binance, Bybit, Bitget, KuCoin, MEXC, Gate.io, and Bithumb spot markets, Bybit against Jupiter, Bithumb and Upbit KRW markets against Bybit, and the perpetual DEXs Paradex, Backpack, Extended, and Rails. Owned the console backend for orders, balances, and PnL: added order replacement and lookup methods to the common exchange interface, and built order placement, cancellation, replacement, and lookup, user-data WebSockets for fills, and keepalive and reconnection for 8 exchanges including Gate.io, plus Solana DEX. Built PnL with 1- and 5-minute history and 1h, 4h, 1d, and 7d totals, a delta manager that nets each asset's delta and clears it on the exchange holding the largest balance, and a dashboard tracking PnL and positions in real time. Set up recorded exchange responses to test each integration
- **Solana DEX On-Chain Trading Bots**: bots in Go running three alpha strategies (New Pair Detection, Back From The Dead, Fat LP Analysis). GoPlus security checks and top-30-holder and fresh-wallet-share entry filters, Jupiter swaps and trigger orders, a price cache with 5-minute and 1-hour volatility, tiered sell rules, and Helius WebSocket monitoring of Pump.fun, Raydium, Orca, and Meteora pools. Moved the two holder-analysis services' direct Solscan calls behind one call-coordination service that queues requests at three priorities and enforces the rate limit in one place; a worker pool makes the calls
- **News and KOL Signal Trading Engine**: a futures trading engine built with the team. It ingests private Telegram channels and X list tweets, scores each item's similarity to known events with the average of several OpenAI assistants, and routes signals to Binance and Bybit USDT-futures orders. Built the X list-tweet collector, the private Telegram channel subscription, and the multi-assistant scoring. Compared the spread of LLM scores over 5 repeated calls on 1 article and 10 comparison articles
- **Exchange Listing Sniper**: built with the team, a sniper that catches Upbit and Bithumb listing announcements and sends new symbols over gRPC to order servers in Tokyo and Singapore that place Binance futures, MEXC, and Bybit orders. Ran the earlier listing detector, which watched Upbit and Bithumb notices and ordered on Binance futures, Bybit, MEXC, and OKX, in a dev environment and listed seven improvements
- **Trading Metrics Collection & Analytics**: for an altcoin performance chart backend built with the team, which ranks the top 50 altcoins against BTC alongside open-interest-to-market-cap ratios from Velo, built the Bybit 1-minute kline WebSocket collector and kline API and added time ranges and BTC change rates to the performance API. Also designed a batched metrics collector for strategy detectors
- **Prediction Market Monitoring (Totoro)**: with the team, a module that pairs Polymarket and Kalshi NFL and Premier League markets by match and pulls their prices

### **Medium Inc.**

**Backend Engineer** | Sep 2022 - Feb 2024 (1 year 6 months)\
_Tech Stack: Go, TypeScript (NestJS), Solidity, Hyperledger Fabric 2.2, Kafka, MySQL, AWS, Docker_

- **Cross-Chain Bridge Infrastructure**: built with the team, a multisig-verified bridge linking the company L1 mainnet RIGO (Cosmos Tendermint with EVM), the private consortium chain MDL (a Hyperledger Fabric 2.2.2 fork), and Ethereum. A Kafka event pipeline in which the mediator and the validators each read the per-chain topics (mdl, rigo, bridge) in their own consumer group; a redelivered event is recognized by its transaction-ID primary key and skipped, and a restarted server re-reads missed transactions from the last processed block recorded on chain. 17 bridge chaincodes and Solidity contracts
- **Security Token Platform (ERC-1400)**: an STO token designed and built as a Go chaincode on Hyperledger Fabric to the ERC-1400 interface: partition-based issue, transfer, and redeem, and token wallets
- **RIGO Chain Communicator**: a Go client sending RIGO transactions over Tendermint RPC, deployed in-house
- **Hyperledger Fabric Network Automation**: Bash scripts that automate Fabric CA enrollment, genesis block and channel transaction generation, orderer, peer, and CouchDB startup, channel creation and joins, anchor peer updates, the chaincode package, install, approve, and commit steps, and the block explorer connection. Seven Docker Compose configurations with different channel, organization, and orderer counts on Fabric 2.2.6 and 2.2.13 images, the largest with 3 organizations and 2 etcdraft orderers, plus four configurations that run the same sequence from Fabric binaries on Linux and macOS without Docker

### **BF Labs Inc.**

**Backend Engineer** | Aug 2022 - Sep 2022 (2 months)

- **Government Research Project**: built the report intake and lookup REST API server for a project funded by Korea's IITP with Node.js, Express, and MariaDB

---

## EDUCATION & LANGUAGES

- **Kyung Hee University, Seoul**: Bachelor of Engineering in Mechanical Engineering | Mar 2014 - Aug 2022
- **English**: TOEIC Speaking 150/200, Intermediate High · **Korean**: Native

---

## TECHNICAL SKILLS

- **Specializations**: CEX/DEX Trading Systems, Exchange Connectivity and Order Management (REST, WebSocket, FIX/SBE), PnL/Delta Management, Cross-Exchange & Triangular Arbitrage, DeFi Protocols, Cross-Chain Bridges, Smart Contracts (ERC-4626, ERC-2612, ERC-3009), Security Tokens (ERC-1400 style), Workflow Automation, Technical Writing
- **Languages**: Rust, Go, Python, TypeScript
- **Blockchain**: Solidity (Foundry, Hardhat), Solana (Rust), Hyperledger Fabric
- **Backend Frameworks**: NestJS, Next.js, Fastify, Django, Gin, Fiber, Fx
- **Infrastructure**: AWS, GCP, Docker, Kubernetes, PostgreSQL, MySQL, Kafka, Redis, Vercel
- **AI Tooling**: Claude Code, Codex, MCP servers, agent skills, trigger evals, guardrail hooks, human-in-the-loop pipelines
- **Frontend**: React, SolidJS, Astro

---

## SELECTED PROJECTS

### **mantle-kr-herald**: Mantle Korea Team's Human-in-the-Loop Content Pipeline

_Tech Stack: TypeScript, PostgreSQL, Vercel, Vitest, Claude Code_

- **Re-runnable stages**: collection, translation, conversion, formatting, and delivery are each a command that can be re-run, and approval is kept apart from sending. One systemd timer collects new X posts and drafts their translations, another turns approved translations into formatted channel versions, and each stops where a person has to approve. A per-item lineage records every stage's output so each review edit can be traced
- **Translation and translation memory**: a coding agent (Claude Code) fills a worksheet file left with empty translation slots, and a person edits and approves it on the review screen. Approved translations become few-shot examples, a translation memory of paired official English and Korean posts adds precedents with overlapping tags, and weekly glossary mining from human edits drops one-off corrections the Korean account never uses. The 178-term glossary feeds the prompt and a term check
- **Repurposing and multi-channel delivery**: one approved translation becomes 12 content types such as announcements, explainers, KOL copy, and press releases, formatted for 9 channels and sent via the Telegram Bot API and Typefully to X, LinkedIn, Threads, Bluesky, Mastodon, and Substack, with idempotent sends even on serverless functions, where a file lock and in-process serialized writes no longer hold: the delivery ledger's primary key (item, type, outlet) rejects a second record of the same send
- **Config split and hexagonal structure**: accounts, glossary, and conversion guides live in config, so another brand can reuse it. With external APIs and storage behind 34 ports, moving storage from files to PostgreSQL on Vercel serverless added 19 adapters without touching domain code. 5,115 test cases; storage adapters run against Postgres started in process
- **Delivery ledger concurrency test**: inserted the same key 100 times concurrently through the original delivery-ledger code over 2 and 10 real Postgres connections, 30 repetitions each; every repetition ended with 1 row (November 2026, local Postgres 16)
- **Query plan test**: ran the item-lineage lookup (a lineage table keyed only by ordinal, queried by item_id) on 1,000,000 synthetic rows with EXPLAIN (ANALYZE, BUFFERS). An (item_id, ordinal) index turned a Seq Scan into an Index Scan, cut buffers read from 57,947 to 9, and lowered p99 by 96x to 211x across three measured runs, while insert throughput stayed at 103.3% of the unindexed table on average and 90.9% in the worst pairing (November 2026, local Postgres 18)

### **pay-lab**: On-Chain Payments Lab Kit Reconfigured per Workshop or Class

_Tech Stack: Next.js, PostgreSQL, Privy, viem, MCP, Foundry, Vercel_

- **Reusable kit**: split the Q402 workshop site into lab modules, per-event config, and chain adapters, tied to no single event or chain. One setting picks the chain and stablecoin, so the same code runs on Mantle mainnet, Mantle Sepolia, Ethereum Sepolia, or local Anvil, and a new event adds one per-event config that picks its lab modules and limits. An architecture test keeps the service layer from importing any event or chain config. Ran the Oct 2026 Inha University class on this kit on Ethereum Sepolia
- **Gasless payments and agent limits**: relays students' ERC-3009 signed USDC transfers and pays the gas. Agent wallet tools spend only within the student's ERC-2612 permit, through a remote MCP server on wallet-signature OAuth for claude.ai and Codex that takes the sender only from the access token
- **Money-path safety**: fail-closed, so nothing is sent when any balance, limit, or registration check fails. Lab USDC funding is idempotent: it inserts a record keyed by event and address before sending, so one address is never funded twice. When a serverless function stops mid-send and leaves a record without a transaction hash, reconciliation releases it only after the funding wallet's pending transactions and the Transfers to that address show it was not sent. A production load test the day before the lecture showed several Vercel function instances building transactions with the server wallet's same nonce, so each send now takes a PostgreSQL advisory lock per chain and wallet and reads the next nonce recorded in a per-wallet table; after the fix, sends from 30 simulated students within 2 seconds all went through
- **Concurrent send test**: ran the server wallet's send-lock code against local Postgres 16 and a local chain with a 400 ms delay before each chain call, sending 20 transactions at once from one wallet, 50 times. With only an in-process lock, 698 of 1,000 sends failed with nonce too low after 3 retries; the PostgreSQL advisory lock gave 0 duplicate and 0 skipped nonces in the same setup and at 30 and 100 concurrent sends. When 100 arrived at once, 602 of 1,000 sends waited past the 15-second lock_timeout and ended in a timeout (55P03) (November 2026, desktop WSL2)

### **Binance Triangular Arbitrage Engine**

_Tech Stack: Rust, FIX 4.4, SBE (Simple Binary Encoding), rustls_

- Rust engine that logs on to the Binance FIX API with an Ed25519 signature and opens market data and order entry sessions in SBE binary encoding, keeping order books from snapshots and incremental refreshes and handling new orders, cancels, and execution reports
- On every book update, prices both directions of the BTC, ETH, and USDT triangle after each symbol's taker fee and keeps the direction that clears the threshold. Runs as a dry run by default, with Telegram alerts

### **Polymarket 15-Minute Market Complete-Set Arbitrage Bot**

_Tech Stack: Go, Rust_

- Buys both outcomes in Polymarket's 15-minute crypto Up/Down markets when their best asks sum below $1. Once both legs fill, each pair is worth $1 at settlement or on a merge; fees and leg risk decide whether it pays
- In v1, a stale-quote filter drops a signal when the two quotes are over 29ms apart, the older one is over 29ms old, or over 29ms passes before the order. v2 re-derives the threshold from the fee table and pre-signs orders across price levels to send both legs as FOK, so no unfilled order rests on the book. Execution is off by default, with Telegram alerts

### **trustline**: Off-Chain Security Scanner for Web3 Projects

_Tech Stack: TypeScript, Node.js, GitHub Actions_ · https://github.com/kyle-park-io/trustline

- Built after leading the response to a breach, a Next.js server taken through React2Shell (CVE-2025-55182). **9 scan modules** check the off-chain stack before deploy for the mistakes that let one breach spread: secrets in build output, management ports open to the internet, over-privileged cloud IAM, account-wide credentials, persistence artifacts, and disabled audit logs
- Published on **npm** (`npx trustline-scanner scan .`) and as a **GitHub Marketplace Action**, with SARIF output for GitHub code scanning. An on-chain command finds the C2 address the EtherRAT malware reads from an Ethereum contract and the operator's other C2 contracts, and adds them to the IOC dataset so other projects can match them

### **skills**: Agent Skill Marketplace and Guardrail Hooks for Claude Code and Codex

_Tech Stack: Agent skills, Python, Bash_

- Turns repeated engineering decisions into skills in **7 domain plugins**, with Claude Code and Codex manifests generated from one source and stack presets that start a new repository with the right skills on
- **Trigger evals**: runs Claude Code and Codex non-interactively with the plugin installed and watches the session stream for the target skill. Negative queries belong to a neighbouring skill; project-templates scored 1.0 precision and recall over 14 queries run 3 times each
- **Guardrail hooks**: PreToolUse hooks block nested subagents, more than 5 spawns in 10 minutes, unconfirmed parallel sessions, .env secret output, and banned writing patterns

### **writing-guides**: Instructions and Output Checks for Agent-Written Copy

_Tech Stack: Markdown, Node.js, Python_

- 53 instruction files for agent-written Korean copy, screen copy, translation, talk scripts, and documents. Each rule cites the feedback, post, or measurement behind it, and corrections update both
- The document checker and the agent PreToolUse hook share banned patterns, checked for parity before commit; a deck toolchain builds PDF, HTML, script, and slides from one master and checks contrast and layout

### **muster**: Local Scheduler Dashboard

_Tech Stack: React, Vite, Tailwind CSS, Fastify_ · https://github.com/kyle-park-io/muster

- Shows Windows Task Scheduler, systemd timers, cron, and Codex and Claude schedules per environment on one screen and toggles or runs user-owned jobs. Bound to 127.0.0.1; every change shows the exact command first

### **Kronon Labs Code Re-Measured**: Solscan Call Coordination, News Scoring, Listing-Notice Reception, and Delta Liquidation Rebuilt and Tested Under the Same Conditions

_Tech Stack: Go, Rust, Python_

- **Solscan call coordinator**: rebuilt in Go the call coordinator that the Solana bot's holder-analysis services share, and compared 5 structures behind the same limit (mock server, 1,000 calls per 60 seconds) on 10,000 synthetic calls (1,000 High, 3,000 Medium, 6,000 Low, arriving at 20 per second), 3 runs each. The earlier structure (2 concurrent calls per service and a 200 ms pause after each call) drew 155 HTTP 429 responses (median; range 134 to 185) and a High-priority wait p99 of 238 ms; a priority channel with a token bucket drew 0 and 111 ms. A ring buffer carrying the original code's protocol lost calls in every stress run (1,000,000 unique IDs; 1 to 8 producers and consumers, 18 runs per pairing), and a ring with per-slot sequence stamps lost none (November 2026, desktop WSL2)
- **Instruction-version evaluation harness**: wrote a Python harness that compares two versions of a judgment instruction by per-call article-ID mismatch rate and order preservation, run on gpt-4.1 Batch with a strict schema. With 10 comparison articles per call (pool of 22 articles), 197 calls per version gave 1 mismatch and 0; with 30 comparison articles (pool of 278), 75 calls per version gave 0 for both, so the versions could not be told apart, and accuracy was not measured because no answer labels exist. The mean per-article score standard deviation over 5 repeated calls was 2.92 for the older version and 1.73 for the newer one (20 calls per version; the only one of four metrics whose interval excluded 0) (November 2026)
- **Listing-notice latency test**: called the Upbit market-list API 6,000 times at 1 call per second and compared the latency of one request by phase (DNS, TCP, TLS, server response) between opening a new connection per request and reusing one (HTTP/1.1, HTTP/2, conditional requests). A new connection gave a total p99 of 62.0 ms against 18.8 to 21.5 ms for reuse, 40.5 to 43.2 ms lower with confidence intervals excluding 0. At a 1-second polling interval the simulated detection delay was p50 509 to 530 ms and p99 1,001 to 1,023 ms, so the interval outweighs the request latency (November 2026; values are for the market-list endpoint, not the notice path)
- **Delta liquidation policy replay**: recorded 24 hours of order books for 8 assets on Binance, Bybit, and MEXC and replayed them to compare the per-liquidation total cost of 6 Delta liquidation policies over 29,773 paired events, under the original code's auto-balancer transfer rule, mock balances, and assumed fees. Splitting across venues cost 6.8 bps less than liquidating on the venue with the largest balance (95% CI 6.1 to 7.5 bps), and the difference disappeared with a zero minimum transfer (measured November 2026)

### **matching-ledger**: Single-Writer Matching Engine and Double-Entry Settlement Ledger

_Tech Stack: Rust_

- Built a single-writer matching engine and input log in Rust. Replaying 10 different synthetic order logs under 16 conditions, 320 replays in all, gave 0 state-hash mismatches, and 2,000 tail corruptions of one log (1,000 truncations, 1,000 bit flips) and 400 kill -9 runs gave 0 prefix-recovery failures (November 2026, desktop WSL2)
- A configuration that calls fdatasync per batch before replying held a confirmation p99 of 10.3 to 10.5 ms at 20,000 orders per second (median of 6 configurations, 7 crossed rounds) and sustained 40,000 orders per second in all 10 runs; the per-command fdatasync configuration missed offered rates of 270 and 340 orders per second in all 10 runs and reached only 135 to 168 per second (open-loop measurement, WSL2 virtual disk)
- Built accounts, balance reservation, and fill settlement (double-entry transfers) inside the matching engine. Across 1,000 workloads (5,128,000 commands) it showed 0 invariant violations (asset conservation, no negative balance, reservation match) and 0 differences from an independent balance model, and detected all 400 ledgers broken on purpose in 4 ways. Recovering from a snapshot plus the log tail cut the recovery of a 10.2-million-record log (about 2.5 million resting orders) from a median 5.43 s of full replay to 1.65 s (a snapshot every 1,000,000 records, worst point) or 1.25 s (every 250,000), with non-overlapping ranges and the log and snapshot in the OS write cache; 4,000 corrupted snapshots were rejected and 350 kill -9 runs gave 0 recovery failures. A fork snapshot cut the median longest engine pause from 377 ms with sync to 58 ms (1,000,000 accounts; 7 of 10 runs exceeded 50 ms) (November 2026)

### **judgment-pipeline**: Fault Tests of a Messaging Pipeline That Carries Article Judgments Through Approval to Dispatch

_Tech Stack: Rust, Python, Kafka, Redis Streams, NATS JetStream, RabbitMQ, PostgreSQL_

- In a fault test that killed a message consumer with SIGKILL 86 times, the Redis Streams, NATS JetStream, and Kafka adapters all lost 0 messages with ack after processing, and a primary-key sink took 0 duplicates (row counts equal to the 46,192, 46,212, and 149,229 messages sent), while a sink without the key took 9, 16, and 1,167 duplicate effects. With a 0 ms judge delay the median p50 latency was 1.94, 2.10, and 2.24 ms (32 repeats) (November 2026; fake judge with a 50 ms delay, 8 concurrent messages per consumer, desktop WSL2)
- Killing the producer and relay with SIGKILL 40 times left 33 to 38 items only in the DB with commit-then-publish and 1 to 11 only in the sink with publish-then-commit, while a transactional outbox had 0 mismatches on all 4 adapters (Kafka, Redis Streams, NATS JetStream, RabbitMQ) with 20 producer kills and 20 relay kills. Killing the broker process with SIGKILL lost every confirmed message on Redis default settings, NATS memory storage, and RabbitMQ transient messages, and lost none in 3 of 3 runs on Redis AOF, NATS file storage, Kafka, and RabbitMQ persistent messages (a process-kill test; fsync and power loss were not tested) (November 2026)

---

## AWARDS & CERTIFICATIONS

- **1st Place, DeFi & Composability Track, and Mantle Incubation Grant, Mantle Global Hackathon 2025** (DOOR Protocol) | Feb 2026
  - 500+ submissions from 2,000+ builders across 6 tracks and $150K in prizes. Only 3 teams received Mantle incubation grants for long-term support after the event
  - A DeFi rate protocol on Mantle that splits yield and risk into senior and junior tranches. Wrote all of it: the proposal, the 7 core contracts for ERC-4626 tranche vaults, a safety module, withdrawal epochs, and a rate oracle, the backend API, the rate-oracle collectors, the Next.js dashboard, and the keeper bot
- **3rd Place, Bitcoin on Solana Track (Zeus Network), Seoulana Hackathon 2025** (Solana blockchain development competition) | Apr 2025
  - Built the Orca Whirlpool pool, position, and liquidity transactions for the entry, Stream Square
- **Engineer General Machinery** (Human Resources Development Service of Korea) | Dec 2020

---

## LEADERSHIP & RESEARCH

### **Orakle: KAIST-based Blockchain Research Society**

**Vice President (8th Cohort)** | Mar 2026 - Present · **Team Leader, ODA Team (7th Cohort)** | Sep 2025 - Feb 2026

- Society operations and program direction. Organized the 8th cohort's final research conference (Sep 2026, Hana Bank Lounge, Samseong)

- **Wrote the 7th cohort's five published DeFi research papers** (CC BY 4.0)\
  Link to the papers: https://github.com/orakle-7th-sda/conference-pdf
  - Stablecoin depeg survey covering CEX cases from 2018 to Feb 2026 and on-chain cases from 2022 to Feb 2026, by venue, magnitude, cause, and duration
  - Solana searcher/solver strategy design. Six strategy families for real-time depeg arbitrage on Jito bundles, Jupiter v6, and Helius WebSocket
  - Built a Solana depeg searcher in Go that sorts each depeg into four causes (pool imbalance, fear depeg, structural collapse, liquidity drain), arbitrages recoverable depegs through Jito bundles, and never trades a structural collapse. It reads three USDC/USDT pools on Orca, Meteora, and Raydium over Helius WebSocket and compares them with Pyth oracle and Binance and Coinbase prices; to skip transient rebalances and thin pools, it classifies a deviation only when it exceeds 0.1% for over 2 seconds in a pool with at least $50,000 TVL\
    Repository: https://github.com/orakle-7th-sda/defi-searcher
  - Plus a 17-category DeFi ecosystem taxonomy and a cross-category stablecoin map

- **6th Cohort BTCFi Bitcoin Options Service** (May 2025 - Nov 2025): one-way option PoC on BitVMX-CPU, a Go backend (60 REST APIs, WebSocket, PostgreSQL), and the BitStriker frontend (React, MutinyNet wallet)

