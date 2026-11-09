# 박정호 (Kyle) - 이력서

**퀀트 트레이딩·블록체인 시스템 백엔드 엔지니어**

거래소 간 차익거래, 온체인 트레이딩, 크로스체인 브릿지를 Rust, Go, TypeScript로 만드는 백엔드 엔지니어입니다. 크로논랩스에서 팀과 함께 만든 차익거래 시스템의 8개 거래소 주문 연동과 PnL·Delta 관리를 맡았습니다. 2026년에는 글로벌 기업 Mantle에 데브렐 엔지니어로 합류하여 해커톤 한국 빌더 온보딩을 총괄했습니다.

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

- **The Turing Test 해커톤 2026 한국 빌더 온보딩 총괄**: 총상금 $120K 2단계 글로벌 해커톤. AI 트레이딩 에이전트 대회 ClawHack에 한국 참가자를 모았고 한국 참가자의 에이전트가 거래량 트랙 1위로 $10.31M, 집계한 한국 지갑 12개가 전체 거래량의 26.88%를 기록. Phase 2에서는 빌더 100명 이상이 모인 서울 해커하우스 워크샵을 포함해 워크샵 운영

- **Q402 빌더 워크샵 운영 (Mantle × Quack AI, 2026년 8월)**: 빌더 42명이 AI 에이전트를 MCP로 Q402에 연결해 지갑 앱과 가스 없이 채팅 창에서 Mantle 메인넷 결제를 실행한 워크샵. 현장 운영 사이트를 pay-lab의 첫 버전으로 구축했고 세 시간 동안 온체인 결제 488건

- **한국팀 콘텐츠 운영 파이프라인 설계·구현 후 팀에 배포**: 스케줄러가 Mantle 공식 X 영문 글을 한국어로 번역해 채널별 글로 바꾸고, 사람은 번역과 채널별 글을 차례로 승인해 발송. 2026년 7월부터 한국 공식 계정이 콘텐츠 운영 파이프라인으로 게시했고, 10월까지 X 글 446개를 모아 번역 162건과 채널별 변환본 837개 생성

- **한국 공식 계정 운영**: 2026년 4~9월 게시물 279건, 노출 24.6만, 참여율 1.74%로 글로벌 계정 1.03%의 1.7배

- **인하대학교 스테이블코인 결제 강의 (2026년 10월)**: 휴대폰 지갑으로 테스트넷 USDC를 보내고, AI 에이전트에 지출 한도를 서명해 한도를 넘는 요청이 서버와 USDC 컨트랙트에서 거절되는 것을 확인하는 실습을 pay-lab으로 운영

### **크로논랩스 주식회사**

**트레이딩 시스템 백엔드 엔지니어** | 2025년 4월 - 2025년 11월 (8개월)\
_기술 스택: Go (Fiber, Fx, gRPC), Python (Django), PostgreSQL, MongoDB, AWS (ECS, ECR, EC2, Parameter Store, KMS), Docker_

- **CEX 거래소 간 차익거래 시스템 Rothchild**: Binance, Bybit, Bithumb, Upbit, 무기한 선물 DEX를 오가는 팀의 Taker-Taker·Maker-Taker 차익거래 시스템에서 주문, 잔고, PnL 콘솔 백엔드를 담당. 8개 거래소와 Solana DEX의 주문 등록·취소·교체·조회, 체결 WebSocket, 재연결, 자산별 Delta를 잔고가 가장 많은 거래소에서 청산하는 Delta 관리 모듈, 실시간 PnL 대시보드 구현
- **Solana DEX 온체인 트레이딩 봇**: 알파 전략 3종을 실행하는 Go 봇. GoPlus와 홀더 분포 진입 필터, Jupiter 스왑과 트리거 주문, Helius WebSocket 풀 감시. 홀더 분석 서비스 두 개가 따로 부르던 Solscan API를 호출 조정 서비스 하나로 모아, 요청을 우선순위 세 단계로 줄 세우고 호출 한도를 조정 서비스에서만 적용
- **뉴스·KOL 시그널 트레이딩 엔진**: Telegram과 X 수집 모듈, OpenAI 어시스턴트 여러 개의 평균 점수 판정을 구현해 팀의 Binance·Bybit USDT 선물 주문 엔진에 연결. 기사 100건 시험 목록으로 지시문 3개 판을 반복 시험하며 판정을 개선
- **거래소 상장 스나이퍼**: Upbit·Bithumb 상장 공지의 새 심볼을 gRPC로 도쿄·싱가포르 주문 서버에 넘겨 Binance 선물, MEXC, Bybit에 주문하는 시스템을 팀과 함께 구현

### **미디움 주식회사**

**백엔드 엔지니어** | 2022년 9월 - 2024년 2월 (1년 6개월)\
_기술 스택: Go, TypeScript (NestJS), Solidity, Hyperledger Fabric 2.2, Kafka, MySQL, AWS, Docker_

