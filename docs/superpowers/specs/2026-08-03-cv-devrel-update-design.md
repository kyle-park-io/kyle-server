# CV 최신화 설계 — Mantle DevRel 반영

작성일: 2026-08-03
대상: `packages/*/public/cv/jungho_park_cv_latest{,_ko}.md` 및 그 PDF

---

## 1. 목표와 전제

Mantle Korea DevRel(2026-04-07~) 활동을 CV에 반영한다. 원자료는
`~/code/twitterapi-io/devrel/`(로컬, gitignore됨)에 있고, 이력서용 문구 초안이
`devrel/cv/cv-{ko,en}.md`에 A(9불릿)/B(4불릿)/C(상세) 세 버전으로 준비되어 있다.

### 확정된 전제

| 항목 | 결정 | 근거 |
|---|---|---|
| 포지셔닝 | **엔지니어 우선**, DevRel은 현재 역할 | 본인 의사 — "역시나 개발자지" |
| 용도 | 지원용 + jungho.dev 공개 포트폴리오 겸용 | |
| 정본 | **PDF** (jungho.dev 프로필 버튼이 가리킴) | `Profile.tsx:162` |
| 변환 | md → PDF **스크립트로 자동화** (기존: VSCode 확장 수동) | 본인 의사 |
| 분량 | **4페이지 이내 유지** | 현행과 동일 |

### 핵심 진단

현행 CV의 문제는 길이가 아니라 **비중이 뒤집혀 있다**는 것이다.

| 섹션 | 불릿 | 숫자 근거 |
|---|---|---|
| Mantle (현재 직장) | 3 | 없음 |
| Kronon Labs (8개월) | 6 | 없음 |
| Medium Inc. | 3 | 없음 |

가장 최근이자 진행 중인 역할이 가장 얇고 추상적이다. 동시에 문서에는 약 25~30줄의
중복이 있어(아래 §4), **DevRel을 제대로 넣으면서도 길이는 오히려 줄어든다.**

---

## 2. 문서 골격

```
HEADER                     이름 + 직함 + 3줄 요약        ← 문구 교체
CONTACT                    6줄 → 4줄                     ← -2

PROFESSIONAL EXPERIENCE
  Mantle Network             3불릿 → 5불릿               ← +5
  Kronon Labs                6불릿 → 4~5불릿             ← -2
  Medium Inc.                3불릿 (유지)
  BF Labs Inc.               1불릿 (유지)

SELECTED PROJECTS          ← 기존 PERSONAL TRADING STRATEGIES 확장·개명
  mantle-kr-herald           신규, 공개 GitHub 링크      ← +7
  Binance Triangular Arb     2줄로 압축                  ← -3
  Polymarket                 2줄로 압축                  ← -3

AWARDS & CERTIFICATIONS    해커톤 2건 + 일반기계기사     ← -7 (오라클 2건 이동)
LEADERSHIP & RESEARCH      ← 신설, 오라클 전용           ← +11
TECHNICAL SKILLS           키워드 갱신
EDUCATION
LANGUAGES
~~PORTFOLIO~~              삭제 (CONTACT와 완전 중복)    ← -7
```

**증감은 대체로 상쇄된다.** 위 숫자는 어림이고, 실제 검증은 줄 수가 아니라
**PDF 페이지 수**로 한다 (§10-4 — 4페이지 초과 시 Kronon 불릿부터 더 줄인다).

### 배치 근거

**① SELECTED PROJECTS를 TECHNICAL SKILLS보다 위에.**
스킬 나열(주장)보다 만든 것(증거)이 먼저 오는 게 엔지니어 CV에서 강하다. `mantle-kr-herald`는
**채용자가 실제로 코드를 열어볼 수 있는 유일한 항목**이라 눈에 띄는 자리에 있어야 한다.

**② 오라클을 AWARDS에서 꺼내 독립 섹션으로.**
현행 AWARDS는 수상 2건 · 학회 직책 2건 · 자격증 1건이 섞여 있는데 성격이 전부 다르다.
수상은 수상이고 직책은 경력이다. 꺼내야 분량을 줄 수 있고, 부학회장이 "수상 목록의 다섯 번째 줄"이
아니라 별도 항목으로 읽힌다. 섹션명은 `COMMUNITY & LEADERSHIP`이 아니라
**`LEADERSHIP & RESEARCH`** — 7기 산출물이 공개 리서치 5편이라 "커뮤니티"로는 담기지 않는다.

