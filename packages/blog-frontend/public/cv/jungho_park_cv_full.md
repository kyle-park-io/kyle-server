# PARK JUNGHO (Kyle) - Full CV

**Backend Engineer for Quantitative Trading and Blockchain Systems**

Backend engineer building cross-exchange arbitrage, on-chain trading, and cross-chain bridges in Rust, Go, and TypeScript. At Kronon Labs, owned 8-exchange order connectivity, PnL, and delta management in the team's arbitrage system. In 2026, joined Mantle, a global company, as Developer Relations Engineer, running Korea builder onboarding for its hackathon and a mainnet payments workshop and building the Korea team's content pipeline that the Korean official account still uses.

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

- **Owned Korea builder onboarding for The Turing Test Hackathon 2026**: a $120K two-phase global flagship hackathon. In Phase 1, the ClawHack AI trading agent contest, ran an X live workshop on building agents and recruited Korean whitelist participants over Telegram. A Korean participant's agent won the volume track at $10.31M, and the tracked Korean wallets, the winner's included, made up 26.88% of the contest's $45.5M total volume. Reported Korean results from the leaderboard API to the global team with Phase 2 requests. Over the 6 weeks of Phase 2, ran an offline co-working session with 48 registrations, a live online workshop, and the Seoul hacker house workshop and fireside chat for 100+ builders. At outside events, appeared as a guest of the AI community Solp Club, led the main session of the community-run Mantle Seoul workshop, and presented the hackathon at The Age of Agentic AI meetup, which Mantle sponsored and 170+ AI × Crypto builders attended

- **Ran the Q402 builder workshop on agent payments (Mantle × Quack AI, Aug 2026)**: a workshop where builders connected Q402 to their own AI agents over MCP and paid on Mantle mainnet from the chat window, with no wallet app, no signing prompt, and no MNT for gas. Built the operations site as pay-lab v1: wallet registration, live leaderboard, quest verification, and a QR payment bridge, with badges and quests judged from on-chain data. 42 builders made 488 mainnet payments in three hours

- **Designed, built, and deployed the Korea team's content operations pipeline**: English posts from Mantle's official X account and messages from the internal Lark chat are collected, translated into Korean, rewritten per channel including press releases, and sent to Telegram and X. Schedulers collect X posts, translate, and convert. Claude Code, a terminal tool, drafts the translations, but reviewers never open a terminal: they approve the translation and then each channel version in the browser before sending. By October it had collected 446 X posts and made 162 translations and 837 channel versions. The Korean official account has published through it since July 2026 and still does

- **Ran the Korean official account**: 279 posts, 246K impressions in total, and a 1.74% engagement rate per impression over Apr-Sep 2026, 1.7× the global account's 1.03%. Korea-team campaigns and event notices took the top six posts by reach

- **Taught a stablecoin payments class at Inha University (Oct 2026)**: a session of the Digital Assets and Market Infrastructure course for finance students, on how stablecoin payments move, what changes when an AI agent pays, and Korea's pending won-stablecoin bills issue by issue: who may issue, reserves and redemption, and interest. Ran two labs on pay-lab: students made a wallet on their phones, sent testnet USDC to a classmate, and read the receipt on a block explorer, then signed a spending limit to let an AI agent in claude.ai or Codex pay for them, with requests past the limit refused by both the lab server and the USDC contract. 30 students sent testnet USDC to a classmate, and 22 signed a spending limit for an AI agent and paid through the agent within it\
  Link to the slides, in Korean: https://pay-lab-inha.vercel.app/slides

- **Wrote the Korean technical documentation set (5 documents)**: Mantle block explorer (beginner and deep-dive editions), a DEX comparative deep dive, an AI agent trading path guide, and an asset-withdrawal guide. The deep-dive edition covers modular architecture, Rollup vs. Validium classification, L2's dual gas structure, and why Mantle sits at L2Beat Stage 0\
  Link to the documents: https://kyle-park.notion.site/Docs-3675e2b105168061b410fdf801eeaac8

