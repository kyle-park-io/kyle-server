# CV 최신화 (Mantle DevRel 반영) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `jungho_park_cv_latest{,_ko}.md`에 Mantle DevRel·오라클 리서치 경력을 반영하고, md→PDF 변환을 스크립트로 자동화한다.

**Architecture:** `packages/blog-frontend/public/cv/`가 단일 소스다. 여기서 md를 고치고 PDF를 생성하면, 기존 `scripts/build.sh`가 나머지 3개 사본으로 전파한다. 새 동기화 스크립트는 만들지 않는다.

**Tech Stack:** Markdown, `md-to-pdf`(Puppeteer 기반), Bash, yarn workspaces

## Global Constraints

- **설계 근거는 `docs/superpowers/specs/2026-08-03-cv-devrel-update-design.md`** — 문구 변경 시 스펙 §3을 정본으로 삼는다.
- **PDF 4페이지 이내.** 초과 시 Kronon Labs 불릿부터 줄인다.
- **한글판은 영문판과 1:1 미러링.** 섹션 순서·불릿 수·숫자가 전부 같아야 한다.
- **소스는 `packages/blog-frontend/public/cv/` 하나뿐.** 다른 3개 경로를 직접 편집하지 않는다.
- **숫자는 스펙 §9의 근거표를 벗어나지 않는다.** 특히 해커톤은 `$120K, two-phase` / Phase 2 6주 구간으로만 쓴다.
- **9/5 오라클 컨퍼런스는 `organizing`(진행 중)으로만 서술한다.** 완료 성과로 쓰지 않는다.
- 패키지 매니저는 **yarn**(`workspaces` 사용). pnpm 아님.
- **PDF 생성 시 `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable`가 필요하다.** 이 환경에는
  `unzip`이 없고 sudo가 막혀 puppeteer 번들 Chromium을 설치할 수 없다. 시스템 Chrome 150을 쓴다.
  (Task 1 보고서 참조 — `md-to-pdf`는 `PUPPETEER_SKIP_DOWNLOAD=true`로 설치됨)
- 커밋 메시지는 commitlint conventional 규칙(`feat:`, `chore:`, `docs:` …)을 따른다.

---

## File Structure

| 파일 | 책임 | 조치 |
|---|---|---|
| `packages/blog-frontend/public/cv/jungho_park_cv_latest.md` | 영문 CV 정본 | 수정 |
| `packages/blog-frontend/public/cv/jungho_park_cv_latest_ko.md` | 한글 CV 정본 | 수정 |
| `packages/blog-frontend/public/cv/jungho_park_cv_latest.pdf` | 배포되는 실물 | 재생성 |
| `scripts/build-cv.sh` | md → PDF 변환 + 페이지 수 검증 | **신규** |
| `scripts/build.sh` | 기존 전파 파이프라인 | 변경 없음 |

---

## Task 1: PDF 툴체인 검증 (스파이크)

내용 작업 전에 먼저 한다. WSL2에서 Puppeteer가 못 뜨면 이후 작업의 배포 경로가 막히므로 빨리 실패해야 한다.

**Files:**
- Modify: `package.json` (root, devDependencies)

**Interfaces:**
- Produces: `npx md-to-pdf <file.md>` 가 같은 디렉터리에 `<file>.pdf`를 만든다는 사실. Task 4가 이걸 전제한다.

- [ ] **Step 1: md-to-pdf 설치**

```bash
cd /home/kyle/code/kyle-server
yarn add -D -W md-to-pdf
```

- [ ] **Step 2: 현행 CV로 스모크 테스트**

기존 파일을 건드리지 않도록 임시 경로에서 돌린다.

```bash
cd /home/kyle/code/kyle-server
TMP=/tmp/claude-1000/-home-kyle-code/e5e945bb-405f-44c2-ba1e-c980ce5f8382/scratchpad/cv-spike
mkdir -p "$TMP"
cp packages/blog-frontend/public/cv/jungho_park_cv_latest.md "$TMP/"
npx md-to-pdf "$TMP/jungho_park_cv_latest.md"
ls -la "$TMP"
```

