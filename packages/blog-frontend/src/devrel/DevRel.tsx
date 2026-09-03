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
 * Developer relations work for the Korean market at Mantle Network
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
const POST_LIVESTREAM_JULY =
  'https://x.com/0xMantleKR/status/2082436272082321740';
const POST_LIVESTREAM_AUG =
  'https://x.com/0xMantleKR/status/2088218155865026872';
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
  { value: '14', label: 'Modules', note: 'Content ops pipeline, shipped' },
  { value: '5', label: 'Documents', note: 'Korean technical docs, sole author' },
  { value: '7', label: 'Universities', note: 'Campus tour, sole speaker' },
  {
    value: '488',
    label: 'Payments',
    note: 'Q402 workshop, three hours on-chain',
  },
  { value: '42', label: 'Builders', note: 'Each running their own agent' },
  { value: '17.4K', label: 'Peak Reach', note: 'August Korean livestream post' },
  {
    value: '221',
    label: 'Posts',
    note: 'Korean official account, Apr–Jul 2026',
  },
  { value: '175K', label: 'Impressions', note: 'Across the same period' },
  {
    value: '1.84%',
    label: 'Engagement',
    note: "1.4× the global account's 1.28%",
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
            <span class="devrel-hero__label">Mantle Network</span>
            <h1 class="devrel-hero__title">Developer Relations</h1>
            <p class="devrel-hero__desc">
              Korean market developer outreach — content operations, technical
              documentation, onboarding curriculum, hackathon builder funnel,
              builder workshops, and the Korean official account.
            </p>
            <span class="devrel-hero__period">Apr 2026 — Present</span>
          </div>
        </header>

        {/* Overview Section */}
        <section class="devrel-section">
          <h2 class="devrel-section__title">Overview</h2>
          <div class="devrel-section__content">
            <p>
              I joined Mantle Network as a Developer Relations Engineer for the
              Korean market, coming from a background in trading systems and
              blockchain infrastructure. That engineering background shapes how
              I work: the tooling the Korea team runs on is something I build,
              not something I request.
            </p>
            <p>
              The work splits into what I ship and what I run. Shipped: a
              content operations pipeline the team uses daily, the Korean
              technical documentation set, and the live operations site behind
              the Q402 builder workshop. Run: developer onboarding, the Korea
              builder funnel for the flagship hackathon, a campus tour, the
              monthly Korean livestream, and the Korean official account.
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
                Sole designer and implementer of the Korea team's content
                operations pipeline, deployed to the team. It collects from X
                and Lark, translates to Korean, converts per channel, routes
                through two-stage human review, and delivers to Telegram, X, and
                pull requests.
              </p>
              <ul class="devrel-work__list">
                <li>
                  Translation and conversion run{' '}
                  <strong>agent-in-the-loop</strong> — a local coding agent
                  fills a purpose-built worksheet and a human approves the
                  result, behind two mandatory approval gates
                </li>
                <li>
                  Migrated the record of truth from files to{' '}
                  <strong>PostgreSQL</strong> and shipped it serverless on
                  Vercel, so reviewers approve and publish from a browser.
                  Persistence sits behind a port in a hexagonal structure, so
                  swapping the store stayed at the adapter level
                </li>
                <li>
                  File-lock serialization does not survive serverless, so a
                  dropped ledger row could republish a live post twice — a
                  unique index closes that hazard
                </li>
                <li>
                  A <strong>translation memory</strong> mines both official
                  accounts and feeds only human-approved EN↔KO pairs into the
                  few-shot set
                </li>
              </ul>
              <div class="devrel-work__meta">
                <span class="devrel-work__meta-label">Scale:</span>
                <span class="devrel-work__meta-value">
                  14 modules · 276 source files · 209 test files
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
                Sole author of the Korean technical documentation set: the
                Mantle block explorer in beginner and deep-dive editions, a DEX
                comparative deep dive, an AI agent trading path guide, and an
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
                <span class="devrel-work__tag">Mantle × Quack AI · Aug 2026</span>
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
                  the opening, 488 by close — across 257 payer-payee pairs and 60
                  one-to-three batch settlements
                </li>
                <li>
                  Built the night's operations site myself: wallet registration,
                  the live leaderboard, quest verification, a QR payment bridge
                  for phone-only attendees, and the staff console.{' '}
                  <strong>Every badge and quest was judged by reading the
                  chain</strong>, not by a form someone ticked
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

            {/* Korean Livestream */}
            <div class="devrel-work">
              <div class="devrel-work__header">
                <h3 class="devrel-work__title">Korean Livestream</h3>
                <span class="devrel-work__tag">Monthly · Co-host</span>
              </div>
              <p class="devrel-work__desc">
                Co-host the monthly Korean livestream on the official account.
                July carried Mantle's third anniversary — ecosystem updates, an
                RFQ session, and community creator interviews. August ran as a
                Mantle × Stable collaboration with Stable's CEO as guest,
                covering the USDT0 stablecoin ecosystem and Chainlink CCIP
                bridging.
              </p>
              <ul class="devrel-work__list">
                <li>
                  The August live post reached <strong>17.4K</strong> — the
                  second-highest-reach post on the account across the period,
                  behind only the World Cup campaign
                </li>
                <li>
                  Wrote the July RFQ session up as a standalone Korean article on
                  how institutional request-for-quote execution carries over
                  on-chain
                </li>
              </ul>
              <div class="devrel-work__links">
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
                Ran a seven-university blockchain-club campus tour as the sole
                speaker, completed in three weeks. Four clubs published their
                own session recaps unprompted, and one-off visits turned into
                standing partnerships.
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
                Run the Korean official account. Over the first four months,
                Apr–Jul 2026, that came to 221 posts and 175K impressions at a
                1.84% engagement rate — 1.4× the global account's 1.28% — with
                Korea-originated campaigns and event announcements taking all
                six highest-reach slots.
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
              The documentation set is public. For day-to-day work, the
              accounts below are the closest thing to a running log.
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
