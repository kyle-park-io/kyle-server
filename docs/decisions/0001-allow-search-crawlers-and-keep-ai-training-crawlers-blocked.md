# 0001. Let search and answer crawlers into jungho.dev and keep AI training crawlers out

> Status: accepted
> Date: 2026-11-28
> Decision makers: Kyle Park (repository owner)
> Related: [`packages/ingress-reverse-proxy/public/root/robots.txt`](../../packages/ingress-reverse-proxy/public/root/robots.txt)

## Context

- jungho.dev hosts a public CV and a blog. Recruiters have to be able to find them through search engines and AI search (ChatGPT, Claude).
- The robots.txt served on 2026-11-28 has two parts. Cloudflare prepends the first through a dashboard setting (**Enable Bot Preference Sync**; [Cloudflare docs](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/bots/additional-configurations/managed-robots-txt.mdx): "Cloudflare will prepend our managed `robots.txt` before your existing `robots.txt`"). The second is this repository's `robots.txt` (`User-agent: *`, `Allow: /`, two `Sitemap:` lines).
- The first part sets `Content-Signal: search=yes,ai-train=no` and disallows 31 training crawlers, including GPTBot, ClaudeBot, Google-Extended and CCBot. OAI-SearchBot, ChatGPT-User, Claude-SearchBot and Claude-User are not named, so the `*` rule allows them.
- Both companies let sites choose training and search separately. OpenAI: "a webmaster can allow OAI-SearchBot in order to appear in search results while disallowing GPTBot to indicate that crawled content should not be used for training" ([OpenAI bots](https://platform.openai.com/docs/bots)). Anthropic: blocking Claude-SearchBot "may reduce your site's visibility" ([Anthropic crawler help](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)). Both read 2026-11-28.

## Decision

- Keep the current setup: allow search crawlers and user-triggered answer crawlers, disallow AI training crawlers.
- The source of truth for this policy is the AI crawler setting in the Cloudflare dashboard. This repository's `robots.txt` stays open to every crawler and only announces the sitemaps. To change the policy, change the dashboard and write a new record that supersedes this one.

## Options considered

| Option | Why it was not chosen |
| --- | --- |
| Allow training crawlers too | Models would learn more of the writing, but there would be no say in what it is used for |
| Block every AI crawler, search and answer included | The CV and blog would not appear in AI search |

## Consequences

- Good: the site appears in search engines and AI search, and declines use as training data.
- Bad: robots.txt is a request, so crawlers that ignore it are not stopped (RFC 9309: "These rules are not a form of access authorization"). Enforcing it needs Cloudflare AI Crawl Control turned on separately.
