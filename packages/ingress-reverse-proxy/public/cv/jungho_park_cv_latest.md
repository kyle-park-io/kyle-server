# PARK JUNGHO (Kyle) - Resume

**Backend Engineer for Quantitative Trading and Blockchain Systems**

Backend engineer building cross-exchange arbitrage, on-chain trading, and cross-chain bridges in Rust, Go, and TypeScript. At Kronon Labs, owned 8-exchange order connectivity, PnL, and delta management in the team's arbitrage system. In 2026, joined Mantle, a global company, as Developer Relations Engineer, leading Korea builder onboarding for its hackathon.

---

## CONTACT

- **Email**: andy3638@naver.com · **Telegram**: https://t.me/kyleparkio
- **GitHub**: https://github.com/kyle-park-io · **Portfolio**: https://jungho.dev
- **Quant Career**: https://jungho.dev/quant · **Personal Trading Strategies**: https://jungho.dev/personal-quant
- **Live Quant Trading Dashboard**: https://kyle-quant.xyz
- **Full CV**: https://jungho.dev/cv/jungho_park_cv_full.pdf

---

## PROFESSIONAL EXPERIENCE

### **Mantle**

**Developer Relations Engineer** | Apr 2026 - Oct 2026 (7 months)\
*Global institutional infrastructure for real-world assets on the Ethereum L2 Mantle Network*\
_Tech Stack: TypeScript, Next.js, PostgreSQL, Solidity_

- **Owned Korea builder onboarding for The Turing Test Hackathon 2026**, a $120K two-phase global hackathon: recruited Korean entrants to the ClawHack AI trading agent contest, where a Korean participant's agent won the volume track at $10.31M and 12 tracked Korean wallets made 26.88% of volume, then ran Phase 2 workshops including the Seoul hacker house for 100+ builders

- **Ran the Q402 builder workshop on agent payments (Mantle × Quack AI, Aug 2026)**: 42 builders connected their AI agents to Q402 over MCP and paid on Mantle mainnet from chat with no wallet app or gas. Built the operations site, the first version of pay-lab; 488 on-chain payments in three hours

- **Designed, built, and deployed the Korea team's content operations pipeline**: schedulers translate Mantle's English X posts into Korean and rewrite them per channel, and a person approves the translation and then the channel copy before sending. The Korean official account posted through it from July 2026; by October it had collected 446 X posts and made 162 translations and 837 channel versions

- **Ran the Korean official account**: 279 posts, 246K impressions, and a 1.74% engagement rate over Apr-Sep 2026, 1.7× the global account's 1.03%

- **Taught a stablecoin payments class at Inha University (Oct 2026)**: ran two pay-lab labs in which students sent testnet USDC from phone wallets, then signed an AI agent's spending limit and saw requests past it refused by the server and the USDC contract

### **Kronon Labs Co., Ltd.**

**Trading System Backend Engineer** | Apr 2025 - Nov 2025 (8 months)\
_Tech Stack: Go (Fiber, Fx, gRPC), Python (Django), PostgreSQL, MongoDB, AWS (ECS, ECR, EC2, Parameter Store, KMS), Docker_

- **CEX Cross-Exchange Arbitrage System (Rothchild)**: owned the console backend for orders, balances, and PnL in the team's Taker-Taker and Maker-Taker arbitrage system across Binance, Bybit, Bithumb, Upbit, and perpetual DEXs. Built order placement, cancellation, replacement, and lookup, fill WebSockets, and reconnection for 8 exchanges plus Solana DEX, a delta manager that clears each asset's delta on the exchange holding the largest balance, and a real-time PnL dashboard
- **Solana DEX On-Chain Trading Bots**: Go bots running three alpha strategies with GoPlus and holder-distribution entry filters, Jupiter swaps and trigger orders, and Helius WebSocket pool monitoring. Moved the two holder-analysis services' direct Solscan calls behind one call-coordination service that queues requests at three priorities and enforces the rate limit in one place
- **News and KOL Signal Trading Engine**: built the Telegram and X collectors and the multi-assistant OpenAI scoring that route signals to Binance and Bybit USDT-futures orders in the team's engine, iterating three instruction versions against a 100-item test list
- **Exchange Listing Sniper**: with the team, caught Upbit and Bithumb listing notices and sent new symbols over gRPC to Tokyo and Singapore order servers trading on Binance futures, MEXC, and Bybit

### **Medium Inc.**

**Backend Engineer** | Sep 2022 - Feb 2024 (1 year 6 months)\
_Tech Stack: Go, TypeScript (NestJS), Solidity, Hyperledger Fabric 2.2, Kafka, MySQL, AWS, Docker_

- **Cross-Chain Bridge Infrastructure**: with the team, a multisig-verified bridge linking the company L1 RIGO, the Fabric consortium chain MDL, and Ethereum, with a Kafka event pipeline, 17 bridge chaincodes, and Solidity contracts
- **Security Token Platform (ERC-1400)**: designed and built a Go chaincode on Hyperledger Fabric for partition-based issue, transfer, and redeem, and token wallets
- **Hyperledger Fabric Network Automation**: Bash scripts from certificate enrollment to chaincode commit, in seven Docker Compose configurations and four without Docker

