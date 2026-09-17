# PARK JUNGHO (Kyle) - CV

**Blockchain & Backend Engineer | Quantitative Trading Systems**

Builds trading systems (Rust/Go), blockchain infrastructure, and production tooling end to end. Currently Developer Relations Engineer for Korea at Mantle Network, having designed and built the content operations pipeline the team uses daily (14 modules), now working on its next iterations and hands-on developer onboarding. Also builds the agent tooling behind that work: a skill marketplace for Claude Code and Codex, and writing guides with their own checker.

---

## CONTACT

- **Email**: andy3638@naver.com · **Telegram**: https://t.me/kyleparkio
- **GitHub**: https://github.com/kyle-park-io · **Portfolio**: https://jungho.dev (quant career at `/quant`, personal strategies at `/personal-quant`)
- **Live Quant Trading Dashboard**: https://kyle-quant.xyz (pw: demo2025)

---

## PROFESSIONAL EXPERIENCE

### **Mantle Network**

**Developer Relations Engineer** | Apr 2026 - Present\
_Tech Stack: TypeScript, Next.js, PostgreSQL, Solidity_

- **Sole designer and implementer of the Korea team's content operations pipeline, deployed to the team (14 modules)**
  - X/Lark collection, Korean translation, per-channel conversion, two-stage human review, Telegram/X/PR delivery. A reviewer who never opens a terminal approves the copy and sends it from the same screen (mantle-kr-herald, private repository, available on request)

- **Sole author of the Korean technical documentation set (5 documents)**
  - Mantle block explorer (beginner and deep-dive editions), a DEX comparative deep dive, an AI agent trading path guide, and an asset-withdrawal guide. The deep-dive edition covers modular architecture, Rollup vs. Validium classification, L2's dual gas structure, and why Mantle sits at L2Beat Stage 0. [Docs hub](https://kyle-park.notion.site/Docs-3675e2b105168061b410fdf801eeaac8)

- **Designed and delivered hands-on technical onboarding curriculum**
  - Mantle infra setup, Bybit API, Byreal Skills CLI, MerchantMoe/Agni/Fluxion integrations, testnet contract deployment labs, and a live-built stablecoin pair-trading bot

- **Owned Korea builder onboarding for The Turing Test Hackathon 2026**
  - Built the Korean builder funnel across the full 6-week registration-to-submission window of Phase 2, in a $120K two-phase global flagship program. An offline co-working session, the Seoul hacker house workshop (100+ builders), a live online workshop, and 3 external partner events

- **Ran the Q402 builder workshop on agent payments (Mantle × Quack AI, Aug 2026): 42 builders, 488 on-chain payments in three hours**
  - Each builder connected Q402 to their own AI agent over MCP and paid on Mantle mainnet from the chat window, with no wallet app, no signing prompt, and no MNT for gas. Built the night's operations site myself in the four days before the event (Next.js, PostgreSQL, Vercel, Q402 MCP): wallet registration, live leaderboard, quest verification, and a QR payment bridge, with every badge judged by reading the chain

- **Ran a 7-university blockchain-club campus tour as sole speaker, completed in 3 weeks**
  - KAIST, Korea University, Sungkyunkwan, Ewha Womans, Ajou, Inha, Kwangwoon. Four clubs published their own session recaps unprompted, and one-off visits turned into standing partnerships

- **Co-host the monthly Korean livestream: August's post reached 17.4K, the second-highest-reach post on the account for the period**
  - July carried Mantle's third anniversary; August ran as a Mantle × Stable collaboration covering the USDT0 stablecoin ecosystem and Chainlink CCIP bridging. Wrote the July RFQ session up as a standalone Korean article