Expected: `$TMP/jungho_park_cv_latest.pdf` 생성.

**실패 시(WSL2 Chromium 의존성 누락, `error while loading shared libraries` 등):**

```bash
sudo apt-get update && sudo apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
  libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
  libgbm1 libasound2 libpango-1.0-0 libcairo2
```

설치 후 Step 2를 다시 돌린다. 그래도 실패하면 **여기서 멈추고 보고한다** — 대안은 `marked` + `puppeteer` 직접 구현이며, 별도 판단이 필요하다.

- [ ] **Step 3: 페이지 수 측정 방법 확인**

```bash
python3 -c "
import re
d=open('$TMP/jungho_park_cv_latest.pdf','rb').read()
print('Pages:', len(re.findall(rb'/Type\s*/Page[^s]', d)))
"
```

Expected: `Pages: 4` (현행 기준선). 이 값이 Task 4의 검증 기준이 된다.

- [ ] **Step 4: 커밋**

```bash
cd /home/kyle/code/kyle-server
git add package.json yarn.lock
git commit -m "chore: add md-to-pdf for CV generation"
```

---

## Task 2: 영문 CV 개정

**Files:**
- Modify: `packages/blog-frontend/public/cv/jungho_park_cv_latest.md`

**Interfaces:**
- Produces: 최종 섹션 순서 —
  `HEADER → CONTACT → PROFESSIONAL EXPERIENCE → SELECTED PROJECTS → AWARDS & CERTIFICATIONS → LEADERSHIP & RESEARCH → TECHNICAL SKILLS → EDUCATION → LANGUAGES`.
  Task 3(한글판)이 이 순서를 그대로 따른다.

- [ ] **Step 1: 헤더 교체 (3~5행)**

Old:
```markdown
**Quantitative Trading Engineer | Blockchain Developer**

3+ years specializing in quantitative trading systems (Rust/Go) and enterprise blockchain infrastructure (Mantle, Solana, Hyperledger Fabric)
```

New:
```markdown
**Blockchain & Backend Engineer | Quantitative Trading Systems**

Builds trading systems (Rust/Go), blockchain infrastructure, and production tooling end to end. Currently Developer Relations at Mantle Network — where the output has been a 14-module content pipeline, six technical documents, and hands-on developer onboarding, not marketing copy.
```

- [ ] **Step 2: CONTACT 압축 (11~16행)**

Old:
```markdown
- **Email**: andy3638@naver.com
- **Telegram**: https://t.me/kyleparkio
- **Portfolio**: https://jungho.dev
- **Professional Quant Career**: https://jungho.dev/quant
- **Personal Trading Strategy Development**: https://jungho.dev/personal-quant
- **Live Quant Trading Dashboard**: https://kyle-quant.xyz (pw: demo2025)
```

New:
```markdown
- **Email**: andy3638@naver.com
- **Telegram**: https://t.me/kyleparkio
- **Portfolio**: https://jungho.dev — quant career (`/quant`), personal strategies (`/personal-quant`)
- **Live Quant Trading Dashboard**: https://kyle-quant.xyz (pw: demo2025)
```

- [ ] **Step 3: Mantle 섹션 교체 (26~35행)**

`_Tech Stack: Solidity, TypeScript, Next.js_`부터 Turing Test 불릿 끝까지 전부 교체한다.

New:
```markdown
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
```

- [ ] **Step 4: Kronon 지표 불릿 2건 통합 (49~59행)**

Old (두 불릿):
```markdown
- **Trading Metrics & Analytics Platform**
  - Designed universal metrics collection framework supporting multiple strategies with real-time visualization and performance analysis
```
…그리고…
```markdown
- **High-Frequency Metrics Visualization**
  - Built scalable backend infrastructure handling 10k+ data points per second for real-time trading metrics charts
```

