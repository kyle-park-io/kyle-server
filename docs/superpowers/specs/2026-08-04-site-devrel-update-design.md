# Site Update — DevRel Page, X Links, CV Sync (2026-08-04)

## Goal

Bring `jungho.dev` in line with the current role (Developer Relations Engineer at
Mantle Network) and the latest CV:

1. Hide the DEX Aggregator card on the root page
2. Link X (`https://x.com/bcd_kyle`) from the footer and the profile
3. Update About and Profile against `public/cv/jungho_park_cv_latest.md`
4. Add a Mantle DevRel page at `/devrel`, linked from the header left of Quant

## Constraints

- SolidJS + `@solidjs/router`, pages live at `src/<name>/<Name>.tsx` + `.css`
- Production build is webpack (`webpack.config.prod.js`), not vite:
  `@public` → `packages/blog-frontend/public`, `webp` handled by the asset rule
- House style: NYT-inspired, light background with dark cards, red accent
  (`Quant.css` is the closest reference)
- CSS custom properties are namespaced per page (`--quant-*`), so the new page
  uses `--devrel-*`

## Photos

Source: `../twitterapi-io/devrel/data/0xMantleKR-tweets.json` (221 tweets, 104
with photos). 60 candidates were downloaded and reviewed as contact sheets;
13 were selected, converted to webp, and committed to `public/devrel/`
(~1.4 MB total, 1200px wide; hero is 1600px).

Selection rule: **only events where the source tweet names `@bcd_kyle` as the
session lead**, or the campus tour (sole speaker per the CV). Photos showing
other speakers' sessions were dropped — the page is a personal portfolio, so a
photo that is not his own work misrepresents it. Two candidates were removed
under this rule after review (`hackerhouse-keynote`, `hackerhouse-fireside`).

| File | Event |
| --- | --- |
| `hero-workshop.webp` | Mantle Seoul workshop, full room |
| `onboarding-session.webp` | Mantle Seoul workshop session |
| `onboarding-livebuild.webp` | Hacker house live build session |
| `hackerhouse-workshop.webp` | Hacker house hackathon workshop |
| `hackerhouse-session.webp` | Hacker house — From BitDAO to The Liquidity Chain |
| `mogakko.webp` | AI Awakening offline co-working |
| `campus-{korea-university,kaist,skku,ewha,inha,ajou,kwangwoon}.webp` | 7-university campus tour |

Each photo credits `@0xMantleKR` and links to its source tweet.

## 1. DevRel page — `/devrel`

New `src/devrel/DevRel.tsx` + `DevRel.css`, following the Quant page structure.

```
Overview   Role summary — Korea DevRel at Mantle Network
Impact     Six figures: 14 modules · 5 docs · 7 universities
           221 posts · 175K impressions · 1.84% ER (1.4x the global 1.28%)
Work       1 mantle-kr-herald       content ops pipeline; 276 src / 209 test files,
                                    agent-in-the-loop, hexagonal, PostgreSQL on Vercel
           2 Korean Tech Docs       5 documents (explorer beginner/deep-dive, DEX
                                    comparison, AI agent trading, asset withdrawal)
           3 Onboarding Curriculum  Bybit API, Byreal Skills CLI, MerchantMoe/Agni/
                                    Fluxion, testnet labs, live stablecoin pair-trading
                                    bot                            [2 photos]
           4 Turing Test Hackathon  $120K two-phase program, 6-week Korea funnel for
                                    Phase 2                        [3 photos]
           5 7-University Tour      sole speaker, 3 weeks          [7 photos, captioned]
           6 Official KR Account    221 posts
Links      Docs hub (Notion) · mantle-kr-herald (GitHub) · @0xMantleKR · @bcd_kyle
```

## 2. Entry points

- `Header.tsx`: `DevRel` nav item left of `Quant`, with its own
  `--devrel` modifier class for colour, matching how Quant/P.Quant are treated
