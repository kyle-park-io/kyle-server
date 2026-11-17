# 박정호 (Kyle) - 이력서

**퀀트 트레이딩·블록체인 시스템 백엔드 엔지니어**

거래소 간 차익거래, 온체인 트레이딩, 크로스체인 브릿지를 Rust, Go, TypeScript로 만드는 백엔드 엔지니어입니다. 크로논랩스에서 팀과 함께 만든 차익거래 시스템의 8개 거래소 주문 연동과 PnL·Delta 관리를 맡았습니다. 2026년에는 글로벌 기업 Mantle에 데브렐 엔지니어로 합류해 해커톤 한국 빌더 온보딩을 총괄하고, 한국 공식 계정 게시물이 나가고 있는 콘텐츠 파이프라인을 만들었습니다.

---

## 연락처

- **이메일**: andy3638@naver.com · **Telegram**: https://t.me/kyleparkio
- **GitHub**: https://github.com/kyle-park-io · **포트폴리오**: https://jungho.dev
- **퀀트 개발 경력**: https://jungho.dev/quant · **개인 트레이딩 전략**: https://jungho.dev/personal-quant
- **실시간 퀀트 트레이딩 대시보드**: https://kyle-quant.xyz
- **상세 이력서**: https://jungho.dev/cv/jungho_park_cv_full_ko.pdf

---

## 경력 사항

### **Mantle**

**데브렐 엔지니어** | 2026년 4월 - 2026년 10월 (7개월)\
*Ethereum L2 Mantle Network 위에서 실물자산을 온체인 자본시장에 잇는 글로벌 기관용 인프라*\
_기술 스택: TypeScript, Next.js, PostgreSQL, Solidity_

- **The Turing Test 해커톤 2026 한국 빌더 온보딩 총괄**: 총상금 $120K 2단계 글로벌 해커톤. AI 트레이딩 에이전트 대회 ClawHack에 한국 참가자를 모았고 한국 참가자의 에이전트가 거래량 트랙 1위로 $10.31M, 집계한 한국 지갑 12개가 대회 전체 거래량 $45.5M의 26.88%를 기록. Phase 2에서는 빌더 100명 이상이 모인 서울 해커하우스에서 해커톤 워크샵 진행

- **Q402 빌더 워크샵 운영 (Mantle × Quack AI, 2026년 8월)**: 빌더가 AI 에이전트를 MCP로 Q402에 연결해 지갑 앱과 가스 없이 채팅 창에서 Mantle 메인넷 결제를 실행하는 워크샵의 현장 운영 사이트를 pay-lab v1로 구축. 빌더 42명이 세 시간 동안 메인넷 결제 488건 실행

- **한국팀 콘텐츠 운영 파이프라인**: 스케줄러가 Mantle 공식 X 글을 번역해 채널별 글로 바꾸고, 사람이 번역과 채널별 글을 승인해야 발송되는 파이프라인을 설계·구현해 팀에 배포. 7월부터 한국 공식 계정 게시물이 이 파이프라인으로 나가고 있음

- **한국 공식 계정 운영**: 2026년 4~9월 게시물 279건, 노출 합계 24.6만, 노출 대비 참여율 1.74%로 글로벌 계정 1.03%의 1.7배

- **인하대학교 스테이블코인 결제 강의 (2026년 10월)**: pay-lab으로 운영한 실습에서 학생 30명이 휴대폰 지갑으로 옆 사람에게 테스트넷 USDC를 송금하고, 22명이 AI 에이전트에 지출 한도를 서명해 그 한도 안에서 에이전트로 결제

### **크로논랩스 주식회사**

**트레이딩 시스템 백엔드 엔지니어** | 2025년 4월 - 2025년 11월 (8개월)\
_기술 스택: Go (Fiber, Fx, gRPC), Python (Django), PostgreSQL, MongoDB, AWS (ECS, ECR, EC2, Parameter Store, KMS), Docker_