New (하나로):
```markdown
- **Trading Metrics & Analytics Platform**
  - Designed a universal metrics collection framework supporting multiple strategies, with real-time visualization backed by infrastructure handling 10k+ data points per second
```

`High-Frequency Metrics Visualization` 불릿은 **삭제**한다. Kronon은 6불릿 → 5불릿이 된다.

- [ ] **Step 5: `PERSONAL TRADING STRATEGIES`를 `SELECTED PROJECTS`로 교체 (100~117행)**

섹션 전체를 아래로 교체한다.

New:
```markdown
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
```

- [ ] **Step 6: AWARDS 개편 + LEADERSHIP & RESEARCH 신설 (131~147행)**

`## AWARDS & RECOGNITION` 섹션 전체를 아래 **두 섹션**으로 교체한다.

New:
```markdown
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
```

- [ ] **Step 7: TECHNICAL SKILLS 갱신 (95~96행)**

Old:
```markdown
- **Infrastructure**: AWS, GCP, Docker, Kubernetes
- **Specializations**: Financial Market Protocols, DeFi Protocols, DEX/CEX Trading Systems, High-Frequency Trading, Medium-Frequency Trading, Cross-Chain Bridges
```

New:
```markdown
- **Infrastructure**: AWS, GCP, Docker, Kubernetes, PostgreSQL, Vercel
- **Specializations**: Financial Market Protocols, DeFi Protocols, DEX/CEX Trading Systems, High-Frequency Trading, Medium-Frequency Trading, Cross-Chain Bridges, Internal Tooling & Workflow Automation, Agent-in-the-Loop Pipeline Design, Technical Writing
```

- [ ] **Step 8: PORTFOLIO 섹션 삭제 (158~164행)**

`## PORTFOLIO`부터 파일 끝까지 삭제한다. 바로 위의 `---` 구분선도 같이 지운다.

- [ ] **Step 9: 섹션 순서 정리**

현재 `SELECTED PROJECTS`는 `TECHNICAL SKILLS` **뒤**에 있다. 아래 순서가 되도록 블록을 이동한다:

```
HEADER
CONTACT
PROFESSIONAL EXPERIENCE
SELECTED PROJECTS          ← TECHNICAL SKILLS 앞으로 이동
AWARDS & CERTIFICATIONS
LEADERSHIP & RESEARCH
TECHNICAL SKILLS
EDUCATION
LANGUAGES
```

- [ ] **Step 10: 검증**

```bash
cd /home/kyle/code/kyle-server
grep -n '^## ' packages/blog-frontend/public/cv/jungho_park_cv_latest.md
```

Expected — 정확히 이 순서로 출력될 것:
```
## CONTACT
## PROFESSIONAL EXPERIENCE
## SELECTED PROJECTS
## AWARDS & CERTIFICATIONS
## LEADERSHIP & RESEARCH
## TECHNICAL SKILLS
## EDUCATION
## LANGUAGES
```

금지 문자열이 남아있지 않은지 확인:
```bash
grep -n 'PORTFOLIO\|PERSONAL TRADING STRATEGIES\|Quantitative Trading Engineer\|High-Frequency Metrics Visualization\|\$120K prize pool' \
  packages/blog-frontend/public/cv/jungho_park_cv_latest.md
```
Expected: 출력 없음 (exit 1).

- [ ] **Step 11: 커밋**

```bash
git add packages/blog-frontend/public/cv/jungho_park_cv_latest.md
git commit -m "feat: reposition CV as engineer-first and add Mantle DevRel experience"
```

---

## Task 3: 한글 CV 미러링

**Files:**
- Modify: `packages/blog-frontend/public/cv/jungho_park_cv_latest_ko.md`

**Interfaces:**
- Consumes: Task 2가 확정한 섹션 순서와 불릿 수.

- [ ] **Step 1: 헤더 교체 (3~5행)**