- **Co-hosted the Korean X livestream and presented its technical session (Apr - Sep 2026)**: co-hosted from April, ran the Phase 1 and 2 hackathon segments with ClawHack agent traders as guests, and from July presented a technical session monthly. July's RFQ session set AMM, on-chain CLOB, RFQ, and intent execution side by side and became a standalone X article. August's bridge session covered Lock & Mint against Burn & Mint and Mantle's bridge routes: the canonical bridge, LayerZero OFT, and Chainlink CCIP. September's RPC workshop compared seven Mantle RPC providers and priced three of them per month by app type. The X post carrying the August livestream drew 18.0K views, the Korean account's second-highest over Apr-Sep 2026

- **Campus tour of university blockchain clubs (May 2026)**: presented Mantle's builder programs and hackathon tracks at seven clubs over three weeks: KAIST, Korea University, Sungkyunkwan, Ewha Womans, Ajou, Inha, and Kwangwoon. Ran a Mantle testnet contract deployment lab at Sungkyunkwan and a live build of a stablecoin pair-trading bot at Ewha. The Korea University, Ewha, Sungkyunkwan, and KAIST clubs posted session recaps on their X accounts. In the campus research contest introduced on the tour, a Sungkyunkwan club member won the grand prize and the Kwangwoon club won the most-participating-club award

### **Kronon Labs Co., Ltd.**

**Trading System Backend Engineer** | Apr 2025 - Nov 2025 (8 months)\
_Tech Stack: Go (Fiber, Fx, gRPC), Python (Django), PostgreSQL, MongoDB, AWS (ECS, ECR, EC2, Parameter Store, KMS), Docker_

- **CEX Cross-Exchange Arbitrage System (Rothchild)**: a Taker-Taker and Maker-Taker arbitrage system built with the team and traded live. Its Go strategy engine trades spreads across Binance, Bybit, Bitget, KuCoin, MEXC, Gate.io, and Bithumb spot markets, Bybit against Jupiter, Bithumb and Upbit KRW markets against Bybit, and the perpetual DEXs Paradex, Backpack, Extended, and Rails. Owned the console backend for orders, balances, and PnL: added order replacement, lookup, and reconnection to the common exchange interface to connect orders on 8 exchanges including Gate.io, plus Solana DEX, and set up recorded exchange responses to test each integration. Built PnL with 1- and 5-minute history and 1h, 4h, 1d, and 7d totals, a delta manager that nets each asset's delta, the position left when only one side filled, and clears it on the exchange holding the largest balance, and a dashboard tracking PnL and positions in real time
- **Solana DEX On-Chain Trading Bots**: designed Go bots running the New Pair Detection, Back From The Dead, and Fat LP Analysis alpha strategies, split into collector, listener, and executor servers. They watch Pump.fun, Raydium, Orca, and Meteora pools over Helius WebSocket, filter entries with GoPlus security checks and top-30-holder and fresh-wallet shares, and trade with Jupiter swaps and trigger orders, a price cache with 5-minute and 1-hour volatility, and tiered sell rules. Moved the two holder-analysis services' direct Solscan calls behind one call-coordination service that queues requests at three priorities for a worker pool and enforces the rate limit in one place. Ran with live orders on Solana mainnet
- **News and KOL Signal Trading Engine**: a futures trading engine built with the team that ingests private Telegram channels and X list tweets and scores each item's similarity to known events with the average of several OpenAI assistants. Built the X list-tweet collector, the private Telegram channel subscription, and the multi-assistant scoring, and compared the spread of LLM scores over 5 repeated calls on 1 article and 10 comparison articles. Its verdicts were executed as live Binance and Bybit USDT-futures orders
- **Exchange Listing Sniper**: built with the team, a sniper that catches Upbit and Bithumb listing announcements and sends new symbols over gRPC to order servers in Tokyo and Singapore that place Binance futures, MEXC, and Bybit orders. Ran the earlier listing detector, which watched Upbit and Bithumb notices and ordered on Binance futures, Bybit, MEXC, and OKX, in a dev environment and listed improvements to its configuration, error handling, logging, unit tests, concurrency control, and strategy executor. A self-built notice collector spread over 20 VPSs received one listing notice 269 ms ahead of an external notice-feed API in a June 26, 2025 test
- **Trading Metrics Collection & Analytics**: for an altcoin performance chart backend built with the team, which ranks the top 50 altcoins against BTC alongside open-interest-to-market-cap ratios from Velo, built the Bybit 1-minute kline WebSocket collector, the kline API, and the performance API's time ranges and BTC change rates, and designed a batched metrics collector for strategy detectors. The team used the chart in its trading decisions
- **Prediction Market Monitoring (Totoro)**: with the team, a module that pairs Polymarket and Kalshi NFL and Premier League markets by match and pulls their prices

