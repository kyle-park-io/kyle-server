# Cloudflare 캐시 purge 설정

jungho.dev 앞의 Cloudflare 는 `/cv/*` 파일을 원 서버의 `cache-control: max-age=14400`대로 4시간 동안 캐시한다. 그래서 CV 를 고쳐 배포해도 purge 하지 않으면 최대 4시간 동안 옛 PDF 가 나간다. 2026-10-30 배포 뒤 국문 PDF 주소가 `cf-cache-status: HIT`로 옛 판을 돌려줬다.

purge 는 `scripts/purge-cv.sh`가 한다. 이 스크립트는 Cache Purge 권한만 준 토큰을 쓴다. 인증서 갱신용 토큰(`packages/ingress-reverse-proxy/ini/cloudflare.ini`)은 쓰지 않는다. 2026-10-30에 그 토큰은 토큰 확인(`/user/tokens/verify`)과 영역 조회는 통과했지만, `purge_cache`에서 401 `Authentication error`(코드 10000)로 거절됐다.

## 1. 토큰 만들기

Cloudflare 문서 「Create API token」의 순서를 이 레포에 맞춰 적었다([원문](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/), 2026-10-30 열람).

1. https://dash.cloudflare.com/profile/api-tokens 를 연다. 대시보드 메뉴로는 **My Profile**, **API Tokens** 순서다.
2. **Create Token**을 누른다.
3. 템플릿을 고르지 않고 직접 지정하는 토큰(Custom token)을 고른다. Cache Purge 권한이 든 템플릿은 없다([템플릿 목록](https://developers.cloudflare.com/fundamentals/api/reference/template/), 2026-10-30 열람).
4. **Token name**에 `kyle-server-cache-purge`를 쓴다.
5. **Permissions** 줄에서 왼쪽부터 `Zone`, `Cache Purge`를 고르고, 세 번째 칸(접근 수준)은 목록에 나오는 값을 고른다. Cache Purge 는 Zone 묶음의 권한이다([권한 목록](https://developers.cloudflare.com/fundamentals/api/reference/permissions/), 2026-10-30 열람). 다른 권한 줄은 더하지 않는다.
6. **Zone Resources** 줄에서 `Include`, `Specific zone`, `jungho.dev`를 고른다.
7. **Client IP Address Filtering**과 **TTL**은 비워 둔다. 배포하는 컴퓨터의 IP 가 바뀌면 IP 를 묶은 토큰이 거절되기 때문이다.
8. **Continue to summary**를 누르고, 요약의 권한이 jungho.dev 의 Cache Purge 하나뿐인지 본다.
9. **Create Token**을 누른다. 토큰 값은 이 화면에서 한 번만 보인다. 바로 2절대로 파일에 넣는다.

## 2. 토큰 넣기

토큰은 `~/.config/kyle-server/cloudflare-purge.env`에 둔다. 이 파일은 레포 밖에 있고 권한이 600 이다. 채팅, 커밋, 이슈에 붙여 넣지 않는다.

```
CLOUDFLARE_ZONE_ID=<jungho.dev 영역 ID>
CLOUDFLARE_PURGE_TOKEN=<1절에서 복사한 토큰>
```

2026-10-30에 영역 ID 를 채우고 토큰 줄은 비운 파일을 만들어 두었다. 편집기로 열어 `CLOUDFLARE_PURGE_TOKEN=` 뒤에 붙여 넣는다. 파일이 없으면 위 두 줄로 새로 만들고 `chmod 600`을 건다. 영역 ID 는 대시보드에서 jungho.dev 를 고른 뒤 **Overview** 화면 아래쪽 **API** 칸의 **Zone ID** 옆 복사 버튼으로 얻는다([원문](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/), 2026-10-30 열람).

넣은 뒤 `bash scripts/purge-cv.sh --verify`를 돌려 `token: active`가 나오는지 본다. 이 확인은 토큰이 살아 있는지만 본다. 권한은 3절의 purge 를 한 번 돌려야 확인된다. 인증서용 토큰도 `--verify`는 통과했다.

## 3. 쓰기

CV 를 바꾼 배포에서 `kubectl rollout status`가 끝난 뒤에 레포 루트에서 돌린다.

```
bash scripts/purge-cv.sh
```

국문과 영문 CV 의 PDF 와 md 주소 4개를 지우고, 2초 뒤 주소마다 다시 요청해 `CF-Cache-Status`를 찍는다. Cloudflare 는 purge 요청이 200 이어도 실제로 지웠는지는 보장하지 않고, 다시 요청해 HIT 가 아닌지 보라고 한다([원문](https://developers.cloudflare.com/cache/how-to/purge-cache/), 2026-10-30 열람). md 주소 2개는 `DYNAMIC`으로 찍힌다. 실패가 아니므로 그대로 둔다. 이 주소는 md 파일 대신 사이트 HTML 을 돌려주고(`content-type: text/html`, `cache-control: public, max-age=0`, 2026-10-30 17:3x 응답 헤더), Cloudflare 는 `DYNAMIC`을 요청 시점에 캐시 대상이 아니라고 판단해 캐시를 거치지 않고 원 서버로 보낸 응답으로 설명한다([원문](https://developers.cloudflare.com/cache/concepts/cache-responses/), 2026-10-30 열람). 2026-10-30 16:36 첫 실행과 17:2x 배포 뒤 실행 모두 PDF 2개는 `MISS`, md 2개는 `DYNAMIC`이었고, 그 뒤 받은 PDF 해시가 레포 파일과 같았다. 다른 주소를 지우려면 주소를 인자로 넘긴다(`bash scripts/purge-cv.sh https://jungho.dev/cv/jungho_park_cv_latest_ko.pdf`).

## 4. 거절될 때

`scripts/purge-cv.sh`가 찍는 문구마다 원인과 할 일을 모은 표다.

| 화면에 나온 것 | 원인 | 할 일 |
| --- | --- | --- |
| `cloudflare-purge.env not found` | 설정 파일 없음 | 2절의 두 줄로 파일을 만들고 `chmod 600` |
| `CLOUDFLARE_PURGE_TOKEN is empty` | 토큰 줄이 빈 파일 | 1절로 만든 토큰을 붙여 넣기 |
| `code 10000: Authentication error` | 토큰 값이 틀렸거나, jungho.dev 의 Cache Purge 권한이 없는 토큰 | 대시보드 API Tokens 목록에서 `kyle-server-cache-purge`를 열어 권한과 Zone Resources 를 1절 5, 6번과 견주기. 토큰을 다시 발급(Roll)했으면 파일 값도 새 값으로 바꾸기 |
| `--verify`에서 `Cloudflare did not accept the token` | 만료되거나 폐기된 토큰, 또는 잘린 값 | 목록에서 토큰 상태를 보고, 필요하면 1절로 새로 만들기 |
| purge 는 됐는데 주소 하나가 `HIT` | purge 직후 다른 요청이 다시 채운 캐시, 또는 늦은 전파 | 몇 초 뒤 다시 돌리기. 그래도 HIT 이고 내용이 옛 판이면 아래 대시보드 순서로 지우기 |

스크립트를 쓸 수 없을 때는 대시보드에서 지운다. jungho.dev 를 고르고 **Caching**, **Configuration** 화면에서 **Purge Cache**의 **Custom Purge**를 누른 뒤, **Purge by**에서 **URL**을 골라 주소를 넣고 **Purge**를 누른다([원문](https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-single-file/), 2026-10-30 열람). purge 하지 않아도 캐시된 뒤 4시간이 지나면 새 판이 나간다.