New:
```markdown
**블록체인 & 백엔드 엔지니어 | 퀀트 트레이딩 시스템**

트레이딩 시스템(Rust/Go), 블록체인 인프라, 프로덕션 도구를 처음부터 끝까지 직접 만듭니다. 현재 Mantle Network에서 데브렐을 맡고 있으며, 그 산출물은 마케팅 문구가 아니라 14개 모듈 콘텐츠 파이프라인, 기술 문서 6종, 그리고 개발자 온보딩입니다.
```

- [ ] **Step 2: 연락처 압축 (11~16행)**

New:
```markdown
- **이메일**: andy3638@naver.com
- **텔레그램**: https://t.me/kyleparkio
- **포트폴리오**: https://jungho.dev — 퀀트 개발 경력(`/quant`), 개인 트레이딩 전략(`/personal-quant`)
- **실시간 퀀트 트레이딩 대시보드**: https://kyle-quant.xyz (비밀번호: demo2025)
```

- [ ] **Step 3: Mantle 섹션 교체 (26~35행)**

New:
```markdown
_기술 스택: TypeScript, Next.js, PostgreSQL, Solidity_

- **한국어 기술 문서 6종 단독 집필**
  - Mantle 블록 익스플로러(입문판·기술 심화판), DEX 비교 딥다이브, AI 에이전트 트레이딩 경로, 자산 출금 가이드. 심화판은 모듈러 아키텍처, Rollup vs. Validium 분류, L2 가스 이중 구조, Mantle이 L2Beat Stage 0에 위치한 사유를 다룸 — [Docs 허브](https://kyle-park.notion.site/Docs-3675e2b105168061b410fdf801eeaac8)

- **실습 중심 기술 온보딩 커리큘럼 설계 및 진행**
  - Mantle 인프라 세팅, Bybit API, Byreal Skills CLI, MerchantMoe/Agni/Fluxion 연동, 테스트넷 컨트랙트 배포 실습, 스테이블코인 페어 트레이딩 봇 라이브 빌드

- **The Turing Test 해커톤 2026 한국 빌더 온보딩 전담**
  - 총상금 $120K 규모 2단계 글로벌 플래그십 프로그램의 Phase 2 등록–제출 6주 구간 전체에 한국 유입 경로 구축 — 오프라인 모각코, 서울 해커하우스 워크샵(빌더 100명 이상), 온라인 라이브 워크샵, 외부 파트너 행사 3건

- **대학 블록체인 학회 7곳 캠퍼스 투어를 단독 연사로 3주 만에 완주**
  - KAIST, 고려대, 성균관대, 이화여대, 아주대, 인하대, 광운대. 학회 4곳이 자체 리캡을 자발적으로 게시하며 일회성 방문을 지속적 파트너십으로 전환

- **한국 공식 계정 운영 — 게시물 221건, 조회 175K, 참여율 1.84% (글로벌 계정 1.28%의 1.4배)**
  - 조회 상위 6개 게시물이 전부 글로벌 번역물이 아닌 한국 자체 기획 캠페인·행사 공지
```

- [ ] **Step 4: 크로논 지표 불릿 통합 (49~59행)**

`- **트레이딩 지표 및 분석 플랫폼**` 불릿을 아래로 바꾸고, `- **초고빈도 지표 시각화**` 불릿은 삭제한다.

New:
```markdown
- **트레이딩 지표 및 분석 플랫폼**
  - 다양한 전략을 지원하는 범용 지표 수집 프레임워크 설계, 초당 1만 건 이상의 데이터 포인트를 처리하는 인프라 위에서 실시간 시각화 및 성과 분석 제공
```

- [ ] **Step 5: `개인 트레이딩 전략` → `주요 프로젝트` 교체 (100~117행)**

