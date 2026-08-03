# PARK JUNGHO (Kyle) - CV

**Blockchain & Backend Engineer | Quantitative Trading Systems**

Builds trading systems (Rust/Go), blockchain infrastructure, and production tooling end to end. Currently Developer Relations at Mantle Network — where the output has been a 14-module content pipeline, six technical documents, and hands-on developer onboarding, not marketing copy.

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

- **Sole author of the Korean technical documentation set — 6 documents**
  - Mantle block explorer (beginner + deep-dive editions), a DEX comparative deep dive, AI agent trading paths, and asset-withdrawal guides. The deep-dive edition covers modular architecture, Rollup vs. Validium classification, L2's dual gas structure, and why Mantle sits at L2Beat Stage 0 — [Docs hub](https://kyle-park.notion.site/Docs-3675e2b105168061b410fdf801eeaac8)

- **Designed and delivered hands-on technical onboarding curriculum**
  - Mantle infra setup, Bybit API, Byreal Skills CLI, MerchantMoe/Agni/Fluxion integrations, testnet contract deployment labs, and a live-built stablecoin pair-trading bot

- **Owned Korea builder onboarding for The Turing Test Hackathon 2026**
  - Built the Korean funnel across Phase 2's full 6-week registration-to-submission window of a $120K, two-phase global flagship program — an offline co-working session, the Seoul hacker house workshop (100+ builders), a live online workshop, and 3 external partner events

- **Ran a 7-university blockchain-club campus tour as sole speaker, completed in 3 weeks**
  - KAIST, Korea University, Sungkyunkwan, Ewha Womans, Ajou, Inha, Kwangwoon. Four clubs published their own session recaps unprompted, turning one-off visits into standing partnerships

- **Ran the Korean official account — 221 posts, 175K impressions, 1.84% engagement rate (1.4× the global account's 1.28%)**
  - The six highest-reach posts were all Korea-originated campaigns and event announcements, not translated global copy

### **Kronon Labs Co., Ltd.**

**Trading System Backend Engineer** | Apr 2025 - Nov 2025 (8 months)

_Tech Stack: Go, Rust, Python, AWS, Docker_

- **CEX Cross-Exchange Arbitrage System**
  - Architected and deployed Taker-Taker and Maker-Taker arbitrage strategies with real-time dashboard for PnL monitoring and position tracking

- **Solana DEX Trading Infrastructure**
  - Built automated trading bots implementing proprietary alpha strategies (New Pair Detection, Back From The Dead, Fat LP Analysis) for on-chain opportunities

- **Trading Metrics & Analytics Platform**
  - Designed a universal metrics collection framework supporting multiple strategies, with real-time visualization backed by infrastructure handling 10k+ data points per second

- **AI-Powered Sentiment Trading System**
  - Developed sentiment analysis engine processing news feeds, KOL tweets, and Telegram channels to generate trading signals using LLM-based agents

- **Exchange Listing Sniper Bot**
  - Implemented real-time monitoring system detecting new token listings across major exchanges with sub-second automated order execution

### **Medium Inc.**

**Backend Engineer** | Sep 2022 - Feb 2024 (1 year 6 months)

_Tech Stack: Go, TypeScript (NestJS), Hyperledger Fabric, AWS, GCP, Docker_

- **Cross-Chain Bridge Infrastructure**
  - Developed secure bridge protocol connecting company L1 mainnet with private consortium chain, enabling asset transfers and state synchronization

- **Security Token Platform (ERC-1400)**
  - Implemented compliant STO infrastructure on Hyperledger Fabric following ERC-1400 standard for regulated digital securities issuance

- **Cryptocurrency Wallet Service**
  - Built production-grade wallet API supporting multi-chain assets with HSM integration and enterprise-level security controls

### **BF Labs Inc.**

**Backend Engineer** | Aug 2022 - Sep 2022 (2 months)

- **Government Research Project**
  - Contributed to IITP (Institute of Information & Communications Technology Planning & Evaluation) funded blockchain research initiative, developing core API infrastructure

<br>

---

## SELECTED PROJECTS

### **mantle-kr-herald** — Content Operations Pipeline (Mantle KR)

_Tech Stack: TypeScript, PostgreSQL, Vercel, Vitest, Hexagonal Architecture_

https://github.com/kyle-park-io/mantle-kr-herald

- Sole designer and implementer of the Korea team's content operations pipeline, now deployed to the team — **14 modules** spanning X/Lark collection, Korean translation, per-channel conversion, two-stage human review, and Telegram/X delivery (276 source files, 209 test files)
- Translation and conversion run **agent-in-the-loop**: a local coding agent fills a purpose-built worksheet and a human approves the result. No autonomous publish path — two mandatory approval gates
- Migrated the record of truth from files to **PostgreSQL and shipped it serverless on Vercel** so reviewers approve and publish from a browser. File-lock serialization does not survive serverless — a dropped ledger row means a live post republished twice — so the hazard was closed with a unique index
- **Translation memory** mines both official accounts for already-human-approved EN↔KO pairs; only human-confirmed pairs enter the few-shot set

### **Binance Triangular Arbitrage System**

_Tech Stack: Rust, FIX Protocol, SBE (Simple Binary Encoding)_

- High-performance triangular arbitrage engine using FIX and SBE for ultra-low-latency execution, with real-time opportunity detection across multiple Binance pairs

### **Polymarket & Crypto Prediction Markets**

_Tech Stack: Go_

- Prediction-market arbitrage, 15-minute crypto momentum trading with sub-$1 mispricing detection, and sentiment-driven directional strategies

**Full quant documentation:** https://jungho.dev/personal-quant

---

## AWARDS & CERTIFICATIONS

- **1st Place - Mantle Global Hackathon 2025** | Feb 2026
  - DeFi & Composabilities Track Winner
  - Project: DOOR Protocol

- **3rd Place - Seoulana Hackathon 2025** | Apr 2025
  - Solana blockchain development competition

- **Engineer General Machinery (Engineer)** | Dec 2020
  - Issued by Human Resources Development Service of Korea (HRDK)

---

## LEADERSHIP & RESEARCH

### **Orakle — KAIST-based Blockchain Research Society**

**Vice President (8th Cohort)** | Mar 2026 - Present

**Team Leader, ODA Team (7th Cohort)** | Sep 2025 - Feb 2026

- Society operations and program direction for one of Korea's leading university blockchain research societies — currently organizing the 8th cohort's final research conference (Sep 2026, Hana Bank Lounge, Samseong)

- **Sole author of the 7th cohort's five published DeFi research papers** (CC BY 4.0) — https://github.com/orakle-7th-sda/conference-pdf
  - Comprehensive stablecoin depeg survey across CEX venues (2018–Feb 2026) and on-chain venues (2022–Feb 2026) — by venue, magnitude, cause, and duration
  - Solana searcher/solver strategy design — six strategy families for real-time depeg arbitrage on Jito bundles, Jupiter v6, and Helius WebSocket
  - Plus a 17-category DeFi ecosystem taxonomy and a cross-category stablecoin map

---

## TECHNICAL SKILLS

Full-stack engineer with production experience across backend, blockchain, and frontend development. Language-agnostic problem solver capable of delivering end-to-end solutions from system architecture to deployment.

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