### **Medium Inc.**

**Backend Engineer** | Sep 2022 - Feb 2024 (1 year 6 months)\
_Tech Stack: Go, TypeScript (NestJS), Solidity, Hyperledger Fabric 2.2, Kafka, MySQL, AWS, Docker_

- **Cross-Chain Bridge Infrastructure**: built with the team from 17 chaincodes and Solidity contracts, a multisig-verified bridge linking the company L1 mainnet RIGO (Cosmos Tendermint with EVM), the private consortium chain MDL (a Hyperledger Fabric 2.2.2 fork), and Ethereum. Built a Kafka event pipeline in which the mediator and the validators each read the per-chain topics (mdl, rigo, bridge) in their own consumer group; a redelivered event is recognized by its transaction-ID primary key and skipped, and a restarted server re-reads missed transactions from the last processed block recorded on chain. Ran in B2B trials with businesses
- **Security Token Platform (ERC-1400)**: designed and built a Go chaincode on Hyperledger Fabric for an ERC-1400 security token's partition-based issue, transfer, and redeem, and token wallets, used in PoC trials with companies
- **RIGO Chain Communicator**: a Go client sending RIGO transactions over Tendermint RPC, deployed in-house
- **Hyperledger Fabric Network Automation**: Bash scripts that bring up a Fabric network from Fabric CA enrollment through chaincode commit and the block explorer connection. Seven Docker Compose configurations with different channel, organization, and orderer counts, the largest with 3 organizations and 2 etcdraft orderers, on Fabric 2.2.6 and 2.2.13 images, plus four configurations that run the same sequence from Fabric binaries on Linux and macOS without Docker. The team used these configurations to bring up its Fabric networks

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
- **Repurposing and multi-channel delivery**: one approved translation becomes 12 content types such as announcements, explainers, KOL copy, and press releases, formatted for 9 channels and sent via the Telegram Bot API and Typefully to X, LinkedIn, Threads, Bluesky, Mastodon, and Substack, with idempotent sends even on serverless functions, where a file lock and in-process serialized writes no longer hold: the delivery ledger's primary key (item, type, outlet) keeps one record per send
- **Config split and hexagonal structure**: accounts, glossary, and conversion guides live in config, so another brand can reuse it. With external APIs and storage behind 34 ports, moving storage from files to PostgreSQL on Vercel serverless added 19 adapters without touching domain code. 5,115 test cases; storage adapters run against Postgres started in process
- **Delivery ledger concurrency test**: To confirm that idempotent sending, where the same post never goes out twice, holds while several serverless functions run at once, inserted the same delivery record 100 times concurrently into the ledger built on a primary key and a single insert statement, 30 times each over 2 and 10 real PostgreSQL connections, and every repetition left one record. Measured in November 2026 by running the original delivery-ledger code on local Postgres 16
- **Query plan test**: To verify how much the lookups cost on large data, read query plans over 1,000,000 synthetic rows, found the item-history lookup scanning the whole item-history (lineage) table, and added an index on item_id and ordinal. The buffers that lookup reads fell from 57,947 to 9 and its p99 dropped 96x, 171x, and 211x in three separate runs of the same test, and in a test loading 100,000 rows into an empty table, insert throughput with the index stayed at 90.9% of the unindexed table even in the worst pairing. Measured in November 2026 on local Postgres 18 with EXPLAIN ANALYZE and BUFFERS