New:
```markdown
## 주요 프로젝트

### **mantle-kr-herald** — 콘텐츠 운영 파이프라인 (Mantle KR)

_기술 스택: TypeScript, PostgreSQL, Vercel, Vitest, 헥사고날 아키텍처_

https://github.com/kyle-park-io/mantle-kr-herald

- Mantle 한국팀의 콘텐츠 운영 파이프라인을 단독 설계·구현하여 팀에 배포 — X/Lark 수집, 한국어 번역, 채널별 변환, 2단계 사람 검수, 텔레그램/X 발송에 걸친 **14개 모듈** (소스 276개, 테스트 209개)
- 번역과 변환은 **에이전트 인 더 루프**로 동작 — 로컬 코딩 에이전트가 전용 워크시트를 채우고 사람이 승인. 자동 발행 경로 없음, 필수 승인 게이트 2단계
- 기록의 원천을 파일에서 **PostgreSQL로 이관하고 Vercel 서버리스로 배포**하여 검수자가 브라우저에서 승인·발행하도록 전환. 파일 락 직렬화는 서버리스에서 유지되지 않으며 — 원장 행이 누락되면 이미 나간 글이 두 번 발행된다 — 이 위험을 유니크 인덱스로 차단
- **번역 메모리**가 양쪽 공식 계정에서 이미 사람이 승인한 EN↔KO 쌍을 발굴, 사람이 확인한 쌍만 few-shot에 반영

### **바이낸스 삼각 차익거래 시스템**

_기술 스택: Rust, FIX Protocol, SBE (Simple Binary Encoding)_

- FIX와 SBE를 활용한 초저지연 삼각 차익거래 엔진, 바이낸스 다수 페어에 걸친 실시간 기회 탐지

### **폴리마켓 및 암호화폐 예측 시장**

_기술 스택: Go_

- 예측 시장 차익거래, $1 미만 미스프라이싱 탐지 기반 15분 모멘텀 트레이딩, 감성 분석 기반 방향성 전략

**전체 문서:** https://jungho.dev/personal-quant
```

- [ ] **Step 6: 수상 개편 + 리더십 및 리서치 신설 (131~147행)**

`## 수상 및 활동` 섹션 전체를 아래 두 섹션으로 교체한다.

New:
```markdown
## 수상 및 자격

- **Mantle 글로벌 해커톤 2025 1위** | 2026년 2월
  - DeFi & Composabilities 트랙 우승
  - 프로젝트: DOOR Protocol

- **Seoulana 해커톤 2025 3위** | 2025년 4월
  - Solana 블록체인 개발 경진대회

- **일반기계기사 (기사)** | 2020년 12월
  - 한국산업인력공단(HRD Korea) 발급

---

## 리더십 및 리서치

### **Orakle — KAIST 기반 블록체인 리서치 학회**

**8기 부학회장** | 2026년 3월 - 현재

**7기 ODA 팀 팀장** | 2025년 9월 - 2026년 2월

- 국내 유수의 대학 블록체인 리서치 학회 운영 및 프로그램 방향 총괄 — 현재 8기 최종 리서치 컨퍼런스 준비 중 (2026년 9월, 삼성역 하나은행 라운지)

- **7기 공개 DeFi 리서치 5편 단독 집필** (CC BY 4.0) — https://github.com/orakle-7th-sda/conference-pdf
  - CEX(2018~2026.02) 및 온체인(2022~2026.02) 스테이블코인 디페그 사례 종합 조사 — 거래소·프로토콜별 이탈 폭, 원인, 지속 시간
  - 솔라나 서처/솔버 전략 설계 — Jito 번들·Jupiter v6·Helius WebSocket 기반 실시간 디페그 차익거래 6개 전략 계열
  - 그 외 DeFi 생태계 17범주 택소노미, 범주별 스테이블코인 존재 형태 정리
```

- [ ] **Step 7: 기술 스택 갱신 (95~96행)**

New:
```markdown
- **인프라**: AWS, GCP, Docker, Kubernetes, PostgreSQL, Vercel
- **전문 분야**: 금융 시장 프로토콜, DeFi 프로토콜, DEX/CEX 트레이딩 시스템, 초고빈도 트레이딩, 중빈도 트레이딩, 크로스체인 브릿지, 사내 도구 및 워크플로 자동화, 에이전트 인 더 루프 파이프라인 설계, 기술 문서 집필
```