**③ AWARDS를 LEADERSHIP & RESEARCH 바로 앞에.**
해커톤 우승과 오라클이 인접해야 *"우승자가 해커톤 온보딩을 맡았고, 부학회장이 학회 투어를 돌았다"*는
연결이 읽힌다. DevRel 불릿의 설득력이 여기서 나온다.

**④ Mantle 불릿은 기술 → 프로그램 순.**
엔지니어 포지셔닝에서는 기술문서·커리큘럼이 먼저 읽혀야 한다. herald는 경력 불릿에서 빠지고
SELECTED PROJECTS로 승격되므로 중복되지 않는다.

---

## 3. 확정 문구 (영문)

### 3.1 HEADER

```markdown
# PARK JUNGHO (Kyle) - CV

**Blockchain & Backend Engineer | Quantitative Trading Systems**

Builds trading systems (Rust/Go), blockchain infrastructure, and production
tooling end to end. Currently Developer Relations at Mantle Network — where the
output has been a 14-module content pipeline, six technical documents, and
hands-on developer onboarding, not marketing copy.
```

마지막 문장이 *"엔지니어인데 왜 DevRel?"* 이라는 질문을 읽는 사람이 묻기 전에 답한다.

### 3.2 CONTACT

```markdown
## CONTACT

- **Email**: andy3638@naver.com
- **Telegram**: https://t.me/kyleparkio
- **Portfolio**: https://jungho.dev — quant career (`/quant`), personal strategies (`/personal-quant`)
- **Live Quant Trading Dashboard**: https://kyle-quant.xyz (pw: demo2025)
```

하단 `PORTFOLIO` 섹션은 삭제하고 Notion 포트폴리오 링크만 위 `Portfolio` 줄에 흡수한다.

### 3.3 Mantle Network

```markdown
### **Mantle Network**

**Developer Relations Engineer** | Apr 2026 - Present

_Tech Stack: TypeScript, Next.js, PostgreSQL, Solidity_

- **Sole author of the Korean technical documentation set — 6 documents**
  - Mantle block explorer (beginner + deep-dive editions), a DEX comparative deep
    dive, AI agent trading paths, and asset-withdrawal guides. The deep-dive
    edition covers modular architecture, Rollup vs. Validium classification, L2's
    dual gas structure, and why Mantle sits at L2Beat Stage 0 — [Docs hub](https://kyle-park.notion.site/Docs-3675e2b105168061b410fdf801eeaac8)

- **Designed and delivered hands-on technical onboarding curriculum**
  - Mantle infra setup, Bybit API, Byreal Skills CLI, MerchantMoe/Agni/Fluxion
    integrations, testnet contract deployment labs, and a live-built stablecoin
    pair-trading bot

- **Owned Korea builder onboarding for The Turing Test Hackathon 2026**
  - Built the Korean funnel across Phase 2's full 6-week registration-to-submission
    window of a $120K, two-phase global flagship program — an offline co-working
    session, the Seoul hacker house workshop (100+ builders), a live online
    workshop, and 3 external partner events

- **Ran a 7-university blockchain-club campus tour as sole speaker, completed in 3 weeks**
  - KAIST, Korea University, Sungkyunkwan, Ewha Womans, Ajou, Inha, Kwangwoon.
    Four clubs published their own session recaps unprompted, turning one-off
    visits into standing partnerships

- **Ran the Korean official account — 221 posts, 175K impressions, 1.84% engagement rate (1.4× the global account's 1.28%)**
  - The six highest-reach posts were all Korea-originated campaigns and event
    announcements, not translated global copy
```

### 3.4 SELECTED PROJECTS