- **CEX 거래소 간 차익거래 시스템 Rothchild**: Binance, Bybit, Bithumb, Upbit, 무기한 선물 DEX를 오가며 실거래로 운영한 팀의 Taker-Taker·Maker-Taker 차익거래 시스템에서 주문, 잔고, PnL 콘솔 백엔드를 담당. 공통 거래소 인터페이스에 주문 교체·조회와 재연결을 더해 8개 거래소와 Solana DEX 주문 연동을 맡고, 자산별 Delta를 잔고가 가장 많은 거래소에서 청산하는 Delta 관리와 실시간 PnL 대시보드 구현
- **Solana DEX 온체인 트레이딩 봇**: 알파 전략을 실행하는 Go 봇을 수집, 감시, 실행 서버로 나눠 설계. 홀더 분석 서비스 두 개가 따로 부르던 Solscan API를 호출 조정 서비스 하나로 모아 호출 한도를 한 곳에서 적용. Solana 메인넷에서 실주문으로 운영
- **뉴스·KOL 시그널 트레이딩 엔진**: Telegram 비공개 채널과 X 리스트에서 모은 글을 OpenAI 어시스턴트 여러 개의 평균 점수로 판정하는 모듈을 구현하고, 판정 결과를 팀의 Binance·Bybit USDT 선물 주문 엔진에 연결해 실주문으로 실행
- **거래소 상장 스나이퍼**: Upbit·Bithumb 상장 공지의 새 심볼을 gRPC로 도쿄·싱가포르 주문 서버에 넘겨 Binance 선물, MEXC, Bybit에 주문하는 시스템을 팀과 함께 구현. VPS 20대에 나눠 둔 자체 공지 수집기가 2025년 6월 26일 시험에서 상장 공지 한 건을 외부 공지 피드 API보다 269ms 먼저 수신

### **미디움 주식회사**

**백엔드 엔지니어** | 2022년 9월 - 2024년 2월 (1년 6개월)\
_기술 스택: Go, TypeScript (NestJS), Solidity, Hyperledger Fabric 2.2, Kafka, MySQL, AWS, Docker_

- **크로스체인 브릿지 인프라**: 자사 L1 RIGO, Fabric 컨소시엄 체인 MDL, Ethereum을 잇는 다중 서명 검증형 브릿지를 팀과 함께 개발. 같은 이벤트는 거래 ID 기본 키로 건너뛰고 서버를 다시 띄우면 체인에 기록한 마지막 처리 블록부터 놓친 거래를 다시 읽는 Kafka 이벤트 파이프라인 구현. 기업 대상 B2B 시험으로 운영
- **증권형 토큰 플랫폼 (ERC-1400)**: Hyperledger Fabric Go 체인코드로 파티션별 발행·이전·소각과 토큰 지갑을 설계·구현해 기업들과의 PoC 시험에 사용
- **Hyperledger Fabric 네트워크 구성 자동화**: 조직, 채널, orderer 수가 다른 Fabric 네트워크를 인증서 발급부터 체인코드 배포까지 스크립트 하나로 띄우게 자동화해 팀이 Fabric 네트워크를 띄울 때 사용

### **BF Labs 주식회사**

**백엔드 엔지니어** | 2022년 8월 - 2022년 9월 (2개월)

- **정부 연구 프로젝트**: IITP(정보통신기획평가원) 지원 과제의 신고 접수·조회 REST API 서버를 Node.js, Express, MariaDB로 개발

---

## 학력 및 언어

- **경희대학교**: 기계공학과 공학사 | 2014년 3월 - 2022년 8월
- **영어**: TOEIC Speaking 150/200, Intermediate High · **한국어**: 원어민

---

## 기술 스택

- **전문 분야**: CEX·DEX 트레이딩 시스템, 거래소 연동과 주문 관리(REST, WebSocket, FIX·SBE), PnL·Delta 관리, 거래소 간·삼각 차익거래, DeFi 프로토콜, 크로스체인 브릿지, 스마트 컨트랙트(ERC-4626, ERC-2612, ERC-3009), 증권형 토큰(ERC-1400 방식)
- **언어**: Rust, Go, Python, TypeScript
- **블록체인**: Solidity (Foundry, Hardhat), Solana (Rust), Hyperledger Fabric
- **백엔드 프레임워크**: NestJS, Next.js, Fastify, Django, Gin, Fiber, Fx
- **인프라**: AWS, GCP, Docker, Kubernetes, PostgreSQL, MySQL, Kafka, Redis, Vercel
- **AI 도구**: Claude Code, Codex, MCP 서버, 에이전트 스킬, 트리거 평가, 가드레일 훅, Human-in-the-loop 파이프라인

---

## 주요 프로젝트

**mantle-kr-herald**: Mantle 한국팀의 Human-in-the-loop 콘텐츠 파이프라인 | _TypeScript, PostgreSQL, Vercel, Vitest, Claude Code_