- [ ] **Step 8: 포트폴리오 섹션 삭제 (158~165행)**

`## 포트폴리오`부터 파일 끝까지, 바로 위 `---` 포함해 삭제한다.

- [ ] **Step 9: 섹션 순서를 영문판과 일치시킨다**

`## 주요 프로젝트`를 `## 기술 스택` 앞으로 옮긴다.

- [ ] **Step 10: 영문판과 구조 대조**

```bash
cd /home/kyle/code/kyle-server/packages/blog-frontend/public/cv
diff <(grep -c '^- \*\*' jungho_park_cv_latest.md) <(grep -c '^- \*\*' jungho_park_cv_latest_ko.md) \
  && echo "불릿 수 일치"
paste <(grep -n '^## ' jungho_park_cv_latest.md) <(grep -n '^## ' jungho_park_cv_latest_ko.md)
```

Expected: 불릿 수가 일치하고, 섹션명이 **같은 순서로 1:1 대응**한다. 행 번호까지 똑같을 필요는
없다 — 어긋나면 빠진 섹션이 있는지만 눈으로 확인한다.

숫자 일치 확인:
```bash
for n in 221 175K 1.84 1.28 '\$120K' 14 276 209; do
  printf "%-8s en=%s ko=%s\n" "$n" \
    "$(grep -c "$n" jungho_park_cv_latest.md)" \
    "$(grep -c "$n" jungho_park_cv_latest_ko.md)"
done
```
Expected: 각 숫자의 en/ko 등장 횟수가 같다.

- [ ] **Step 11: 커밋**

```bash
git add packages/blog-frontend/public/cv/jungho_park_cv_latest_ko.md
git commit -m "feat: mirror CV restructure into Korean version"
```

---

## Task 4: PDF 생성 스크립트

**Files:**
- Create: `scripts/build-cv.sh`

**Interfaces:**
- Consumes: Task 1이 확인한 `npx md-to-pdf` 동작.
- Produces: `scripts/build-cv.sh` — 인자 없이 실행하면 소스 디렉터리의 md 2개를 PDF로 굽고 페이지 수를 검증한다. 4페이지 초과 시 exit 1.

- [ ] **Step 1: 스크립트 작성**

기존 `scripts/build.sh`의 `SCRIPT_DIR` 패턴을 따른다.

```bash
#!/usr/bin/env bash
set -euo pipefail

# dir
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
CV_DIR="${SCRIPT_DIR}/../packages/blog-frontend/public/cv"
MAX_PAGES=4

page_count() {
  python3 -c "
import re, sys
d = open(sys.argv[1], 'rb').read()
print(len(re.findall(rb'/Type\s*/Page[^s]', d)))
" "$1"
}

# Puppeteer cannot install its bundled Chromium here (no `unzip`, sudo blocked —
# see Task 1 report). Point md-to-pdf at the system Chrome instead.
CHROME="${PUPPETEER_EXECUTABLE_PATH:-$(command -v google-chrome-stable || command -v google-chrome || true)}"
if [ -z "$CHROME" ]; then
  echo "No Chrome found. Set PUPPETEER_EXECUTABLE_PATH to a Chrome/Chromium binary." >&2
  exit 1
fi
export PUPPETEER_EXECUTABLE_PATH="$CHROME"
echo "using chrome: $CHROME"

status=0
for md in "${CV_DIR}"/jungho_park_cv_latest.md "${CV_DIR}"/jungho_park_cv_latest_ko.md; do
  [ -f "$md" ] || { echo "missing: $md" >&2; exit 1; }
  echo "building $(basename "$md") ..."
  npx --yes md-to-pdf "$md"

  pdf="${md%.md}.pdf"
  pages=$(page_count "$pdf")
  if [ "$pages" -gt "$MAX_PAGES" ]; then
    echo "  FAIL  $(basename "$pdf"): ${pages} pages (max ${MAX_PAGES})" >&2
    status=1
  else
    echo "  ok    $(basename "$pdf"): ${pages} pages"
  fi
done

if [ "$status" -ne 0 ]; then
  echo "" >&2
  echo "PDF exceeds ${MAX_PAGES} pages. Trim Kronon Labs bullets first (see spec §2)." >&2
  exit 1
fi

echo ""
echo "Done. Run scripts/build.sh to propagate to the other packages."
```