```markdown
## SELECTED PROJECTS

### **mantle-kr-herald** — Content Operations Pipeline (Mantle KR)

_Tech Stack: TypeScript, PostgreSQL, Vercel, Vitest, Hexagonal Architecture_

https://github.com/kyle-park-io/mantle-kr-herald

- Sole designer and implementer of the Korea team's content operations pipeline,
  now deployed to the team — **14 modules** spanning X/Lark collection, Korean
  translation, per-channel conversion, two-stage human review, and Telegram/X
  delivery (276 source files, 209 test files)
- Translation and conversion run **agent-in-the-loop**: a local coding agent fills
  a purpose-built worksheet and a human approves the result. No autonomous publish
  path — two mandatory approval gates
- Migrated the record of truth from files to **PostgreSQL and shipped it serverless
  on Vercel** so reviewers approve and publish from a browser. File-lock
  serialization does not survive serverless — a dropped ledger row means a live post
  republished twice — so the hazard was closed with a unique index
- **Translation memory** mines both official accounts for already-human-approved
  EN↔KO pairs; only human-confirmed pairs enter the few-shot set

### **Binance Triangular Arbitrage System**

_Tech Stack: Rust, FIX Protocol, SBE (Simple Binary Encoding)_

- High-performance triangular arbitrage engine using FIX and SBE for ultra-low-latency
  execution, with real-time opportunity detection across multiple Binance pairs

### **Polymarket & Crypto Prediction Markets**

_Tech Stack: Go_

- Prediction-market arbitrage, 15-minute crypto momentum trading with sub-$1
  mispricing detection, and sentiment-driven directional strategies

**Full quant documentation:** https://jungho.dev/personal-quant
```

세 번째 herald 불릿(unique index)이 이 CV 전체에서 가장 강한 엔지니어링 신호다. 기능 자랑이 아니라
*"서버리스로 옮겼더니 파일락이 안 먹는다"*를 스스로 발견하고 막았다는 서술이라, 면접에서 파고들 지점이 된다.

### 3.5 AWARDS & CERTIFICATIONS

```markdown
## AWARDS & CERTIFICATIONS

- **1st Place - Mantle Global Hackathon 2025** | Feb 2026
  - DeFi & Composabilities Track Winner — Project: DOOR Protocol

- **3rd Place - Seoulana Hackathon 2025** | Apr 2025
  - Solana blockchain development competition

- **Engineer General Machinery** | Dec 2020
  - Issued by Human Resources Development Service of Korea (HRDK)
```

### 3.6 LEADERSHIP & RESEARCH (신설)

```markdown
## LEADERSHIP & RESEARCH

### **Orakle — KAIST-based Blockchain Research Society**

**Vice President (8th Cohort)** | Mar 2026 - Present
**Team Leader, ODA Team (7th Cohort)** | Sep 2025 - Feb 2026

- Society operations and program direction for one of Korea's leading university
  blockchain research societies — currently organizing the 8th cohort's final
  research conference (Sep 2026, Hana Bank Lounge, Samseong)

- **Sole author of the 7th cohort's five published DeFi research papers** (CC BY 4.0)
  — https://github.com/orakle-7th-sda/conference-pdf
  - Comprehensive stablecoin depeg survey across CEX venues (2018–Feb 2026) and
    on-chain venues (2022–Feb 2026) — by venue, magnitude, cause, and duration
  - Solana searcher/solver strategy design — six strategy families for real-time
    depeg arbitrage on Jito bundles, Jupiter v6, and Helius WebSocket
  - Plus a 17-category DeFi ecosystem taxonomy and a cross-category stablecoin map
```

**리서치를 2줄로 좁힌 이유.** 읽는 사람이 학생 학회 항목에 쓸 주의력은 제한적이다. 그 예산을
가장 엔지니어링에 가까운 둘(디페그 사례 조사, 솔라나 서처/솔버 전략)에 몰아야 한다. 이 둘은
Kronon Labs의 Solana DEX 차익거래, SELECTED PROJECTS의 Binance 삼각 차익거래와 **같은 축에
일직선으로 놓여**, 학회 활동이 아니라 경력의 연장선으로 읽힌다. 택소노미·스테이블코인 맵은
분류 작업이라 신호가 약해 한 줄로 접어 "5편"이라는 숫자만 지탱하게 한다.

### 3.7 TECHNICAL SKILLS

`Specializations` 줄에 다음을 추가하고, 인프라 줄에 PostgreSQL·Vercel을 넣는다.

```
- **Infrastructure**: AWS, GCP, Docker, Kubernetes, PostgreSQL, Vercel
- **Specializations**: Financial Market Protocols, DeFi Protocols, DEX/CEX Trading
  Systems, High/Medium-Frequency Trading, Cross-Chain Bridges, Internal Tooling &
  Workflow Automation, Agent-in-the-Loop Pipeline Design, Technical Writing
```

