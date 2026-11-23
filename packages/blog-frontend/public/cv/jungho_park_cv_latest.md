# PARK JUNGHO (Kyle) - Resume

**Backend Engineer for Quantitative Trading and Blockchain Systems**

Backend engineer building cross-exchange arbitrage, on-chain trading, and cross-chain bridges in Rust, Go, and TypeScript. At Kronon Labs, owned 8-exchange order connectivity, PnL, and delta management in the team's arbitrage system. In 2026, joined Mantle, a global company, as Developer Relations Engineer, leading Korea builder onboarding for its hackathon and building the Korea team's content pipeline that the Korean official account still uses.

---

## CONTACT

- **Email**: andy3638@naver.com · **Telegram**: https://t.me/kyleparkio
- **GitHub**: https://github.com/kyle-park-io · **Portfolio**: https://jungho.dev
- **Quant Career**: https://jungho.dev/quant · **Personal Trading Strategies**: https://jungho.dev/personal-quant
- **Live Quant Trading Dashboard**: https://kyle-quant.xyz
- **Full CV**: https://jungho.dev/cv/jungho_park_cv_full.pdf

---

## TECHNICAL SKILLS

- **Specializations**: CEX/DEX Trading Systems, Exchange Connectivity and Order Management (REST, WebSocket, FIX/SBE), PnL/Delta Management, Cross-Exchange & Triangular Arbitrage, DeFi Protocols, Cross-Chain Bridges, Smart Contracts (ERC-4626, ERC-2612, ERC-3009), Security Tokens (ERC-1400 style)
- **Languages**: Rust, Go, Python, TypeScript
- **Blockchain**: Solidity (Foundry, Hardhat), Solana (Rust), Hyperledger Fabric
- **Backend Frameworks**: NestJS, Next.js, Fastify, Django, Gin, Fiber, Fx
- **Infrastructure**: AWS, GCP, Docker, Kubernetes, PostgreSQL, MySQL, Kafka, Redis, Vercel
- **AI Tooling**: Claude Code, Codex, MCP servers, agent skills, trigger evals, guardrail hooks, human-in-the-loop pipelines

---

## PROFESSIONAL EXPERIENCE

### **Mantle**

**Developer Relations Engineer** | Apr 2026 - Oct 2026 (7 months)\
*Global institutional infrastructure for real-world assets on the Ethereum L2 Mantle Network*\
_Tech Stack: TypeScript, Next.js, PostgreSQL, Solidity_

- **Owned Korea builder onboarding for The Turing Test Hackathon 2026**, a $120K two-phase global hackathon: recruited Korean entrants to the ClawHack AI trading agent contest, where a Korean participant's agent won the volume track at $10.31M and Korean wallets incl. the winner's made 26.88% of the contest's $45.5M total volume, then ran a Phase 2 hackathon workshop at the Seoul hacker house for 100+ builders

- **Ran the Q402 builder workshop on agent payments (Mantle × Quack AI, Aug 2026)**: built the operations site, pay-lab v1, for a workshop where builders connected their AI agents to Q402 over MCP and paid on Mantle mainnet from chat with no wallet app or gas. 42 builders made 488 mainnet payments in three hours

- **Designed, built, and deployed the Korea team's content operations pipeline**: schedulers collect Mantle's English X posts, translate them into Korean and rewrite them per channel; it began with a person approving each stage and automated collection, translation drafts and channel rewrites in turn. The Korean official account has published through it since July 2026 and still does

- **Ran the Korean official account**: 489 posts and 278K impressions in total over Apr-Sep 2026, with likes, reposts, replies, and quotes at 1.06% of impressions, 1.6× the global account's 0.66% over the same period

- **Taught a stablecoin payments class at Inha University (Oct 2026)**: in labs run on pay-lab, 30 students sent testnet USDC from phone wallets to the person next to them, and 22 signed a spending limit for an AI agent and paid through the agent within it

### **Kronon Labs Co., Ltd.**

**Trading System Backend Engineer** | Apr 2025 - Nov 2025 (8 months)\
_Tech Stack: Go (Fiber, Fx, gRPC), Python (Django), PostgreSQL, MongoDB, AWS (ECS, ECR, EC2, Parameter Store, KMS), Docker_

- **CEX Cross-Exchange Arbitrage System (Rothchild)**: owned the console backend for orders, balances, and PnL in the team's Taker-Taker and Maker-Taker arbitrage system, traded live across Binance, Bybit, Bithumb, Upbit, and perpetual DEXs. Added order replacement, lookup, and reconnection to the shared exchange interface to connect orders on 8 exchanges plus Solana DEX, and built a delta manager that clears each asset's one-sided fills on the exchange holding the largest balance and a real-time PnL dashboard
- **Solana DEX On-Chain Trading Bots**: designed Go bots running the New Pair Detection, Back From The Dead, and Fat LP Analysis alpha strategies as separate collector, listener, and executor servers. Moved the two holder-analysis services' direct Solscan calls behind one call-coordination service that enforces the rate limit in one place. Ran with live orders on Solana mainnet
- **News and KOL Signal Trading Engine**: built the module that scores posts from private Telegram channels and X lists by averaging several OpenAI assistants, and connected its verdicts to the team's Binance and Bybit USDT-futures order engine as live orders
- **Exchange Listing Sniper**: with the team, caught Upbit and Bithumb listing notices and sent new symbols over gRPC to Tokyo and Singapore order servers trading on Binance futures, MEXC, and Bybit. A self-built notice collector spread over 20 VPSs received one listing notice 269 ms ahead of an external notice-feed API in a June 26, 2025 test