- [ ] **Step 2: 실행 권한 부여**

```bash
chmod +x /home/kyle/code/kyle-server/scripts/build-cv.sh
```

- [ ] **Step 3: 기존 PDF를 아카이브로 보존**

`build-cv.sh`는 `jungho_park_cv_latest.pdf`를 덮어쓴다. 덮어쓰기 **전에** 현행 PDF를 아카이브로
옮긴다. 저장소에 이미 선례가 있다 — `jungho_park_cv_archived_2026_01.pdf`는 2026-01-20에 올라온
CV(`48e5724`)가 6/15에 새 CV로 교체되면서(`0c8ddcd`) 리네임된 것이다.

**명명 규칙: `jungho_park_cv_archived_<그 버전이 만들어진 YYYY_MM>.pdf`.**
현행 `latest.pdf`는 2026-06-15자이므로 `jungho_park_cv_archived_2026_06.pdf`가 된다.

```bash
cd /home/kyle/code/kyle-server/packages/blog-frontend/public/cv
git mv jungho_park_cv_latest.pdf jungho_park_cv_archived_2026_06.pdf
cd /home/kyle/code/kyle-server
git commit -m "chore: archive the June 2026 CV before regenerating"
```

`git mv`를 쓰는 이유는 리네임으로 기록되어 이력이 이어지기 때문이다.

한글판은 아카이브할 것이 없다 — `jungho_park_cv_latest_ko.pdf`는 아직 존재한 적이 없다.

> **참고:** 아카이브 PDF는 UI 어디에서도 링크되지 않는다. `Profile.tsx:162`는 `latest.pdf`만
> 가리킨다. 보존은 되지만 직접 URL을 아는 사람만 접근할 수 있다. 링크를 노출할지는 별건이다.

- [ ] **Step 4: 실행**

```bash
cd /home/kyle/code/kyle-server && ./scripts/build-cv.sh
```

Expected:
```
building jungho_park_cv_latest.md ...
  ok    jungho_park_cv_latest.pdf: N pages
building jungho_park_cv_latest_ko.md ...
  ok    jungho_park_cv_latest_ko.pdf: N pages
```
`N` ≤ 4를 기대한다.

**초과하는 경우 — 마크다운을 직접 고치지 않는다.** 무엇을 덜어낼지는 본인 이력서의 내용 결정이라
구현자가 판단할 사안이 아니다. 페이지 수와 (알 수 있다면) 어느 섹션이 넘치는지를 보고하고 멈춘다.
줄일 후보의 우선순위는 Kronon Labs 불릿 → 오라클 리서치 하위 불릿 순이지만, 확정은 사람이 한다.

- [ ] **Step 5: PDF 육안 확인**

```bash
ls -la /home/kyle/code/kyle-server/packages/blog-frontend/public/cv/*.pdf
```

생성 시각이 방금이고 크기가 0이 아닌지 확인한다. 가능하면 PDF를 열어 섹션 순서와 페이지 나눔이 깨지지 않았는지 본다 — 특히 `LEADERSHIP & RESEARCH`가 페이지 경계에서 잘리지 않는지.

- [ ] **Step 6: 커밋**

```bash
cd /home/kyle/code/kyle-server
git add scripts/build-cv.sh packages/blog-frontend/public/cv/jungho_park_cv_latest.pdf packages/blog-frontend/public/cv/jungho_park_cv_latest_ko.pdf
git commit -m "feat: add build-cv script and regenerate CV PDFs"
```

---

## Task 5: 전파 확인

