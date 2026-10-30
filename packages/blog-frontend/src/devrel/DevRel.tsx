import { type Component, type JSX } from 'solid-js';
import { For } from 'solid-js';
// images
import HeroWorkshop from '@public/devrel/hero-workshop.webp';
import OnboardingLiveBuild from '@public/devrel/onboarding-livebuild.webp';
import OnboardingSession from '@public/devrel/onboarding-session.webp';
import HackerhouseWorkshop from '@public/devrel/hackerhouse-workshop.webp';
import HackerhouseSession from '@public/devrel/hackerhouse-session.webp';
import Mogakko from '@public/devrel/mogakko.webp';
import Q402Group from '@public/devrel/q402-group.webp';
import Q402Keynote from '@public/devrel/q402-keynote.webp';
import Q402Session from '@public/devrel/q402-session.webp';
import Q402Graph from '@public/devrel/q402-graph.webp';
import InhaLecture from '@public/devrel/inha-lecture.webp';
import InhaLab from '@public/devrel/inha-lab.webp';
import CampusKoreaUniversity from '@public/devrel/campus-korea-university.webp';
import CampusInha from '@public/devrel/campus-inha.webp';
import CampusKwangwoon from '@public/devrel/campus-kwangwoon.webp';
import CampusEwha from '@public/devrel/campus-ewha.webp';
import CampusKaist from '@public/devrel/campus-kaist.webp';
import CampusSkku from '@public/devrel/campus-skku.webp';
import CampusAjou from '@public/devrel/campus-ajou.webp';
// styles
import './DevRel.css';

/**
 * DevRel Page Component
 * Developer relations work for the Korean market at Mantle
 * Light background with dark cards, blue accent matching the header nav link
 *
 * Photos come from the @0xMantleKR official account and from @bcd_kyle; every
 * figure links back to its source post.
 */

const DOCS_HUB =
  'https://kyle-park.notion.site/Docs-3675e2b105168061b410fdf801eeaac8';
const ACCOUNT_KR = 'https://x.com/0xMantleKR';
const ACCOUNT_ME = 'https://x.com/bcd_kyle';

const POST_SEOUL_WORKSHOP =
  'https://x.com/0xMantleKR/status/2067909890698617223';
const POST_HACKER_HOUSE = 'https://x.com/0xMantleKR/status/2060567487981519320';
const POST_MOGAKKO = 'https://x.com/0xMantleKR/status/2055620699696582677';

const POST_Q402_RECAP = 'https://x.com/bcd_kyle/status/2095089810738401789';
const POST_Q402_NUMBERS = 'https://x.com/bcd_kyle/status/2095089815951942054';
const POST_INHA_RECAP = 'https://x.com/bcd_kyle/status/2113676788199309380';
const INHA_SLIDES = 'https://pay-lab-inha.vercel.app/slides';
const POST_LIVESTREAM_JULY =
  'https://x.com/0xMantleKR/status/2082436272082321740';
const POST_LIVESTREAM_AUG =
  'https://x.com/0xMantleKR/status/2088218155865026872';
const POST_LIVESTREAM_SEP =
  'https://x.com/0xMantleKR/status/2101989280667386179';
const POST_RFQ_ARTICLE = 'https://x.com/bcd_kyle/status/2086720804331667583';

interface Figure {
  src: string;
  caption: string;
  source: string;
}

const onboardingPhotos: Figure[] = [
  {
    src: OnboardingLiveBuild,
    caption: 'Live build session at the Seoul AI Hacker House',
    source: POST_HACKER_HOUSE,
  },
  {
    src: OnboardingSession,
    caption: 'Mantle Seoul workshop — ecosystem and AI infrastructure strategy',
    source: POST_SEOUL_WORKSHOP,
  },
];

const hackathonPhotos: Figure[] = [
  {
    src: HackerhouseWorkshop,
    caption: 'Hackathon workshop — building on Mantle with AI skills',
    source: POST_HACKER_HOUSE,
  },
  {
    src: HackerhouseSession,
    caption: 'Hacker house session — From BitDAO to The Liquidity Chain',
    source: POST_HACKER_HOUSE,
  },
  {
    src: Mogakko,
    caption: 'AI Awakening offline co-working — hackathon onboarding',
    source: POST_MOGAKKO,
  },
];