### **BF Labs Inc.**

**Backend Engineer** | Aug 2022 - Sep 2022 (2 months)

- **Government Research Project**: built the report intake and lookup REST API server for a project funded by Korea's IITP with Node.js, Express, and MariaDB

---

## EDUCATION & LANGUAGES

- **Kyung Hee University, Seoul**: Bachelor of Engineering in Mechanical Engineering | Mar 2014 - Aug 2022
- **English**: TOEIC Speaking 150/200, Intermediate High · **Korean**: Native

---

## TECHNICAL SKILLS

- **Specializations**: CEX/DEX Trading Systems, Exchange Connectivity and Order Management (REST, WebSocket, FIX/SBE), PnL/Delta Management, Cross-Exchange & Triangular Arbitrage, DeFi Protocols, Cross-Chain Bridges, Smart Contracts (ERC-4626, ERC-2612, ERC-3009), Security Tokens (ERC-1400 style)
- **Languages**: Rust, Go, Python, TypeScript
- **Blockchain**: Solidity (Foundry, Hardhat), Solana (Rust), Hyperledger Fabric
- **Backend Frameworks**: NestJS, Next.js, Fastify, Django, Gin, Fiber, Fx
- **Infrastructure**: AWS, GCP, Docker, Kubernetes, PostgreSQL, MySQL, Kafka, Redis, Vercel
- **AI Tooling**: Claude Code, Codex, MCP servers, agent skills, trigger evals, guardrail hooks, human-in-the-loop pipelines

---

## SELECTED PROJECTS

**mantle-kr-herald**: Mantle Korea Team's Human-in-the-Loop Content Pipeline | _TypeScript, PostgreSQL, Vercel, Vitest, Claude Code_

- Approved translations become few-shot examples and paired official posts a translation memory in the prompt; sends are idempotent so no post goes out twice. With APIs and storage behind 34 ports, moving from files to PostgreSQL on Vercel added 19 adapters without touching domain code; 5,115 test cases

**pay-lab**: On-Chain Payments Lab Kit Reconfigured per Workshop or Class | _Next.js, PostgreSQL, Privy, viem, MCP, Foundry, Vercel_

- Lab modules, per-event config, and chain adapters, so one setting runs the same code on Mantle, Ethereum Sepolia, or local Anvil. ERC-3009 gas relaying, agent wallet tools capped by an ERC-2612 permit, and a remote MCP server on wallet-signature OAuth for claude.ai and Codex
- Fail-closed money paths, idempotent funding, and reconciliation of stalled sends. A 30-student load test found serverless functions reusing a nonce and failing 3 to 8 of 30 transactions, fixed with a PostgreSQL advisory lock and a per-wallet nonce table

**Binance Triangular Arbitrage Engine** | _Rust, FIX 4.4, SBE (Simple Binary Encoding), rustls_

- Rust engine that logs on to the Binance FIX API with an Ed25519 signature and opens market data and order sessions in SBE binary encoding. On every book update it prices both directions of the BTC, ETH, and USDT triangle after taker fees and keeps the direction that clears the threshold

**Polymarket 15-Minute Market Complete-Set Arbitrage Bot** | _Go, Rust_

- Buys both outcomes when their best asks sum below $1. v1 drops signals built on quotes over 29ms stale; v2 re-derives the threshold from the fee table and pre-signs FOK orders so no unfilled order rests on the book

**skills**: Agent Skill Marketplace and Guardrail Hooks for Claude Code and Codex | _Agent skills, Python, Bash_

- 7 domain plugins with Claude Code and Codex manifests generated from one source. Trigger evals scored project-templates 1.0 precision and recall over 14 queries run 3 times each, and PreToolUse hooks block nested subagents and .env secret output

---

## AWARDS & CERTIFICATIONS

- **1st Place, DeFi & Composability Track, and Mantle Incubation Grant, Mantle Global Hackathon 2025** (DOOR Protocol) | Feb 2026
  - 500+ submissions from 2,000+ builders and $150K in prizes; only 3 teams received incubation grants. Wrote all of it: the proposal, 7 contracts including ERC-4626 tranche vaults, the backend, the rate-oracle collectors, the Next.js dashboard, and the keeper bot
- **3rd Place, Bitcoin on Solana Track (Zeus Network), Seoulana Hackathon 2025** (Solana blockchain development competition) | Apr 2025
- **Engineer General Machinery** (Human Resources Development Service of Korea) | Dec 2020

---

## LEADERSHIP & RESEARCH

### **Orakle: KAIST-based Blockchain Research Society**

**Vice President (8th Cohort)** | Mar 2026 - Present · **Team Leader, ODA Team (7th Cohort)** | Sep 2025 - Feb 2026

- Organized the 8th cohort's final research conference and wrote the 7th cohort's five published DeFi research papers, including a stablecoin depeg survey and Solana searcher/solver strategies\
  Link to the papers: https://github.com/orakle-7th-sda/conference-pdf