- **크로스체인 브릿지 인프라**: 자사 L1 RIGO, Fabric 컨소시엄 체인 MDL, Ethereum을 잇는 다중 서명 검증형 브릿지를 팀과 함께 개발. Kafka 이벤트 파이프라인, 브릿지 체인코드 17개, Solidity 컨트랙트
- **증권형 토큰 플랫폼 (ERC-1400)**: Hyperledger Fabric Go 체인코드로 파티션별 발행·이전·소각과 토큰 지갑을 설계·구현
- **Hyperledger Fabric 네트워크 구성 자동화**: 인증서 발급부터 체인코드 커밋까지 Bash로 자동화한 Docker Compose 구성 7종과 Docker 없는 구성 4종

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

- 승인된 번역과 공식 영문·한국어 게시물 쌍을 few-shot 예시와 번역 메모리로 프롬프트에 넣고, 같은 글이 두 번 나가지 않게 멱등 발송. 외부 API와 저장소를 포트 34개 뒤에 두어 파일에서 PostgreSQL로 옮길 때 도메인 코드 수정 없이 어댑터 19개로 전환. 시험 케이스 5,115개

**pay-lab**: 워크샵과 강의마다 설정만 바꿔 쓰는 온체인 결제 실습 키트 | _Next.js, PostgreSQL, Privy, viem, MCP, Foundry, Vercel_

- 실습 모듈, 회차 설정, 체인 어댑터로 나눠 설정 값 하나로 같은 코드가 Mantle, Ethereum Sepolia, 로컬 Anvil에서 실행되는 키트. ERC-3009 가스 대납, ERC-2612 permit 한도 안에서만 송금하는 에이전트 지갑 도구, 지갑 서명 OAuth로 claude.ai와 Codex에 붙는 원격 MCP 서버
- fail-closed 검사, 멱등 충전, 멈춘 송금의 reconciliation. 가상 학생 30명 부하 시험에서 같은 논스로 30건 중 3건에서 8건이 실패하던 문제를 PostgreSQL advisory lock과 지갑별 논스 테이블로 해결

**Binance 삼각 차익거래 엔진** | _Rust, FIX 4.4, SBE (Simple Binary Encoding), rustls_

- Binance FIX API에 Ed25519 서명으로 로그온하고 시세와 주문 세션을 SBE 바이너리 인코딩으로 여는 Rust 엔진. 호가가 바뀔 때마다 BTC·ETH·USDT 삼각형 양방향의 테이커 수수료를 뺀 수익률을 계산해 임계값을 넘는 방향만 채택

**Polymarket 15분 시장 complete set 차익거래 봇** | _Go, Rust_

- 두 결과 토큰의 최우선 매도호가 합이 $1 미만이면 두 토큰을 함께 사는 봇. v1은 29ms를 넘은 호가로 만든 신호를 버리는 stale quote 필터, v2는 수수료 표로 다시 정한 매수 임계값과 미리 서명한 FOK 주문으로 체결되지 않은 주문이 호가창에 남지 않게 함

**skills**: Claude Code·Codex 에이전트 스킬 마켓플레이스와 가드레일 훅 | _에이전트 스킬, Python, Bash_

- 원본 하나에서 Claude Code와 Codex 매니페스트를 생성하는 도메인 플러그인 7개. 트리거 평가에서 project-templates 쿼리 14개를 세 번씩 돌려 precision과 recall 1.0, PreToolUse 훅으로 서브에이전트 중첩과 .env 비밀값 출력을 차단

---

## 수상 및 자격

- **Mantle 글로벌 해커톤 2025 DeFi & Composability 트랙 1위, Mantle 인큐베이션 그랜트 선정** (DOOR Protocol) | 2026년 2월
  - 빌더 2,000명 이상이 제출작 500개 이상을 낸 총상금 $150K 규모의 글로벌 해커톤. 인큐베이션 그랜트는 3팀만 선정. 기획 문서, ERC-4626 트랜치 볼트를 포함한 컨트랙트 7개, 백엔드, 금리 오라클 수집기, Next.js 대시보드, 키퍼 봇을 모두 작성
- **Seoulana 해커톤 2025 Bitcoin on Solana 트랙(Zeus Network) 3위** (Solana 블록체인 개발 경진대회) | 2025년 4월
- **일반기계기사** (한국산업인력공단) | 2020년 12월

---

## 리더십 및 리서치

### **Orakle: KAIST 기반 블록체인 연구 학회**

**8기 부학회장** | 2026년 3월 - 현재 · **7기 ODA 팀 팀장** | 2025년 9월 - 2026년 2월

- 8기 최종 리서치 컨퍼런스를 개최하고, 스테이블코인 디페그 조사를 포함한 7기 공개 DeFi 리서치 5편 집필. 회복될 디페그만 골라 차익거래하는 Solana 디페그 서처를 Go로 구현\
  리서치 링크: https://github.com/orakle-7th-sda/conference-pdf