const q402Photos: Figure[] = [
  {
    src: Q402Keynote,
    caption: 'Opening keynote — why agent payments run on Mantle',
    source: POST_Q402_RECAP,
  },
  {
    src: Q402Session,
    caption: 'Sending USDC from a wallet holding zero MNT for gas',
    source: POST_Q402_RECAP,
  },
  {
    src: Q402Group,
    caption: 'Q402 builder workshop at Hashed Lounge, Seoul',
    source: POST_Q402_RECAP,
  },
  {
    src: Q402Graph,
    caption:
      'The room’s payment graph, read live off Mantle mainnet on the site built for the night',
    source: POST_Q402_NUMBERS,
  },
];

const inhaPhotos: Figure[] = [
  {
    src: InhaLecture,
    caption: 'Stablecoin payments class at Inha University',
    source: POST_INHA_RECAP,
  },
  {
    src: InhaLab,
    caption:
      'Walking the room through Lab 1, sending testnet USDC to a classmate',
    source: POST_INHA_RECAP,
  },
];

const campusTour: Figure[] = [
  {
    src: CampusKoreaUniversity,
    caption: 'Korea University',
    source: 'https://x.com/0xMantleKR/status/2054101544195481862',
  },
  {
    src: CampusInha,
    caption: 'Inha University',
    source: 'https://x.com/0xMantleKR/status/2054101645731279162',
  },
  {
    src: CampusKwangwoon,
    caption: 'Kwangwoon University',
    source: 'https://x.com/0xMantleKR/status/2054486932810612853',
  },
  {
    src: CampusEwha,
    caption: 'Ewha Womans University',
    source: 'https://x.com/0xMantleKR/status/2056978302527787179',
  },
  {
    src: CampusKaist,
    caption: 'KAIST',
    source: 'https://x.com/0xMantleKR/status/2059152629012566327',
  },
  {
    src: CampusSkku,
    caption: 'Sungkyunkwan University',
    source: 'https://x.com/0xMantleKR/status/2059469740867977699',
  },
  {
    src: CampusAjou,
    caption: 'Ajou University',
    source: 'https://x.com/0xMantleKR/status/2060285071681306841',
  },
];

interface Metric {
  value: string;
  label: string;
  note: string;
}

const metrics: Metric[] = [
  { value: '16', label: 'Modules', note: 'Content ops pipeline, shipped' },
  {
    value: '5',
    label: 'Documents',
    note: 'Korean technical docs',
  },
  { value: '7', label: 'Universities', note: 'Campus tour, three weeks' },
  {
    value: '488',
    label: 'Payments',
    note: 'Q402 workshop, three hours on-chain',
  },
  { value: '42', label: 'Builders', note: 'Each running their own agent' },
  {
    value: '18.0K',
    label: 'Peak Reach',
    note: 'August Korean livestream post',
  },
  {
    value: '279',
    label: 'Posts',
    note: 'Korean official account, Apr-Sep 2026',
  },
  { value: '246K', label: 'Impressions', note: 'Across the same period' },
  {
    value: '1.74%',
    label: 'Engagement',
    note: "1.7× the global account's 1.03%",
  },
];