### **pay-lab**: On-Chain Payments Lab Kit Reconfigured per Workshop or Class

_Tech Stack: Next.js, PostgreSQL, Privy, viem, MCP, Foundry, Vercel_

- **Reusable kit**: split the Q402 workshop site into lab modules, per-event config, and chain adapters, tied to no single event or chain. One setting picks the chain and stablecoin, so the same code runs on Mantle mainnet, Mantle Sepolia, Ethereum Sepolia, or local Anvil, and a new event adds one per-event config that picks its lab modules and limits. An architecture test keeps the service layer from importing any event or chain config. Ran the Oct 2026 Inha University class on this kit on Ethereum Sepolia
- **Gasless payments and agent limits**: relays students' ERC-3009 signed USDC transfers and pays the gas. Agent wallet tools spend only within the student's ERC-2612 permit, through a remote MCP server on wallet-signature OAuth for claude.ai and Codex that takes the sender only from the access token. In the Oct 2026 Inha University class, 22 students signed a spending limit for an agent and paid through it
- **Money-path safety**: fail-closed, so nothing is sent when any balance, limit, or registration check fails. Lab USDC funding is idempotent: it inserts a record keyed by event and address before sending, so one address is never funded twice. When a serverless function stops mid-send and leaves a record without a transaction hash, reconciliation releases it only after the funding wallet's pending transactions and the Transfers to that address show it was not sent. A production load test the day before the lecture showed several Vercel function instances building transactions with the server wallet's same nonce, so each send now takes a PostgreSQL advisory lock per chain and wallet and reads the next nonce recorded in a per-wallet table; after the fix, sends from 30 simulated students within 2 seconds all went through
- **Concurrent send test**: When several serverless functions send from one wallet at once, locks inside each function cannot block each other and nonces collide, so tested whether the PostgreSQL advisory lock added the day before the lecture really stops this concurrency problem and how far it holds. With 20 processes standing in for the functions and sending 20 transfers at once, 50 times, the current code with the advisory lock sent all 1,000 with 0 duplicate or skipped nonces, while the pre-fix code with locks only inside each function failed to send 698 under the same conditions. Because transfers go out one at a time under the lock, one wallet tops out at 2.4 sends per second, so when 100 processes sent 100 transfers at once, more than three times the 30 virtual students of the pre-lecture load test, 602 of 1,000 over 10 runs got no turn within the 15-second wait limit and ended unsent, still with 0 duplicate nonces. Measured in November 2026 against local Postgres and a local chain with a 0.4 s delay on each chain call

### **matching-ledger**: Exchange Matching Engine and Settlement Ledger

_Tech Stack: Rust_