### **Medium Inc.**

**Backend Engineer** | Sep 2022 - Feb 2024 (1 year 6 months)\
_Tech Stack: Go, TypeScript (NestJS), Solidity, Hyperledger Fabric 2.2, Kafka, MySQL, AWS, Docker_

- **Cross-Chain Bridge Infrastructure**: with the team, a multisig-verified bridge linking the company L1 RIGO, the Fabric consortium chain MDL, and Ethereum. Built the Kafka event pipeline that skips redelivered events on the transaction-ID primary key and, after a restart, rereads missed transfers from the last processed block recorded on chain. Ran in B2B trials with businesses
- **Security Token Platform (ERC-1400)**: designed and built a Go chaincode on Hyperledger Fabric for partition-based issue, transfer, and redeem, and token wallets, used in PoC trials with companies
- **Hyperledger Fabric Network Automation**: automated bringing up Fabric networks with different organization, channel, and orderer counts in one script, from certificate enrollment to chaincode deployment; the team used it to bring up its Fabric networks

### **BF Labs Inc.**

**Backend Engineer** | Aug 2022 - Sep 2022 (2 months)

- **Government Research Project**: built the report intake and lookup REST API server for a project funded by Korea's IITP with Node.js, Express, and MariaDB

---

## EDUCATION & LANGUAGES

- **Kyung Hee University, Seoul**: Bachelor of Engineering in Mechanical Engineering | Mar 2014 - Aug 2022
- **English**: TOEIC Speaking 150/200, Intermediate High · **Korean**: Native

---

## SELECTED PROJECTS

**mantle-kr-herald**: Mantle Korea Team's Human-in-the-Loop Content Pipeline | _TypeScript, PostgreSQL, Vercel, Vitest, Claude Code_

- Prompts hold approved translations as few-shot examples and paired English-Korean posts as translation memory; sends are idempotent on a database primary key. With APIs and storage behind 34 ports, moving from files to PostgreSQL on Vercel added 19 adapters without touching domain code

**pay-lab**: On-Chain Payments Lab Kit Reconfigured per Workshop or Class | _Next.js, PostgreSQL, Privy, viem, MCP, Foundry, Vercel_

- Lab modules, per-event config, and chain adapters, so one setting runs the same code on Mantle, Ethereum Sepolia, or local Anvil. ERC-3009 gas relaying, agent wallet tools capped by an ERC-2612 permit, and a remote MCP server on wallet-signature OAuth for claude.ai and Codex
- Fail-closed money paths, idempotent funding, and reconciliation of stalled sends. A load test found Vercel instances reusing the wallet nonce; a PostgreSQL advisory lock and a per-wallet nonce table now serialize sends, and 30 simulated students sending within 2 seconds all went through

**matching-ledger**: Exchange Matching Engine and Settlement Ledger | _Rust_

- For matching-engine consistency and crash recovery, built a single-writer matching engine that matches orders on one thread in input-log order, with a settlement ledger. 320 replays reached the same state every time, 400 forced process kills lost 0 acknowledged orders, and snapshots cut recovery of a 10.2-million-record log from 5.43 s to 1.65 s. Measured in November 2026

**Binance Triangular Arbitrage Engine** | _Rust, FIX 4.4, SBE (Simple Binary Encoding), rustls_

- Rust engine that logs on to the Binance FIX API with an Ed25519 signature and opens market data and order sessions in SBE binary encoding. On every book update it prices both directions of the BTC, ETH, and USDT triangle after taker fees and keeps the direction that clears the threshold

**skills**: Agent Skill Marketplace and Guardrail Hooks for Claude Code and Codex | _Agent skills, Python, Bash_

- Marketplace that generates Claude Code and Codex plugin manifests and installs one global instruction file for both agents from one source, so both work with the same skills and instructions. PreToolUse hooks block nested subagents and .env secret output

---

## AWARDS & CERTIFICATIONS

- **1st Place, DeFi & Composability Track, and Mantle Incubation Grant, Mantle Global Hackathon 2025** (DOOR Protocol) | Feb 2026
  - 500+ submissions from 2,000+ builders and $150K in prizes; only 3 teams received incubation grants. Built every part: the proposal, the contracts including ERC-4626 tranche vaults, the backend, the rate-oracle collectors, the Next.js dashboard, and the keeper bot
- **3rd Place, Bitcoin on Solana Track (Zeus Network), Seoulana Hackathon 2025** (Solana blockchain development competition) | Apr 2025
- **Engineer General Machinery** (Human Resources Development Service of Korea) | Dec 2020

---

## LEADERSHIP & RESEARCH

### **Orakle: KAIST-based Blockchain Research Society**

**Vice President (8th Cohort)** | Mar 2026 - Present · **Team Leader, ODA Team (7th Cohort)** | Sep 2025 - Feb 2026

- Organized the 8th cohort's final research conference (Sep 2026, sponsored by Sui, Radius, and CertiK), wrote the 7th cohort's published DeFi papers including a stablecoin depeg survey, and built a Go searcher that sorts Solana depegs by cause and skips structural collapses\
  Link to the papers: https://github.com/orakle-7th-sda/conference-pdf