const DevRel: Component = (): JSX.Element => {
  return (
    <div class="devrel-page">
      <div class="devrel-container">
        {/* Hero */}
        <header class="devrel-hero">
          <a
            href={POST_SEOUL_WORKSHOP}
            target="_blank"
            rel="noopener noreferrer"
            class="devrel-hero__photo-link"
          >
            <img
              src={HeroWorkshop}
              alt="Mantle Seoul workshop, a full room of builders"
              class="devrel-hero__photo"
            />
          </a>
          <div class="devrel-hero__text">
            <span class="devrel-hero__label">Mantle</span>
            <h1 class="devrel-hero__title">Developer Relations</h1>
            <p class="devrel-hero__desc">
              Korean market developer outreach — content operations, technical
              documentation, onboarding curriculum, hackathon builder funnel,
              builder workshops, and the Korean official account.
            </p>
            <span class="devrel-hero__period">Apr 2026 — Oct 2026</span>
          </div>
        </header>

        {/* Overview Section */}
        <section class="devrel-section">
          <h2 class="devrel-section__title">Overview</h2>
          <div class="devrel-section__content">
            <p>
              I joined Mantle as a Developer Relations Engineer for the Korean
              market, coming from a background in trading systems and blockchain
              infrastructure. That engineering background shapes how I work: the
              tooling the Korea team ran on was something I built, not something
              I requested.
            </p>
            <p>
              The work split into what I shipped and what I ran. Shipped: a
              content operations pipeline for the Korea team, the Korean
              technical documentation set, and the live operations site behind
              the Q402 builder workshop. Ran: developer onboarding, the Korea
              builder funnel for the flagship hackathon, a campus tour, a
              stablecoin payments class at Inha University, the monthly Korean
              livestream, and the Korean official account.
            </p>
          </div>
        </section>

        {/* Impact Section */}
        <section class="devrel-section">
          <h2 class="devrel-section__title">Impact</h2>
          <div class="devrel-section__content">
            <div class="devrel-metrics">
              <For each={metrics}>
                {(metric) => (
                  <div class="devrel-metric">
                    <span class="devrel-metric__value">{metric.value}</span>
                    <span class="devrel-metric__label">{metric.label}</span>
                    <span class="devrel-metric__note">{metric.note}</span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </section>

        {/* Work Section */}
        <section class="devrel-section">
          <h2 class="devrel-section__title">Work</h2>
          <div class="devrel-section__content">
            {/* Content Operations Pipeline */}
            <div class="devrel-work">
              <div class="devrel-work__header">
                <h3 class="devrel-work__title">mantle-kr-herald</h3>
                <span class="devrel-work__tag">Content Operations</span>
              </div>
              <p class="devrel-work__desc">
                Designed and implemented the Korea team's content operations
                pipeline and deployed it to the team. It collects from X and
                Lark, translates to Korean, converts per channel, routes through
                two-stage human review, and delivers to Telegram, X, and pull
                requests.
              </p>
              <ul class="devrel-work__list">
                <li>
                  <strong>Agent-in-the-loop translation</strong>: a local coding
                  agent fills a purpose-built worksheet and a human approves it.
                  Only translation pairs a human approved on the two official
                  accounts become few-shot examples for the next translation,
                  and glossary candidates pass a tuned rejection threshold
                  before going to human review. The 178-term glossary feeds the
                  translation prompt and a term check
                </li>
                <li>
                  <strong>Hexagonal structure and the PostgreSQL move</strong>:
                  external APIs, files, and storage sit behind ports. Over the
                  99 commits that moved the record store from files to
                  PostgreSQL and shipped it serverless on Vercel, no existing
                  domain file changed; the move added 19 adapters and swapped
                  the entry points
                </li>
                <li>
                  A unique index closes the double-publish hazard that appears
                  when serverless drops the file lock
                </li>
              </ul>
              <div class="devrel-work__meta">
                <span class="devrel-work__meta-label">Scale:</span>
                <span class="devrel-work__meta-value">
                  16 modules, 1,051 commits from July to October 2026
                </span>
              </div>
              <div class="devrel-work__meta">
                <span class="devrel-work__meta-label">Output:</span>
                <span class="devrel-work__meta-value">
                  From July to October 2026: 446 X posts collected, 162
                  translations, 106 of them approved by reviewers, and 837
                  channel versions
                </span>
              </div>
              <div class="devrel-work__meta">
                <span class="devrel-work__meta-label">Tests:</span>
                <span class="devrel-work__meta-value">
                  400 test files and 5,115 test cases. Storage adapters are
                  tested against Postgres running in PGlite, not a mock
                </span>
              </div>
              <div class="devrel-work__meta">
                <span class="devrel-work__meta-label">Stack:</span>
                <span class="devrel-work__meta-value">
                  TypeScript, PostgreSQL, Vercel, Vitest
                </span>
              </div>
              <div class="devrel-work__meta">
                <span class="devrel-work__meta-label">Source:</span>
                <span class="devrel-work__meta-value">
                  Private repository — available on request
                </span>
              </div>
            </div>

            {/* Korean Technical Documentation */}
            <div class="devrel-work">
              <div class="devrel-work__header">
                <h3 class="devrel-work__title">Korean Technical Docs</h3>
                <span class="devrel-work__tag">5 Documents</span>
              </div>
              <p class="devrel-work__desc">
                Wrote the Korean technical documentation set: the Mantle block
                explorer in beginner and deep-dive editions, a DEX comparative
                deep dive, an AI agent trading path guide, and an
                asset-withdrawal guide.
              </p>
              <ul class="devrel-work__list">
                <li>
                  The deep-dive edition covers modular architecture, Rollup vs.
                  Validium classification, L2's dual gas structure, and why
                  Mantle sits at L2Beat Stage 0
                </li>
              </ul>
              <a
                href={DOCS_HUB}
                target="_blank"
                rel="noopener noreferrer"
                class="devrel-work__link"
              >
                Read the docs hub →
              </a>
            </div>

            {/* Onboarding Curriculum */}
            <div class="devrel-work">
              <div class="devrel-work__header">
                <h3 class="devrel-work__title">Onboarding Curriculum</h3>
                <span class="devrel-work__tag">Hands-on</span>
              </div>
              <p class="devrel-work__desc">
                Designed and delivered a hands-on technical onboarding
                curriculum: Mantle infra setup, Bybit API, Byreal Skills CLI,
                MerchantMoe / Agni / Fluxion integrations, testnet contract
                deployment labs, and a stablecoin pair-trading bot built live in
                front of the room.
              </p>
              <div class="devrel-gallery devrel-gallery--wide">
                <For each={onboardingPhotos}>
                  {(photo) => (
                    <figure class="devrel-figure">
                      <a
                        href={photo.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          loading="lazy"
                          class="devrel-figure__img"
                        />
                      </a>
                      <figcaption class="devrel-figure__caption">
                        {photo.caption}
                      </figcaption>
                    </figure>
                  )}
                </For>
              </div>
            </div>

            {/* Turing Test Hackathon */}
            <div class="devrel-work">
              <div class="devrel-work__header">
                <h3 class="devrel-work__title">The Turing Test Hackathon</h3>
                <span class="devrel-work__tag">$120K · 2026</span>
              </div>
              <p class="devrel-work__desc">
                Owned Korea builder onboarding for the flagship two-phase global
                program, building the Korean builder funnel across the full
                six-week registration-to-submission window of Phase 2.
              </p>
              <ul class="devrel-work__list">
                <li>An offline co-working session for hackathon onboarding</li>
                <li>The Seoul hacker house workshop, 100+ builders</li>
                <li>A live online workshop</li>
                <li>3 external partner events</li>
                <li>
                  In Mantle's official count, South Korea ranked seventh by
                  country share at 4.3%
                </li>
              </ul>
              <div class="devrel-gallery">
                <For each={hackathonPhotos}>
                  {(photo) => (
                    <figure class="devrel-figure">
                      <a
                        href={photo.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          loading="lazy"
                          class="devrel-figure__img"
                        />
                      </a>
                      <figcaption class="devrel-figure__caption">
                        {photo.caption}
                      </figcaption>
                    </figure>
                  )}
                </For>
              </div>
            </div>

            {/* Q402 Builder Workshop */}
            <div class="devrel-work">
              <div class="devrel-work__header">
                <h3 class="devrel-work__title">Q402 Builder Workshop</h3>
                <span class="devrel-work__tag">
                  Mantle × Quack AI · Aug 2026
                </span>
              </div>
              <p class="devrel-work__desc">
                Ran the Seoul builder workshop on agent payments at Hashed
                Lounge, where 42 builders each connected Q402 to their own AI
                agent over MCP and paid on Mantle mainnet from the chat window —
                no wallet app, no signing prompt, and no MNT for gas.
              </p>
              <ul class="devrel-work__list">
                <li>
                  <strong>488 on-chain payments in three hours</strong> — 69 at
                  the opening, 488 by close — across 257 payer-payee pairs and
                  60 one-to-three batch settlements
                </li>
                <li>
                  Built the night's operations site as the first version of
                  pay-lab: wallet registration, the live leaderboard, quest
                  verification, a QR payment bridge for phone-only attendees,
                  and the staff console.{' '}
                  <strong>
                    Every badge and quest was judged by reading the chain
                  </strong>
                  , not by a form someone ticked
                </li>
                <li>
                  Three lanes so the room could self-sort — Mobile for phones,
                  Agent for laptops, Finance for a worksheet aimed at
                  institutional attendees
                </li>
                <li>
                  Co-hosted with Quack AI, alongside Orakle KAIST and BlueNode
                </li>
              </ul>
              <div class="devrel-work__meta">
                <span class="devrel-work__meta-label">Stack:</span>
                <span class="devrel-work__meta-value">
                  Next.js 16, PostgreSQL, Vercel, Q402 MCP
                </span>
              </div>
              <div class="devrel-gallery devrel-gallery--q402">
                <For each={q402Photos}>
                  {(photo) => (
                    <figure class="devrel-figure">
                      <a
                        href={photo.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          loading="lazy"
                          class="devrel-figure__img"
                        />
                      </a>
                      <figcaption class="devrel-figure__caption">
                        {photo.caption}
                      </figcaption>
                    </figure>
                  )}
                </For>
              </div>
              <a
                href={POST_Q402_RECAP}
                target="_blank"
                rel="noopener noreferrer"
                class="devrel-work__link"
              >
                Read the recap →
              </a>
            </div>

            {/* Inha University Lecture */}
            <div class="devrel-work">
              <div class="devrel-work__header">
                <h3 class="devrel-work__title">Inha University Lecture</h3>
                <span class="devrel-work__tag">
                  Stablecoin Payments · Oct 2026
                </span>
              </div>
              <p class="devrel-work__desc">
                Taught a session of Inha University's Digital Assets and Market
                Infrastructure course for finance students, on how stablecoin
                payments move and what changes when an AI agent pays. The class
                met while Korea was still writing its rules. On the day, there
                was no law under which a won stablecoin could be issued, nine
                bills sat in the National Assembly's subcommittee, and the
                government's own bill, first promised for 2025, had slipped five
                times.
              </p>
              <ul class="devrel-work__list">
                <li>
                  Opened on what the room already used rather than on crypto:
                  the won price of USDT on Upbit, Upbit's GIWA chain and Toss's
                  won-stablecoin trial on the OP Stack, and the three ways a
                  stablecoin reaches people who never hold one, through their
                  bank app, their deposits and loans, and AI agents that pay
                </li>
                <li>
                  Students then moved money themselves. They made a wallet on
                  their phones, sent testnet USDC to a classmate and read the
                  receipt on a block explorer, then set that arrival against a
                  card payment, a bank transfer that banks settle the next day,
                  and a SWIFT wire
                </li>
                <li>
                  Delegation came next. Students signed a spending limit for an
                  AI agent in claude.ai or Codex, watched a request past the
                  limit get refused by both the lab server and the USDC
                  contract, and reset the limit themselves
                </li>
                <li>
                  Closed on the Korean bills issue by issue, read against the
                  USDC the class had just sent: who may issue, what reserves
                  must back it and how redemption is guaranteed, whether holders
                  may earn interest, and where the Bank of Korea and the
                  Financial Services Commission stand
                </li>
                <li>
                  Ran on pay-lab, the payments lab kit that began as the Q402
                  workshop site and now picks its chain, gas sponsorship, and
                  limits from one config per event. The class ran on Ethereum
                  Sepolia and Circle's testnet USDC so it would look at the
                  structure rather than one chain's name. The lab server paid
                  the gas, and the deck is public on the lab site
                </li>
              </ul>
              <div class="devrel-work__meta">
                <span class="devrel-work__meta-label">Stack:</span>
                <span class="devrel-work__meta-value">
                  Next.js 16, PostgreSQL, Privy, viem, MCP, Vercel
                </span>
              </div>
              <div class="devrel-gallery devrel-gallery--wide">
                <For each={inhaPhotos}>
                  {(photo) => (
                    <figure class="devrel-figure">
                      <a
                        href={photo.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          loading="lazy"
                          class="devrel-figure__img"
                        />
                      </a>
                      <figcaption class="devrel-figure__caption">
                        {photo.caption}
                      </figcaption>
                    </figure>
                  )}
                </For>
              </div>
              <div class="devrel-work__links">
                <a
                  href={POST_INHA_RECAP}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="devrel-work__link"
                >
                  Read the recap →
                </a>
                <a
                  href={INHA_SLIDES}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="devrel-work__link"
                >
                  Slides (Korean) →
                </a>
              </div>
            </div>

            {/* Korean Livestream */}
            <div class="devrel-work">
              <div class="devrel-work__header">
                <h3 class="devrel-work__title">Korean Livestream</h3>
                <span class="devrel-work__tag">Monthly · Co-host</span>
              </div>
              <p class="devrel-work__desc">
                Co-hosted the monthly Korean livestream on the official account
                and presented its technical session each month. July carried
                Mantle's third anniversary, August ran as a Mantle × Stable
                collaboration with Stable's CEO as guest, and September came
                ahead of KBW.
              </p>
              <ul class="devrel-work__list">
                <li>
                  July's RFQ session compared traditional and on-chain RFQ and
                  set AMM, on-chain CLOB, RFQ, and intent execution side by side
                </li>
                <li>
                  August's bridge session covered Lock & Mint against Burn &
                  Mint and the different bridge routes Mantle's assets take: the
                  canonical bridge, LayerZero OFT, and Chainlink CCIP
                </li>
                <li>
                  September's RPC workshop compared seven Mantle RPC providers
                  and priced three of them per month from the request counts of
                  a vault app, a trading screen, bots, and an indexer
                </li>
                <li>
                  The August live post reached <strong>18.0K</strong>, the
                  second-highest-reach post on the account over Apr-Sep 2026,
                  behind only the World Cup campaign
                </li>
                <li>
                  Wrote the July RFQ session up as a standalone Korean article
                  on how institutional request-for-quote execution carries over
                  on-chain
                </li>
              </ul>
              <div class="devrel-work__links">
                <a
                  href={POST_LIVESTREAM_SEP}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="devrel-work__link"
                >
                  September livestream →
                </a>
                <a
                  href={POST_LIVESTREAM_AUG}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="devrel-work__link"
                >
                  August livestream →
                </a>
                <a
                  href={POST_LIVESTREAM_JULY}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="devrel-work__link"
                >
                  July livestream →
                </a>
                <a
                  href={POST_RFQ_ARTICLE}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="devrel-work__link"
                >
                  RFQ write-up →
                </a>
              </div>
            </div>

            {/* Campus Tour */}
            <div class="devrel-work">
              <div class="devrel-work__header">
                <h3 class="devrel-work__title">Campus Tour</h3>
                <span class="devrel-work__tag">7 Universities · 3 Weeks</span>
              </div>
              <p class="devrel-work__desc">
                Presented Mantle's builder programs and hackathon tracks at
                seven university blockchain clubs over three weeks in May 2026,
                with a Mantle testnet contract deployment lab at Sungkyunkwan
                and a live build of a stablecoin pair-trading bot at Ewha. The
                Korea University, Ewha, Sungkyunkwan, and KAIST clubs posted
                session recaps on their X accounts. In the campus research
                contest introduced on the tour, a Sungkyunkwan club member won
                the grand prize and the Kwangwoon club won the
                most-participating-club award.
              </p>
              <div class="devrel-gallery devrel-gallery--campus">
                <For each={campusTour}>
                  {(photo) => (
                    <figure class="devrel-figure">
                      <a
                        href={photo.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={photo.src}
                          alt={`Campus tour session at ${photo.caption}`}
                          loading="lazy"
                          class="devrel-figure__img"
                        />
                      </a>
                      <figcaption class="devrel-figure__caption">
                        {photo.caption}
                      </figcaption>
                    </figure>
                  )}
                </For>
              </div>
            </div>

            {/* Official Account */}
            <div class="devrel-work">
              <div class="devrel-work__header">
                <h3 class="devrel-work__title">Korean Official Account</h3>
                <span class="devrel-work__tag">@0xMantleKR</span>
              </div>
              <p class="devrel-work__desc">
                Run the Korean official account. Over Apr-Sep 2026 that came to
                279 posts and 246K impressions at a 1.74% engagement rate, 1.7×
                the global account's 1.03%, with Korea-originated campaigns and
                event announcements taking all six highest-reach slots.
              </p>
              <a
                href={ACCOUNT_KR}
                target="_blank"
                rel="noopener noreferrer"
                class="devrel-work__link"
              >
                Visit @0xMantleKR →
              </a>
            </div>
          </div>
        </section>

        {/* Photo credit */}
        <p class="devrel-credit">
          Event photos from the{' '}
          <a href={ACCOUNT_KR} target="_blank" rel="noopener noreferrer">
            @0xMantleKR
          </a>{' '}
          official account and from{' '}
          <a href={ACCOUNT_ME} target="_blank" rel="noopener noreferrer">
            @bcd_kyle
          </a>
          . Every photo links to its original post.
        </p>

        {/* Links Section */}
        <section class="devrel-section devrel-section--cta">
          <h2 class="devrel-section__title">More Details</h2>
          <div class="devrel-section__content">
            <p>
              The documentation set is public. For day-to-day work, the accounts
              below are the closest thing to a running log.
            </p>
            <div class="devrel-cta__links">
              <a
                href={DOCS_HUB}
                target="_blank"
                rel="noopener noreferrer"
                class="devrel-cta__link devrel-cta__link--primary"
              >
                <span>Docs Hub</span>
                <span class="devrel-cta__arrow">→</span>
              </a>
              <a
                href={ACCOUNT_ME}
                target="_blank"
                rel="noopener noreferrer"
                class="devrel-cta__link"
              >
                <span>@bcd_kyle</span>
                <span class="devrel-cta__arrow">→</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DevRel;