- **Replay consistency and crash recovery**: For matching-engine consistency and crash recovery, built in Rust a single-writer matching engine that writes orders to an input log in sequence and matches them on one thread in that order, so every rerun yields the same fills. 320 replays of 10 synthetic order logs under 16 conditions reached the same state every time, truncating or corrupting the tail of one 20,000-record log at 2,000 positions still recovered everything before the damage, and 400 forced kills of the log-writing process and the engine process combined lost 0 acknowledged orders. Measured in November 2026 on a desktop
- **Group commit and reply latency**: To get throughput and reply latency right without losing acknowledged orders, added group commit, which confirms a batch of orders on disk before replying, and compared it with confirming each order. The per-order baseline, run 10 times each at 270 and 340 orders per second, never reached either and handled only 135 to 168 orders per second, while the chosen group-commit configuration sustained 40,000 orders per second in all 10 runs. At 20,000 orders per second the reply latency p99 of all 6 group-commit configurations, as the median of two separate rounds, fell between 10.3 ms and 13.8 ms. Measured in November 2026 on a desktop WSL2 virtual disk
- **Settlement ledger and snapshot recovery**: To keep the exchange settlement ledger consistent so no asset is created or lost, built accounts, balance reservation before matching, and fill settlement inside the engine, recording every fill as a transfer that takes an amount out of one account and adds the same amount to another. Across 1,000 synthetic command sequences with 5,128,000 commands there were 0 violations of asset conservation, non-negative balances, and reservation match, and all 400 ledgers broken on purpose were caught. With 100,000 accounts, recovering a 10.2-million-record log by full replay took a median 5.43 s, and starting from a snapshot taken every 1,000,000 records took 1.65 s even when the crash came just before the next snapshot and left the most log to replay. With 1,000,000 accounts, the longest engine pause had a 10-run median of 377 ms when the engine thread wrote the snapshot itself and 58 ms when a forked child process wrote it. Measured in November 2026 with the log and snapshot in the OS write cache

### **judgment-pipeline**: Article-Judgment Messaging Pipeline and Fault Tests on 4 Brokers

_Tech Stack: Rust, Python, Kafka, Redis Streams, NATS JetStream, RabbitMQ, PostgreSQL_

- **Consumer crashes and idempotent processing**: To confirm that article judgments land exactly once, with no loss or duplicates, even when a message consumer dies mid-processing, ran a fault-injection test that killed consumers 86 times per broker. Acking after processing lost 0 messages on Redis Streams, NATS JetStream, and Kafka, and the result table keyed on the article ID took 0 duplicates, its row counts matching the 46,192, 46,212, and 149,229 messages sent. In the same test a table without the key took duplicate writes on all three of Redis Streams, NATS JetStream, and Kafka, confirming that the key is what stopped them. Latency was also measured as a broker-selection criterion in a run without kills, with a median p50 per message of 1.94 ms on Redis, 2.10 ms on NATS, and 2.24 ms on Kafka over 32 repeats. Measured in November 2026 on desktop WSL2 with a fake judge taking 50 ms for the kill test and no delay for the latency test
- **Transactional outbox and broker durability**: Because a DB transaction and a message publish can fail separately, killed the producer 40 times per broker while writing more than 3,000 rows, to find a way that keeps data consistent when the producer dies between them. Commit-then-publish left, when the producer was killed 40 times per broker, 33 to 38 source rows, depending on the broker, committed to the DB whose message never went out, so no result was made, and publish-then-commit left 1 to 11 result rows with no source, while a transactional outbox, which writes the source row and the message to send in one transaction for a relay to publish, had 0 mismatched rows on Kafka, Redis Streams, NATS JetStream, and RabbitMQ across 40 producer and relay kills combined. Comparing settings for whether confirmed messages survive a broker restart, killing and restarting the broker container 3 times lost every message confirmed before the kill on Redis default settings, NATS memory storage, and RabbitMQ transient messages, and none in any of the 3 runs on Redis AOF, NATS file storage, Kafka, and RabbitMQ persistent messages. Measured in November 2026

### **Kronon Labs Feature Rebuild Tests**: Kronon Labs Features Rebuilt After Leaving as Personal Tests and Compared With Other Structures, Prompts, and Connection Modes Under the Same Conditions

_Tech Stack: Go, Rust, Python_