기존 `scripts/build.sh`가 나머지 3개 경로로 옮긴다. 여기서는 그게 실제로 되는지 확인만 한다.

**Files:**
- 없음 (검증 전용)

- [ ] **Step 1: 전파 전 상태 기록**

```bash
cd /home/kyle/code/kyle-server
md5sum packages/*/public/cv/jungho_park_cv_latest*.md \
       packages/*/static/public/cv/jungho_park_cv_latest*.md 2>/dev/null
```

이 시점에는 `blog-frontend/public/cv/`만 새 내용이고 나머지 3곳은 낡은 상태다. 정상이다.

- [ ] **Step 2: 빌드 실행**

```bash
cd /home/kyle/code/kyle-server && ./scripts/build.sh
```

**주의:** 이 스크립트는 `blog-backend/static`과 `dist`를 지우고 프론트엔드를 새로 빌드한다. 시간이 걸리고 다른 산출물도 바뀐다. 빌드가 실패하면 **그건 이번 변경과 무관한 기존 문제일 수 있으므로**, 실패 로그를 그대로 보고하고 CV 파일만 수동 복사하는 것으로 대체한다:

```bash
cd /home/kyle/code/kyle-server/packages/blog-frontend/public/cv
for dest in ../../../ingress-reverse-proxy/public/cv \
            ../../static/public/cv \
            ../../../blog-backend/static/public/cv; do
  [ -d "$dest" ] && cp -p jungho_park_cv_latest*.md jungho_park_cv_latest*.pdf "$dest/"
done
```

- [ ] **Step 3: 4개 사본 일치 확인**

```bash
cd /home/kyle/code/kyle-server
md5sum packages/*/public/cv/jungho_park_cv_latest.md \
       packages/*/static/public/cv/jungho_park_cv_latest.md | awk '{print $1}' | sort -u | wc -l
md5sum packages/*/public/cv/jungho_park_cv_latest_ko.md \
       packages/*/static/public/cv/jungho_park_cv_latest_ko.md | awk '{print $1}' | sort -u | wc -l
```

Expected: 두 명령 모두 `1` (해시가 하나뿐 = 전부 동일). 착수 전에는 한글판이 `2`였다.

참고: `*/static/public/cv/`의 두 사본은 `.gitignore:8`로 제외된 **빌드 산출물**이다. 배포에는
쓰이지만 커밋되지는 않으므로, 이 검증은 저장소 정합성이 아니라 **배포물 정합성**을 본다.

- [ ] **Step 4: 프로필 링크 대상 확인**

`Profile.tsx:162`가 가리키는 파일이 실제로 갱신됐는지 본다.

```bash
ls -la /home/kyle/code/kyle-server/packages/blog-frontend/public/cv/jungho_park_cv_latest.pdf
```

Expected: 수정 시각이 오늘.

- [ ] **Step 6: 커밋**

**`static/`은 `.gitignore:8`로 제외되므로 커밋 대상이 아니다.** 실제로 추적되는 사본은
`ingress-reverse-proxy/public/cv/` 하나뿐이다. 명시 경로만 스테이징한다.

```bash
cd /home/kyle/code/kyle-server
git add packages/ingress-reverse-proxy/public/cv
git status --short   # static/ · dist/ 가 올라오지 않았는지 눈으로 확인
git commit -m "chore: propagate updated CV to reverse-proxy public assets"
```

---

## 완료 기준

- [ ] `grep '^## '` 결과가 Task 2 Step 10의 기대 순서와 일치
- [ ] 한/영 불릿 수·숫자 등장 횟수 일치 (Task 3 Step 10)
- [ ] PDF 두 개 모두 4페이지 이내
- [ ] md 사본 4곳의 해시가 한/영 각각 하나로 수렴
- [ ] `PORTFOLIO`, `PERSONAL TRADING STRATEGIES`, `Quantitative Trading Engineer` 문자열이 남아있지 않음
- [ ] 9/5 오라클 컨퍼런스가 `organizing` / `준비 중`으로만 서술됨
