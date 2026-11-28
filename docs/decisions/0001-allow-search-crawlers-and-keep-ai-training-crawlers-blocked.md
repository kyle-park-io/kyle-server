# 0001. jungho.dev는 검색과 답변 크롤러를 받고, AI 학습 크롤러는 막는다

> 상태: 채택
> 날짜: 2026-11-28
> 정한 사람: 요청자("좋아좋아.권장하는데로 다하고", 2026-11-28)
> 이어지는 문서: skills `docs/REPO-LIFECYCLE.md` 1.1절, [`packages/ingress-reverse-proxy/public/root/robots.txt`](../../packages/ingress-reverse-proxy/public/root/robots.txt)

## 맥락

- jungho.dev는 공개 CV와 블로그다(kyle-career `README.md` 5번 줄). 채용 담당자가 검색 엔진과 AI 검색(ChatGPT, Claude)에서 찾을 수 있어야 한다.
- 2026-11-28에 받은 robots.txt는 두 겹이다. 앞은 Cloudflare가 대시보드 설정(**Enable Bot Preference Sync**)으로 붙인 것이고([Cloudflare 문서](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/bots/additional-configurations/managed-robots-txt.mdx): 「Cloudflare will prepend our managed `robots.txt` before your existing `robots.txt`」), 뒤는 이 레포의 `robots.txt`(`User-agent: *`, `Allow: /`, `Sitemap:` 두 줄)다.
- 앞쪽은 `Content-Signal: search=yes,ai-train=no`를 쓰고, GPTBot, ClaudeBot, Google-Extended, CCBot 등 학습용 크롤러 31개를 막는다. OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User는 이름이 없어 `*` 규칙으로 허용된다.
- 두 회사는 학습과 검색을 따로 고르게 한다. OpenAI: 「a webmaster can allow OAI-SearchBot in order to appear in search results while disallowing GPTBot to indicate that crawled content should not be used for training」([OpenAI bots](https://platform.openai.com/docs/bots)). Anthropic: Claude-SearchBot을 막으면 「may reduce your site's visibility」([Anthropic 크롤러 안내](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)). 모두 2026-11-28 열람.

## 결정

- 지금 설정을 그대로 둔다. 검색 크롤러와 사용자가 부른 답변 크롤러는 받고, AI 학습 크롤러는 막는다.
- 이 정책은 Cloudflare 대시보드의 AI 크롤러 설정이 정본이다. 이 레포의 `robots.txt`는 모든 크롤러에 열어 두고 사이트맵만 알린다. 바꿀 때는 대시보드를 바꾸고 이 기록을 대체하는 새 기록을 쓴다.

## 견준 안

고른 안 밖에 견준 안과, 고르지 않은 이유다.

| 안 | 고르지 않은 이유 |
| --- | --- |
| 학습 크롤러까지 모두 받는다 | 모델이 글을 더 많이 알게 되지만, 쓴 글이 어디에 쓰일지 고를 수 없게 된다 |
| AI 크롤러를 모두 막는다(검색과 답변 포함) | AI 검색에서 CV와 블로그가 나오지 않는다 |

## 결과

- 좋은 것: 검색 엔진과 AI 검색에는 나오고, 글이 학습 자료로 쓰이는 것은 거절한다.
- 나쁜 것: robots.txt는 부탁이라 따르지 않는 크롤러는 막지 못한다(RFC 9309: 「These rules are not a form of access authorization」). 강제로 막으려면 Cloudflare AI Crawl Control을 따로 켠다.