- **Run the Korean official account: 221 posts, 175K impressions, 1.84% engagement rate over Apr-Jul 2026 (1.4× the global account's 1.28%)**
  - Korea-originated campaigns and event announcements took all six highest-reach slots

### **Kronon Labs Co., Ltd.**

**Trading System Backend Engineer** | Apr 2025 - Nov 2025 (8 months)\
_Tech Stack: Go, Rust, Python, AWS, Docker_

- **CEX Cross-Exchange Arbitrage System**: architected and deployed Taker-Taker and Maker-Taker arbitrage strategies, plus a dashboard tracking PnL and positions in real time
- **Solana DEX Trading Infrastructure**: on-chain trading bots implementing in-house alpha strategies (New Pair Detection, Back From The Dead, Fat LP Analysis)
- **Trading Metrics & Analytics Platform**: a metrics collection framework reused across strategies, with real-time visualization and performance analysis on infrastructure handling 10k+ data points per second
- **AI Sentiment Engine & Exchange Listing Sniper**: a sentiment engine turning news feeds, KOL tweets, and Telegram channels into trading signals via LLM agents, plus a monitor detecting new token listings across major exchanges with sub-second order execution

### **Medium Inc.**

**Backend Engineer** | Sep 2022 - Feb 2024 (1 year 6 months)\
_Tech Stack: Go, TypeScript (NestJS), Hyperledger Fabric, AWS, GCP, Docker_

- **Cross-Chain Bridge Infrastructure**: a bridge protocol connecting the company L1 mainnet with a private consortium chain, handling asset transfers and state synchronization
- **Security Token Platform (ERC-1400)**: STO infrastructure on Hyperledger Fabric for regulated digital securities issuance, following the ERC-1400 standard
- **Cryptocurrency Wallet Service**: a production wallet API supporting multi-chain assets, with HSM integration and security controls

### **BF Labs Inc.**

**Backend Engineer** | Aug 2022 - Sep 2022 (2 months)

- **Government Research Project**: contributed core API infrastructure to an IITP (Institute of Information & Communications Technology Planning & Evaluation) funded blockchain research initiative

---

## SELECTED PROJECTS

### **mantle-kr-herald**: Content Operations Pipeline (Mantle KR)

_Tech Stack: TypeScript, PostgreSQL, Vercel, Vitest_ · Private repository, available on request

- Sole designer and implementer of the Korea team's content operations pipeline, deployed to the team. **14 modules**
- Translation and conversion run **agent-in-the-loop**: a local coding agent fills a purpose-built worksheet and a human approves the result, behind two mandatory approval gates
- Migrated the record of truth from files to **PostgreSQL and shipped it serverless on Vercel**, so a reviewer who never opens a terminal approves the copy and sends it to Telegram and X from one screen. Persistence sits behind a port in a **hexagonal structure**, so swapping the store stayed at the adapter level. File-lock serialization does not survive serverless, so a dropped ledger row could republish a live post twice; a unique index closes that hazard. Storage adapters are tested against **real Postgres, not a mock**: PGlite boots one in-process
- **Translation memory** mines both official accounts and feeds only human-approved EN↔KO pairs into the few-shot set. A glossary miner proposes Korean renderings and a tuned **rejection threshold** decides which survive, which is the difference between a discriminator and a rubber stamp

### **skills**: Agent Skill Marketplace for Claude Code and Codex

_Tech Stack: Agent skills, Python, Bash_ · Private repository, available on request

- Turns repeated engineering decisions into skills, packaged as **7 domain plugins** that each repository enables as needed. One source file generates the manifests for both Claude Code and Codex
- **Trigger evals for 6 skills.** The negative queries are the ones that belong to a neighbouring skill, which is what separates a precise trigger from a loose one
- Stack presets (Postgres backend, Next.js on Vercel, Terraform, data analytics) so a new repository starts with the right skills on, plus tested guard hooks on agent file writes and commands

### **writing-guides**: Instructions for Agent-Written Copy

_Tech Stack: Markdown, Node.js, Python_ · Private repository, available on request

- 55 guides for Korean copy, translation, talk scripts, and documents. Every rule is tagged with its evidence: a piece of feedback, a published post, or a measurement
- A pre-commit checker (links and anchors, dashes, evidence tags, index completeness, stock closing phrases, section numbering) and a presentation toolchain that builds the PDF, HTML, speaker script, and slide images from one master file

### **muster**: Local Scheduler Dashboard

_Tech Stack: React, Vite, Tailwind CSS, Fastify_ · https://github.com/kyle-park-io/muster

- One screen for Windows Task Scheduler, systemd timers, cron, and Codex and Claude schedules across Windows, WSL, macOS, and Linux. Bound to 127.0.0.1, with a confirmation step that shows the exact command for every change

### **Binance Triangular Arbitrage System**

_Tech Stack: Rust, FIX Protocol, SBE (Simple Binary Encoding)_

- High-performance triangular arbitrage engine using FIX and SBE for ultra-low-latency execution, with real-time opportunity detection across multiple Binance pairs

### **Polymarket & Crypto Prediction Markets**

_Tech Stack: Go_

- Prediction-market arbitrage, 15-minute crypto momentum trading on sub-$1 mispricings, and sentiment-driven directional strategies

---

## AWARDS & CERTIFICATIONS

- **1st Place, Mantle Global Hackathon 2025** (DeFi & Composabilities Track Winner, DOOR Protocol) | Feb 2026
- **3rd Place, Seoulana Hackathon 2025** (Solana blockchain development competition) | Apr 2025
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

---

## TECHNICAL SKILLS

- **Languages**: Rust, Go, Python, TypeScript
- **Backend Frameworks**: NestJS, Next.js, Fastify, Gin, Fx
- **Blockchain**: Solidity, Solana (Rust), Move, Hyperledger Fabric
- **Frontend**: React, SolidJS, Astro
- **Infrastructure**: AWS, GCP, Docker, Kubernetes, PostgreSQL, Vercel
- **AI Tooling**: Claude Code, Codex, MCP servers, agent skills and trigger evals, agent-in-the-loop pipelines
- **Specializations**: Financial Market Protocols, DeFi Protocols, DEX/CEX Trading Systems, High-Frequency Trading, Medium-Frequency Trading, Cross-Chain Bridges, Internal Tooling & Workflow Automation, Technical Writing

---

## EDUCATION & LANGUAGES

- **Kyung Hee University, Seoul**: Bachelor of Engineering in Mechanical Engineering | Mar 2014 - Aug 2022
- **English**: Intermediate-High (TOEIC Speaking Level 6, 150/200) · **Korean**: Native