DevRel 소프트 키워드(Community Growth, Public Speaking 등)는 **넣지 않는다.** 엔지니어
포지셔닝을 흐리고, 해당 역량은 이미 경력 불릿에서 사실로 증명되고 있다.

---

## 4. 회수하는 중복

| 대상 | 현행 | 조치 |
|---|---|---|
| CONTACT의 자기 사이트 URL 4개 | 6줄 | 4줄로 압축 |
| 하단 `PORTFOLIO` 섹션 | 7줄 | **삭제** — CONTACT의 `jungho.dev`와 완전 중복 |
| `PERSONAL TRADING STRATEGIES` 서술 | 18줄 | 각 2줄로 압축, `/personal-quant` 링크가 상세를 대신함 |
| AWARDS의 오라클 2건 | 7줄 | `LEADERSHIP & RESEARCH`로 이동·확장 |
| Kronon Labs 불릿 | 6개 | 4~5개로 — 지표 시각화 2건(`Trading Metrics Platform`, `High-Frequency Metrics Visualization`)이 사실상 같은 작업이라 통합 |

---

## 5. 한글판 (`jungho_park_cv_latest_ko.md`)

영문판과 **1:1 미러링**한다. 섹션 순서·불릿 수·숫자 전부 동일하게 맞춘다.
번역 문구는 `devrel/cv/cv-ko.md`의 대응 표현을 우선 사용한다(이미 한국어로 다듬어진 문장이 있음).

섹션명 대응:

| EN | KO |
|---|---|
| SELECTED PROJECTS | 주요 프로젝트 |
| AWARDS & CERTIFICATIONS | 수상 및 자격 |
| LEADERSHIP & RESEARCH | 리더십 및 리서치 |

---

## 6. 파일 동기화

md 사본이 4곳에 존재하며 **한글판은 이미 갈라져 있다**:

```
packages/blog-frontend/public/cv/              ← 기준으로 삼을 곳
packages/ingress-reverse-proxy/public/cv/      (en 동일, ko 동일)
packages/blog-backend/static/public/cv/        (en 동일, ko 다름 ← stale)
packages/blog-frontend/static/public/cv/       (en 동일, ko 다름 ← stale)
```

**동기화 스크립트를 새로 만들 필요는 없다 — 이미 존재한다.** `scripts/build.sh`가 전파를 담당한다:

```
build.sh:11   yarn run clean-build-prod        # public/ → static/ 생성
build.sh:12   cp -r -p static → blog-backend/static
build.sh:15   cp -r -p public/* → ingress-reverse-proxy/public
```

즉 `blog-frontend/public/cv/`가 실질적 단일 소스이고 나머지 3곳은 빌드 산출물이다.
한글판이 갈라진 이유도 이것으로 설명된다 — ko 파일을 추가한 커밋(`4e4be1e`) 이후
빌드를 돌리지 않았을 뿐이다.

따라서 새 스크립트가 할 일은 **PDF 생성뿐**이고, 전파는 기존 빌드에 맡긴다.

---

## 7. md → PDF 자동화

**요구**: 기존 VSCode 확장(수동) 대신 스크립트 한 번으로 md 4쌍 + PDF가 갱신될 것.

**선택**: Puppeteer 기반. 널리 쓰이고 CSS로 페이지 나눔·여백·타이포그래피를 제어할 수 있어
이력서처럼 레이아웃이 중요한 문서에 맞는다. 후보 두 가지:

| 방식 | 장점 | 단점 |
|---|---|---|
| `md-to-pdf` (npm) | 설치 즉시 동작, 가장 보편적 | 스타일 커스터마이즈가 설정 파일에 갇힘 |
| `marked` + `puppeteer` 직접 | 이미 `packages/md-to-html`이 `marked`를 씀. CSS 완전 통제 | 코드를 직접 써야 함 |

**권장: `md-to-pdf`로 시작**하고, 레이아웃이 마음에 안 들면 직접 구현으로 전환한다.
CV 하나 뽑자고 렌더러를 자체 구현할 이유는 없다.

**산출물**: `scripts/build-cv.sh` (또는 `packages/*/package.json`의 스크립트)

1. `blog-frontend/public/cv/*.md` → 같은 위치에 PDF 생성
2. 페이지 수 검증 — 4페이지 초과 시 exit 1
3. 전파는 하지 않는다 (§6 — 기존 `scripts/build.sh` 담당)