- **Solscan call coordinator**: Several holder-analysis services of a Solana bot share one call limit on Solscan, an external API, so compared structures that stay under the limit while sending urgent calls first. Replacing the Kronon Labs approach of 2 concurrent calls per service and a 200 ms pause after each call with a priority channel and a token bucket that spaces calls evenly cut rate-limit responses from 155 to 0 per 10,000 synthetic calls and the urgent-call wait p99 from 238 ms to 111 ms as medians of three runs, while the even spacing raised the urgent-call wait p50 from 0.007 ms to 35.6 ms. In 72 stress runs where several producers and consumers pushed and popped 1,000,000 IDs, a rebuild of the Kronon Labs ring buffer lost IDs every time, and a ring buffer with a sequence number per slot lost none. Rebuilt in Go in November 2026 and compared five structures (semaphore, ring buffer, priority channels, single channel, and a ring buffer with a sequence number per slot) against a mock server limited to 1,000 calls per minute
- **News-judgment LLM evaluation harness**: Rebuilt the LLM news judgment that Kronon Labs connected to live orders, and built an evaluation harness that checks whether the judgment changes article IDs or shifts their order and how much the score for the same article moves. Called with a strict JSON schema, the judgment kept every article ID and its order in 75 calls each of the prompt before the fix and a prompt that passes articles as JSON and tells the model to treat article IDs only as identifiers, with 30 comparison articles, and the fixed prompt lowered the mean standard deviation of scores (0 to 100) from judging the same article 5 times from 2.92 to 1.73. Measured in November 2026 with the gpt-4.1 Batch API
- **Listing-notice latency**: To receive listing notices sooner, built a probe that splits request latency into DNS, TCP, TLS, and server-response phases and found where the delay comes from. Connection reuse cut the request p99 from 62.0 ms on a new connection to 18.8 ms, 20.9 ms, and 21.5 ms in the three reuse modes, more than 40 ms lower, but in a model adding the 1-second polling wait the delay to notice a listing was p99 1,001 to 1,023 ms in every mode, so most of the delay comes from the polling interval. Measured in November 2026 by calling the Upbit market-list API in place of the notice path 6,000 times at one call per second, comparing a new connection per request with three reuse modes
- **Delta liquidation policy replay**: Built a replay of order books recorded on Binance, Bybit, and MEXC, and compared the Kronon Labs policy of liquidating the remaining Delta on the single venue with the largest balance against 5 other policies on the same books. Splitting a liquidation across venues cost 6.8 bps less per liquidation, with a 95% confidence interval of 6.1 to 7.5 bps, and 5.5 bps less when slippage is measured against each venue's own mid price. Measured in November 2026 by recording 24 hours of order books for 8 assets and applying all 6 policies to each of 29,773 randomly drawn simulated liquidations, under a rebuild of the Kronon Labs auto-balancer transfer rule, mock balances, assumed fees, and assumed risk costs

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
- Published on **npm** (`npx trustline-scanner scan .`) and as a **GitHub Marketplace Action**, with SARIF output for GitHub code scanning. A scanner subcommand that reads Ethereum finds the C2 address the EtherRAT malware reads from an Ethereum contract and the operator's other C2 contracts, and adds them to the IOC dataset so other projects can match them

### **skills**: Agent Skill Marketplace and Guardrail Hooks for Claude Code and Codex

_Tech Stack: Agent skills, Python, Bash_

- Turns repeated engineering decisions into skills in **7 domain plugins**, with Claude Code and Codex plugin manifests generated and one global instruction file installed for both agents from one source, so both work with the same skills and instructions, and stack presets that start a new repository with the right skills on
- **Trigger evals**: With many similar skills in an agent harness, the agent can call a skill on a query it does not fit, so built an eval that measures whether the agent calls a skill only on the queries it fits. On Claude Code, project-templates scored 1.0 precision and recall over 14 queries, 7 it should take and 7 another skill should take, run 3 times each. The method runs Claude Code or Codex non-interactively in a repo with the plugin installed and reads the session stream to see whether the agent called the target skill, and the accuracy was measured in September 2026 with claude-opus-5 on Claude Code
- **Guardrail hooks**: PreToolUse hooks block nested subagents, more than 5 spawns in 10 minutes, unconfirmed parallel sessions, .env secret output, and banned writing patterns

