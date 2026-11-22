[English](README.md) | **한국어**

# kyle-server

jungho.dev 의 사이트(`packages/blog-frontend`, `packages/blog-backend`)와 앞단 프록시(`packages/ingress-reverse-proxy`)다.

- CV 를 고쳐 배포하는 순서: [`docs/cv-release.md`](docs/cv-release.md)
- CV 캐시를 지우는 토큰 설정: [`docs/setup/cloudflare-cache-purge.md`](docs/setup/cloudflare-cache-purge.md)

## 구조

세 단계 안의 모든 폴더와 맨 위의 표준이 아닌 파일이다. 경로는 레포 맨 위 폴더에서 센다.

```
.github/                  GitHub 설정
  workflows/              image-build.yml 이 풀 리퀘스트마다 도커 이미지 둘을 빌드한다. 푸시는 하지 않는다
.husky/                   Git 훅 스크립트. commit-msg 는 commitlint, pre-commit 은 prettier-format 을 돌리고 나머지는 비어 있다
docs/                     작업 순서와 설계 기록
  setup/                  처음 한 번 하는 계정과 토큰 설정(Cloudflare 캐시 지우기)
  superpowers/            큰 변경 전에 쓴 계획서와 설계서
    plans/                변경마다 하나씩 쓴 구현 계획서. YYYY-MM-DD-<주제>.md
    specs/                그 계획서의 바탕이 된 설계서. YYYY-MM-DD-<주제>-design.md
packages/                 Yarn 워크스페이스. 배포하는 패키지나 공유 패키지마다 폴더 하나
  blog-backend/           사이트 이미지의 Express 서버. 빌드한 블로그(/blog), SPA 번들, /api 를 서빙한다. Dockerfile 과 푸시 스크립트가 있다
    __tests__/            블로그 경로, 언어 처리, 옛 슬러그, 블로그 빌드 테스트
    config/               dev.yaml 과 prod.yaml 서버 설정(포트)
    lib/                  Lerna 패키지 기본 파일(blog-backend.js)
    production/           Dockerfile 이 src/ 를 컴파일할 때 쓰는 package.json 과 tsconfig.json
    scripts/              컨테이너 스크립트. start-server.sh, build-blog.sh(cron 이 10분마다 블로그를 다시 빌드), init-script.sh(블로그 글 레포를 clone)
    src/                  서버의 TypeScript 소스(app.ts, blog/, config/, routes/)
  blog-frontend/          jungho.dev 의 React 단일 페이지 앱(Vite 와 webpack 빌드)
    __tests__/            단일 페이지 앱 테스트
    lib/                  Lerna 패키지 기본 파일(blog-frontend.js)
    public/               정적 파일. 배경 이미지, cv/(CV PDF), devrel/(캠퍼스 이미지), kyle/(프로필 이미지)
    src/                  앱 소스. 페이지 구역마다 폴더 하나(about, chat, devrel, hero, profile, quant 등)
  blog-site/              jungho.dev/blog 로 나가는 Astro 정적 블로그
    __tests__/            피드, i18n, 목록과 글 페이지, 조회수, 빌드 결과 테스트. fixtures/ 에 샘플 글이 있다
    src/                  Astro 소스. components, config, layouts, lib, pages, styles
  ingress-reverse-proxy/  사이트 앞단의 Go 리버스 프록시. TLS, 라우팅, 요청 제한, 방문자 접속 수와 조회수
    __tests__/            Lerna 패키지 기본 테스트
    assets/               정적 파일을 서빙하고 캐시한다(dev 와 prod 파일 표가 따로 있다)
    config/               common.yaml 과 dev, prod 링크 목록(경로에서 업스트림 URL 로)
    constants/            고정값. 링크 파일 경로, 포트, SSL 경로
    cors/                 CORS 처리
    cron/                 인증서 갱신 cron 표(certbot-renew)와 그것을 설치하는 스크립트
    handlers/             HTTP 와 HTTPS 요청 처리, 프록시
    internal/             이 모듈만 가져다 쓰는 패키지(config/ 가 환경 변수와 viper 설정을 읽는다)
    lib/                  Lerna 패키지 기본 파일(ingress-reverse-proxy.js)
    logger/               zap 로거 설정
    middleware/           HTTP 미들웨어
    public/               프록시가 서빙하는 정적 파일. 이미지, cv/(CV PDF), devrel/, kyle/, root/(favicon.ico, robots.txt, sitemap.xml, ads.txt)
    redirect/             리다이렉트, 클라이언트 IP 확인, 요청 제한, 토큰
    redis/                카운터 서버와 통신. 방문자 식별, 접속 수, 조회수
    scheduler/            접속 수 스냅샷을 갱신하는 백그라운드 작업
    scripts/              컨테이너 시작 스크립트와 SSL 인증서 발급, 갱신, 복사 스크립트
    tls/                  인증서 로드와 갱신 때 다시 읽기
    types/                공유 Go 타입
    utils/                파일, OS, URL, YAML, 볼륨 복사 보조 함수
  site-shell/             SPA 와 Astro 블로그가 같이 쓰는 내비게이션 데이터, 접속 수 카드, 디자인 토큰
    __tests__/            내비게이션과 접속 수 테스트
    src/                  소스(nav.ts, presence.ts, presence-card.ts)와 styles/(tokens.css, presence.css)
scripts/                  배포 스크립트. build.sh, build-cv.sh(CV PDF), purge-cv.sh(Cloudflare 캐시), push.sh(이미지 푸시), integration.sh(빌드 뒤 푸시)
.commitlintrc             commitlint 규칙(conventional commits)
.eslintignore             ESLint 가 건너뛰는 경로
.puppeteerrc.cjs          Puppeteer 의 Chrome 내려받기를 건너뛰어 yarn install 이 되게 한다. CV 빌드는 시스템 Chrome 을 쓴다
git.sh                    이 클론의 로컬 git 사용자 설정
init.sh                   처음 한 번 하는 yarn 과 husky 설정 명령
lerna.json                Lerna 워크스페이스 설정
```
