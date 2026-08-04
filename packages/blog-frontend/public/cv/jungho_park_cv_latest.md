# PARK JUNGHO (Kyle) - CV

**Blockchain & Backend Engineer | Quantitative Trading Systems**

Builds trading systems (Rust/Go), blockchain infrastructure, and production tooling end to end. Currently Developer Relations Engineer at Mantle Network, where the output has been a 14-module content pipeline, five Korean technical documents, and hands-on developer onboarding.

---

## CONTACT

- **Email**: andy3638@naver.com
- **Telegram**: https://t.me/kyleparkio
- **Portfolio**: https://jungho.dev — quant career (`/quant`), personal strategies (`/personal-quant`)
- **Live Quant Trading Dashboard**: https://kyle-quant.xyz (pw: demo2025)

---

## PROFESSIONAL EXPERIENCE

### **Mantle Network**

**Developer Relations Engineer** | Apr 2026 - Present

_Tech Stack: TypeScript, Next.js, PostgreSQL, Solidity_

- **Sole designer and implementer of the Korea team's content operations pipeline, deployed to the team — 14 modules, 276 source files, 209 test files**
  - X/Lark collection, Korean translation, per-channel conversion, two-stage human review, Telegram/X/PR delivery — [mantle-kr-herald](https://github.com/kyle-park-io/mantle-kr-herald)

- **Sole author of the Korean technical documentation set — 5 documents**
  - Mantle block explorer (beginner and deep-dive editions), a DEX comparative deep dive, an AI agent trading path guide, and an asset-withdrawal guide. The deep-dive edition covers modular architecture, Rollup vs. Validium classification, L2's dual gas structure, and why Mantle sits at L2Beat Stage 0 — [Docs hub](https://kyle-park.notion.site/Docs-3675e2b105168061b410fdf801eeaac8)

- **Designed and delivered hands-on technical onboarding curriculum**
  - Mantle infra setup, Bybit API, Byreal Skills CLI, MerchantMoe/Agni/Fluxion integrations, testnet contract deployment labs, and a live-built stablecoin pair-trading bot

- **Owned Korea builder onboarding for The Turing Test Hackathon 2026**
  - Built the Korean builder funnel across the full 6-week registration-to-submission window of Phase 2, in a $120K two-phase global flagship program. An offline co-working session, the Seoul hacker house workshop (100+ builders), a live online workshop, and 3 external partner events

- **Ran a 7-university blockchain-club campus tour as sole speaker, completed in 3 weeks**
  - KAIST, Korea University, Sungkyunkwan, Ewha Womans, Ajou, Inha, Kwangwoon. Four clubs published their own session recaps unprompted, and one-off visits turned into standing partnerships

- **Ran the Korean official account — 221 posts, 175K impressions, 1.84% engagement rate (1.4× the global account's 1.28%)**
  - Korea-originated campaigns and event announcements took all six highest-reach slots

### **Kronon Labs Co., Ltd.**

**Trading System Backend Engineer** | Apr 2025 - Nov 2025 (8 months)

_Tech Stack: Go, Rust, Python, AWS, Docker_

- **CEX Cross-Exchange Arbitrage System**
  - Architected and deployed Taker-Taker and Maker-Taker arbitrage strategies, plus a dashboard tracking PnL and positions in real time

- **Solana DEX Trading Infrastructure**
  - Built on-chain trading bots implementing in-house alpha strategies (New Pair Detection, Back From The Dead, Fat LP Analysis)

- **Trading Metrics & Analytics Platform**
  - Designed a metrics collection framework reused across strategies, with real-time visualization and performance analysis on infrastructure handling 10k+ data points per second

- **AI-Powered Sentiment Trading System**
  - Built a sentiment analysis engine that collects news feeds, KOL tweets, and Telegram channels, and turns them into trading signals via LLM agents

- **Exchange Listing Sniper Bot**
  - Implemented a monitoring system detecting new token listings across major exchanges, with sub-second order execution

### **Medium Inc.**

**Backend Engineer** | Sep 2022 - Feb 2024 (1 year 6 months)

_Tech Stack: Go, TypeScript (NestJS), Hyperledger Fabric, AWS, GCP, Docker_

- **Cross-Chain Bridge Infrastructure**
  - Developed a bridge protocol connecting company L1 mainnet with private consortium chain, handling asset transfers and state synchronization

- **Security Token Platform (ERC-1400)**
  - Implemented STO infrastructure on Hyperledger Fabric for regulated digital securities issuance, following the ERC-1400 standard

- **Cryptocurrency Wallet Service**
  - Built a production wallet API supporting multi-chain assets, with HSM integration and security controls

### **BF Labs Inc.**

**Backend Engineer** | Aug 2022 - Sep 2022 (2 months)

- **Government Research Project**
  - Contributed to IITP (Institute of Information & Communications Technology Planning & Evaluation) funded blockchain research initiative, developing core API infrastructure

<br>

---

## SELECTED PROJECTS

### **mantle-kr-herald** — Content Operations Pipeline (Mantle KR)

_Tech Stack: TypeScript, PostgreSQL, Vercel, Vitest_

https://github.com/kyle-park-io/mantle-kr-herald

- Sole designer and implementer of the Korea team's content operations pipeline, deployed to the team. **14 modules**, 276 source files, 209 test files
- Translation and conversion run **agent-in-the-loop**: a local coding agent fills a purpose-built worksheet and a human approves the result, behind two mandatory approval gates
- Migrated the record of truth from files to **PostgreSQL and shipped it serverless on Vercel** so reviewers approve and publish from a browser. Persistence sits behind a port in a **hexagonal structure**, so swapping the store stayed at the adapter level. File-lock serialization does not survive serverless, so a dropped ledger row could republish a live post twice; a unique index closes that hazard
- **Translation memory** mines both official accounts and feeds only human-approved EN↔KO pairs into the few-shot set

### **Binance Triangular Arbitrage System**

_Tech Stack: Rust, FIX Protocol, SBE (Simple Binary Encoding)_

- High-performance triangular arbitrage engine using FIX and SBE for ultra-low-latency execution, with real-time opportunity detection across multiple Binance pairs

### **Polymarket & Crypto Prediction Markets**

_Tech Stack: Go_

- Prediction-market arbitrage, 15-minute crypto momentum trading on sub-$1 mispricings, and sentiment-driven directional strategies

<br>

---

## AWARDS & CERTIFICATIONS

- **1st Place - Mantle Global Hackathon 2025** | Feb 2026
  - DeFi & Composabilities Track Winner
  - Project: DOOR Protocol

- **3rd Place - Seoulana Hackathon 2025** | Apr 2025
  - Solana blockchain development competition

- **Engineer General Machinery** | Dec 2020
  - Issued by Human Resources Development Service of Korea (HRDK)

---

## LEADERSHIP & RESEARCH

### **Orakle — KAIST-based Blockchain Research Society**

**Vice President (8th Cohort)** | Mar 2026 - Present

**Team Leader, ODA Team (7th Cohort)** | Sep 2025 - Feb 2026

- Society operations and program direction. Currently organizing the 8th cohort's final research conference (Sep 2026, Hana Bank Lounge, Samseong)

- **Sole author of the 7th cohort's five published DeFi research papers** (CC BY 4.0) — https://github.com/orakle-7th-sda/conference-pdf
  - Comprehensive stablecoin depeg survey across CEX venues (2018 - Feb 2026) and on-chain venues (2022 - Feb 2026), by venue, magnitude, cause, and duration
  - Solana searcher/solver strategy design. Six strategy families for real-time depeg arbitrage on Jito bundles, Jupiter v6, and Helius WebSocket
  - Plus a 17-category DeFi ecosystem taxonomy and a cross-category stablecoin map

---

## TECHNICAL SKILLS

- **Languages**: Rust, Go, Python, TypeScript
- **Backend Frameworks**: NestJS, Next.js, Gin, Fx
- **Blockchain**: Solidity, Solana (Rust), Move, Hyperledger Fabric
- **Frontend**: React, SolidJS
- **Infrastructure**: AWS, GCP, Docker, Kubernetes, PostgreSQL, Vercel
- **Specializations**: Financial Market Protocols, DeFi Protocols, DEX/CEX Trading Systems, High-Frequency Trading, Medium-Frequency Trading, Cross-Chain Bridges, Internal Tooling & Workflow Automation, Agent-in-the-Loop Pipeline Design, Technical Writing

---

## EDUCATION

### **Kyung Hee University, Seoul**

Bachelor of Engineering in Mechanical Engineering | Mar 2014 - Aug 2022

---

## LANGUAGES

- **English**: Intermediate-High (TOEIC Speaking Level 6, 150/200)
- **Korean**: Native