### **writing-guides**: Instructions and Output Checks for Agent-Written Copy

_Tech Stack: Markdown, Node.js, Python_

- Instruction files for agent-written Korean copy, screen copy, translation, talk scripts, and documents. Each rule cites the feedback, post, or measurement behind it, and each correction updates the rule and its check pattern in the same change
- The document checker and the agent PreToolUse hook share banned patterns, checked for parity before commit; a deck toolchain builds PDF, HTML, script, and slides from one master and checks contrast and layout

### **muster**: Local Scheduler Dashboard

_Tech Stack: React, Vite, Tailwind CSS, Fastify_ · https://github.com/kyle-park-io/muster

- Shows Windows Task Scheduler, systemd timers, cron, and Codex and Claude schedules per environment on one screen and toggles or runs user-owned jobs. Bound to 127.0.0.1; every change shows the exact command first

---

## AWARDS & CERTIFICATIONS

- **1st Place, DeFi & Composability Track, and Mantle Incubation Grant, Mantle Global Hackathon 2025** (DOOR Protocol) | Feb 2026
  - 500+ submissions from 2,000+ builders across 6 tracks and $150K in prizes. Only 3 teams received Mantle incubation grants for long-term support after the event
  - A DeFi rate protocol on Mantle that splits yield and risk into senior and junior tranches. Planned and built the entire entry: the proposal, the 7 core contracts for ERC-4626 tranche vaults, a safety module, withdrawal epochs, and a rate oracle, the backend API, the rate-oracle collectors, the Next.js dashboard, and the keeper bot
- **3rd Place, Bitcoin on Solana Track (Zeus Network), Seoulana Hackathon 2025** (Solana blockchain development competition) | Apr 2025
  - Built the Orca Whirlpool pool, position, and liquidity transactions for the entry, Stream Square
- **Engineer General Machinery** (Human Resources Development Service of Korea) | Dec 2020

---

## LEADERSHIP & RESEARCH

### **Orakle: KAIST-based Blockchain Research Society**

**Vice President (8th Cohort)** | Mar 2026 - Present · **Team Leader, ODA Team (7th Cohort)** | Sep 2025 - Feb 2026

- Society operations and program direction. Organized the 8th cohort's final research conference (Sep 2026, Hana Bank Samseong Station Corporate Center, sponsored by Sui, Radius, and CertiK)

- **Wrote the 7th cohort's five published DeFi research papers** (CC BY 4.0)\
  Link to the papers: https://github.com/orakle-7th-sda/conference-pdf
  - Stablecoin depeg survey covering CEX cases from 2018 to Feb 2026 and on-chain cases from 2022 to Feb 2026, by venue, magnitude, cause, and duration
  - Solana searcher/solver strategy design. Six strategy families for real-time depeg arbitrage on Jito bundles, Jupiter v6, and Helius WebSocket
  - Built a Solana depeg searcher in Go that sorts each depeg into four causes (pool imbalance, fear depeg, structural collapse, liquidity drain), arbitrages recoverable depegs through Jito bundles, and never trades a structural collapse. It reads three USDC/USDT pools on Orca, Meteora, and Raydium over Helius WebSocket and compares them with Pyth oracle and Binance and Coinbase prices; to skip transient rebalances and thin pools, it classifies a deviation only when it exceeds 0.1% for over 2 seconds in a pool with at least $50,000 TVL\
    Repository: https://github.com/orakle-7th-sda/defi-searcher
  - Plus a 17-category DeFi ecosystem taxonomy and a cross-category stablecoin map

- **6th Cohort BTCFi Bitcoin Options Service** (May 2025 - Nov 2025): a BitVMX-CPU PoC that computes a call option's payoff off-chain for Bitcoin Script to verify, a Go backend (REST API, WebSocket, PostgreSQL), and the BitStriker frontend (React, MutinyNet wallet)