**주의**: WSL2에서 Puppeteer가 번들 Chromium을 띄우려면 시스템 라이브러리가 필요할 수 있다
(`libnss3`, `libatk`, `libgbm` 등). 최초 실행 시 실패하면 의존성 설치가 선행되어야 한다.

---

## 8. 의도적으로 넣지 않은 것

| 항목 | 이유 |
|---|---|
| `cv-en.md` A버전 9불릿 전체 | Mantle 섹션이 나머지 문서보다 길어져 비중이 다시 뒤집힘. PDF 6~7페이지 |
| 라이브스트림 4회 / 캠페인 9건·수령자 129명 | 엔지니어 포지셔닝에서 신호가 약함. 계정 운영 불릿이 이미 대표함 |
| $103K 컴퓨팅 크레딧 | 스폰서 자금이라 본인 성과가 아님 (`cv-en.md` §E의 "프로그램 맥락" 열) |
| 글로벌 818K 팔로워 / 576건 제출 / 30팀 | 동일 — 회사 지표이지 본인 지표가 아님 |
| Playwright 자동 팔로우 파이프라인 | 자동화 도구로서 herald와 겹치고 신호가 약함 |
| 오라클 CLAIR 보안 연구 | **본인 참여 아님** — 학회 활동 소개였음 |
| 9/5 최종 발표를 완료 성과로 서술 | 아직 일어나지 않음. `organizing`(진행 중)으로만 씀 |
| DevRel 소프트 키워드 (Community Growth 등) | 엔지니어 포지셔닝을 흐림 |
| `devrel/` 저장소 링크 | gitignore된 비공개 폴더. 내부 자기비판(도달 하락, 팔로워 -12)이 포함되어 공개 링크 대상이 아님 |

---

## 9. 숫자 근거

모든 수치는 `~/code/twitterapi-io/devrel/data/`의 원본 트윗 또는 커밋 기록으로 역추적된다.

| 수치 | 출처 |
|---|---|
| 캠퍼스 투어 7개 학회 | `0xMantleKR-tweets.json` — 5/7 일정 공지 + 회차별 리캡 7건 |
| 학회 4곳 자체 리캡 | `mentions-bcd_kyle.json` — @blockchainkor(5/10), @Ewhachain(5/17·5/20), @skkrypto(5/23), @Orakle_KAIST(5/26) |
| 해커하우스 빌더 100+ | `Mantle_Official-tweets.json` 6/10 |
| **해커톤 $120K (양 단계 합계)** | `93-appendix-D-daily-log.md:475` — *"a total prize pool of $120K across both phases"* |
| 해커톤 Phase 2 $100K·6트랙 | 글로벌 4/22 발표 |
| 221건 / 175,068 조회 | `data/stats.json` → `totals.kr` |
| ER 1.84% vs 글로벌 1.28% | 원본 게시물만, (좋아요+RT+답글)/조회 평균 |
| 기술문서 6종 · Docs 허브 | Notion 원본 백업 `data/notion/*.json` |
| herald 14모듈 · 276소스 · 209테스트 | `mantle-kr-herald` `docs/ko/capabilities.md` §5 모듈 지도(A~N) · `git ls-files` (2026-08-02 기준) |
| 오라클 리서치 5편 | `github.com/orakle-7th-sda/conference-pdf` — md 5개 총 437KB, CC BY 4.0 |

**숫자 사용 원칙** (`cv-en.md` §E): 글로벌 숫자는 명사를 수식하게 두고, 동사는 본인이 한 일에 붙인다.

> ✅ "Owned Korea onboarding for a $120K, two-phase hackathon"
> ❌ "Ran a $120K hackathon, driving 576 submissions"

---

## 10. 작업 순서

1. `jungho_park_cv_latest.md` 개정 (§3 문구 적용, §4 중복 제거)
2. `jungho_park_cv_latest_ko.md` 미러링
3. `scripts/build-cv.sh` 작성 — PDF 생성 + 페이지 수 검증 (전파는 기존 `build.sh`가 담당)
4. 실행 후 **PDF 4페이지 이내 확인**
5. `scripts/build.sh`로 전파, 4개 사본 해시 일치 확인
6. 커밋