- 승인된 번역과 공식 영문·한국어 게시물 쌍을 few-shot 예시와 번역 메모리로 프롬프트에 넣고, 같은 글이 두 번 나가지 않게 발송 원장의 기본 키로 멱등 발송. 외부 API와 저장소를 포트 34개 뒤에 두어 파일에서 PostgreSQL로 옮길 때 도메인 코드 수정 없이 어댑터 19개로 전환

**pay-lab**: 워크샵과 강의마다 설정만 바꿔 쓰는 온체인 결제 실습 키트 | _Next.js, PostgreSQL, Privy, viem, MCP, Foundry, Vercel_

- 실습 모듈, 회차 설정, 체인 어댑터로 나눠 설정 값 하나로 같은 코드가 Mantle, Ethereum Sepolia, 로컬 Anvil에서 실행되는 키트. ERC-3009 가스 대납, ERC-2612 permit 한도 안에서만 송금하는 에이전트 지갑 도구, 지갑 서명 OAuth로 claude.ai와 Codex에 붙는 원격 MCP 서버
- fail-closed 검사, 멱등 충전, 멈춘 송금의 reconciliation. 운영 부하 시험에서 찾은 Vercel 함수 사이의 논스 충돌을 PostgreSQL advisory lock과 지갑별 논스 테이블로 직렬화해, 가상 학생 30명이 2초 안에 몰아 보낸 송금을 모두 처리

**matching-ledger**: 거래소 매칭 엔진과 정산 원장 | _Rust_

- 거래소 매칭 엔진의 정합성과 장애 복구를 위해 스레드 하나가 입력 로그 순서대로 체결하는 single-writer 매칭 엔진과 정산 원장을 만듦. 합성 주문 로그를 320번 재생해 매번 같은 상태가 나왔고 프로세스를 400번 강제 종료해도 응답한 주문을 잃은 경우가 0건, 스냅샷으로 로그 1,020만 건의 복구를 5.43초에서 1.65초로 줄임. 2026년 11월 측정

**Binance 삼각 차익거래 엔진** | _Rust, FIX 4.4, SBE (Simple Binary Encoding), rustls_

- Binance FIX API에 Ed25519 서명으로 로그온하고 시세와 주문 세션을 SBE 바이너리 인코딩으로 여는 Rust 엔진. 호가가 바뀔 때마다 BTC·ETH·USDT 삼각형 양방향의 테이커 수수료를 뺀 수익률을 계산해 임계값을 넘는 방향만 채택

**skills**: Claude Code·Codex 에이전트 스킬 마켓플레이스와 가드레일 훅 | _에이전트 스킬, Python, Bash_

- 원본 하나에서 Claude Code와 Codex의 플러그인 매니페스트를 생성하고 전역 지시를 두 에이전트에 설치해, 두 에이전트가 같은 스킬과 지시로 일하게 하는 마켓플레이스. PreToolUse 훅으로 서브에이전트 중첩과 .env 비밀값 출력을 차단

---

## 수상 및 자격

- **Mantle 글로벌 해커톤 2025 DeFi & Composability 트랙 1위, Mantle 인큐베이션 그랜트 선정** (DOOR Protocol) | 2026년 2월
  - 빌더 2,000명 이상이 제출작 500개 이상을 낸 총상금 $150K 규모의 글로벌 해커톤. 인큐베이션 그랜트는 3팀만 선정. 기획 문서, ERC-4626 트랜치 볼트를 포함한 컨트랙트, 백엔드, 금리 오라클 수집기, Next.js 대시보드, 키퍼 봇을 모두 작성
- **Seoulana 해커톤 2025 Bitcoin on Solana 트랙(Zeus Network) 3위** (Solana 블록체인 개발 경진대회) | 2025년 4월
- **일반기계기사** (한국산업인력공단) | 2020년 12월

---

## 리더십 및 리서치

### **Orakle: KAIST 기반 블록체인 연구 학회**

**8기 부학회장** | 2026년 3월 - 현재 · **7기 ODA 팀 팀장** | 2025년 9월 - 2026년 2월

- 8기 최종 리서치 컨퍼런스(2026년 9월, Sui·Radius·CertiK 후원)를 개최하고, 스테이블코인 디페그 조사를 포함한 7기 공개 DeFi 리서치 집필. 회복될 디페그만 골라 차익거래하는 Solana 디페그 서처를 Go로 구현\
  리서치 링크: https://github.com/orakle-7th-sda/conference-pdf