- `index.tsx`: `<Route path="/devrel" component={DevRel} />`
- `App.tsx`: DevRel card first in the Introduce grid, ahead of Quant
- `Offcanvas.tsx`: DevRel under Featured below Quant Portfolio, X under Social.
  Quant Portfolio carries the `nav-link--featured` highlight, so a plain DevRel
  link above it inverts the visual hierarchy.

Rationale: the header alone leaves the current role invisible from the root
page, which is where most visitors land.

The DevRel card uses the Mantle logo and a dark navy gradient
(`#0f172a → #1e3a8a`). The Introduce row already carries a neutral slate
(Quant) and a saturated teal (Personal Quant); a third saturated colour fights
with them, and the real logo reads as more deliberate than an emoji.

## 3. Root page

Remove the DEX Aggregator card and its `handleDexNotionClick` handler from
`App.tsx`; the Projects grid goes from 9 cards to 8. The now-unused
`project-card--aggregator` rule is dropped from `App.css`.

## 4. X links

New `public/x-icon.svg` (monochrome X logo, same treatment as the existing
telegram/notion icons).

- `Footer.tsx`: X button after Telegram
- `Profile.tsx`: X in the header badge row, beside LinkedIn and Quant
- `Offcanvas.tsx`: X under Social
- `About.tsx`: X in the contact grid

## 5. Profile — CV sync

- Kronon Labs: `Apr 2025 — Present` → `Apr 2025 — Nov 2025 (8 months)`.
  The Quant page already shows it as ended, so the two pages currently disagree.
- Mantle: expand to the herald pipeline, the 5 documents, the campus tour and the
  hackathon funnel; link to `/devrel`
- Orakle: split the roles — VP (8th cohort) Mar 2026–present, ODA team lead
  (7th cohort) Sep 2025–Feb 2026; link the five published papers
- **New Awards section**: Mantle Global Hackathon 2025 1st place (Feb 2026),
  Seoulana Hackathon 2025 3rd place (Apr 2025). Neither is on the site today.
- Education: add `Mar 2014 — Aug 2022`
- Portfolio: add a DevRel page card

## 6. About

- Introduction: a paragraph on the current DevRel role, linking `/devrel`
- Contact grid: add X
- **Tech Stack section is left alone.** It documents what this website is built
  with, so replacing it with the CV's Rust/Go stack would make it wrong.

## Found while implementing

Three problems surfaced during the work that were not in the original scope:

- **The Mantle logo on the root page was never the Mantle logo.** The DOOR
  Protocol card hotlinked `avatars.githubusercontent.com/u/108515324`, which
  belongs to a personal account (`oscarr77`) with no avatar set, so GitHub was
  serving a default identicon under the label "Mantle". Replaced with the real
  organisation avatar (`mantlenetworkio`, id `110459454`), committed locally as
  `public/mantle-icon.png`. Both cards now use it and neither depends on a
  remote host.

- **`public/devrel/` shadowed the `/devrel` route in the dev server.** The
  static middleware claimed the path and 301'd it to `/devrel/`, so entering the
  page directly failed. Fixed in `webpack.config.js` with
  `output.publicPath: '/'` plus `serveIndex: false` and
  `staticOptions: { redirect: false }` on `devServer.static`. Production was
  never affected — `webpack.config.prod.js` already sets a publicPath, and the
  Go asset registry only keys the individual photo paths, not `/devrel`.

- **Gallery tiles cropped the photos badly.** A fixed 140px height against 4:3
  sources cut roughly 30% off the top and bottom, which is the part of the frame
  the photo exists to show. Replaced the fixed heights with
  `aspect-ratio: 4 / 3`.

## Verification

`yarn workspace blog-frontend build` (tsc + vite) and
`yarn workspace blog-frontend webpack-build-prod` must both pass, and the
`/devrel` route must render with photos in a local `webpack-server` run.
