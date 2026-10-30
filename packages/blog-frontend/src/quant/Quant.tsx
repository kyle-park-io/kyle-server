import { type Component, type JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
// styles
import './Quant.css';

/**
 * Quant Page Component
 * Showcases quantitative trading experience and projects
 * Dark theme with accent colors for a professional finance aesthetic
 */
const Quant: Component = (): JSX.Element => {
  const navigate = useNavigate();

  const handlePersonalQuantClick = (): void => {
    navigate('/personal-quant');
  };

  return (
    <div class="quant-page">
      {/* Main Content */}
      <div class="quant-container">
        {/* Personal Quant Banner */}
        <button onClick={handlePersonalQuantClick} class="quant-banner">
          <div class="quant-banner__content">
            <span class="quant-banner__icon">🔥</span>
            <div class="quant-banner__text">
              <h3 class="quant-banner__title">Personal Quant Projects</h3>
              <p class="quant-banner__desc">
                View individual trading strategies and quantitative analysis
              </p>
            </div>
            <span class="quant-banner__arrow">→</span>
          </div>
        </button>

        {/* Overview Section */}
        <section class="quant-section">
          <h2 class="quant-section__title">Overview</h2>
          <div class="quant-section__content">
            <p>
              From April to November 2025 I worked at Kronon Labs as a trading
              system backend engineer. With the team I built the Go systems
              behind its cross-exchange arbitrage, Solana on-chain trading,
              news-driven futures trading, and listing sniping. My own code
              covers exchange connectivity, PnL and delta management, the Solana
              trading bots, and the market data collectors. The last three cards
              are team systems that predate my joining.
            </p>
          </div>
        </section>

        {/* Experience Section */}
        <section class="quant-section">
          <h2 class="quant-section__title">Experience</h2>
          <div class="quant-section__content">
            <div class="quant-experience">
              <div class="quant-experience__item">
                <div class="quant-experience__header">
                  <h3 class="quant-experience__company">
                    Kronon Labs Co., Ltd.
                  </h3>
                  <span class="quant-experience__period">
                    2025.04 - 2025.11
                  </span>
                </div>
                <p class="quant-experience__role">
                  Trading System Backend Engineer
                </p>

                <div class="quant-experience__divider"></div>

                {/* Rothchild arbitrage */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    CEX Cross-Exchange Arbitrage System (Rothchild)
                  </h4>
                  <p class="quant-experience__project-desc">
                    A Taker-Taker and Maker-Taker arbitrage system built with
                    the team. Its Go strategy engine, generated from templates
                    into an entity-component-system layout, trades spreads
                    across Binance, Bybit, Bitget, KuCoin, MEXC, Gate.io, and
                    Bithumb spot markets, Bybit against Jupiter, Bithumb and
                    Upbit KRW markets against Bybit, and the perpetual DEXs
                    Paradex, Backpack, Extended, and Rails. I built the
                    exchange-facing backend: order APIs and user-data WebSockets
                    for 8 exchanges including Gate.io, plus Solana DEX,
                    balances, PnL, a delta manager, and a dashboard tracking PnL
                    and positions in real time. The team added cross-exchange
                    withdrawals and an auto-balancer. Gate.io was replaced by
                    Bithumb in September 2025.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      Binance, Bybit, Bitget, KuCoin, MEXC, Gate.io, Bithumb,
                      Upbit, Jupiter, Helius, Solscan, Paradex, Backpack,
                      Extended, Rails
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go (Fiber, Fx, GORM), Scala code generator, PostgreSQL,
                      AWS (ECS, ECR, Parameter Store, KMS), Docker
                    </span>
                  </div>
                </div>

                {/* Solana DEX */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    Solana DEX Trading Infrastructure
                  </h4>
                  <p class="quant-experience__project-desc">
                    On-chain trading bots in Go implementing three alpha
                    strategies (New Pair Detection, Back From The Dead, Fat LP
                    Analysis): new-pool and volume-spike detection from
                    CoinGecko Terminal across Solana, Ethereum, BSC, Base, and
                    Avalanche, GoPlus security and wallet and top-holder entry
                    filters, Jupiter swaps and trigger orders, a price cache
                    with 5-minute and 1-hour volatility, tiered sell rules, and
                    Helius WebSocket monitoring of Pump.fun, Raydium, Orca, and
                    Meteora pools.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      CoinGecko Terminal, GoPlus Security, Solscan, Helius,
                      QuickNode, Alchemy, Jupiter, Raydium, Saros
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go (Cobra, solana-go, GORM), PostgreSQL, Kafka and Redis
                      event publishers, AWS (EC2, Parameter Store), Slack,
                      Telegram
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    Trading Metrics Collection & Analytics
                  </h4>
                  <p class="quant-experience__project-desc">
                    An altcoin performance chart backend built with the team: a
                    Django API ranking the top 50 altcoins against BTC,
                    open-interest-to-market-cap ratios from Velo, and kline
                    changes stored in MongoDB. I built its Bybit 1-minute kline
                    WebSocket collector and kline API and added time ranges and
                    BTC change rates to the performance API, and designed a
                    batched metrics collector for strategy detectors.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">Bybit, Velo</span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go (Fx, GORM), Python (Django Ninja), PostgreSQL, MongoDB
                      (DocumentDB), Redis, Docker, AWS ECR
                    </span>
                  </div>
                </div>

                {/* News and KOL signals */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    News and KOL Signal Engine
                  </h4>
                  <p class="quant-experience__project-desc">
                    A news and KOL signal engine built with the team. It reads
                    private Telegram channels and X lists, scores each item with
                    several OpenAI assistants, and places Binance and Bybit USDT
                    futures orders with take-profit and stop-loss when the
                    average score clears the threshold. The team also tried a
                    Velo news feed and a Bybit candle-pattern detector (FMH). My
                    part covered the OpenAI assistant client, multi-assistant
                    scoring, the X listener, Bybit support, and the metrics
                    collector.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      OpenAI Assistants, twitterapi.io, Telegram, Velo News,
                      Binance, Bybit
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go (Fx, Zap, GORM), PostgreSQL, AWS (EC2, Parameter Store,
                      KMS)
                    </span>
                  </div>
                </div>

                {/* Listing */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    Exchange Listing Sniper
                  </h4>
                  <p class="quant-experience__project-desc">
                    A listing sniper built with the team. An analyzer polls
                    Upbit announcements through Smart Proxy and, together with a
                    listing feed, catches new symbols, then sends them over gRPC
                    to order servers in Tokyo and Singapore that place Binance
                    futures, MEXC, and Bybit orders sized in advance by a
                    separate service, with fill alerts in Slack.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      Upbit, newlistings.pro, Binance, MEXC, Bybit, Smart Proxy
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go (Fx, gRPC, GORM), PostgreSQL, AWS (Tokyo, Singapore),
                      Docker
                    </span>
                  </div>
                </div>

                {/* Totoro */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    Prediction Market Monitoring (Totoro)
                  </h4>
                  <p class="quant-experience__project-desc">
                    A monitoring module built with the team that pairs
                    Polymarket and Kalshi NFL and Premier League markets by
                    match and pulls their prices into the Rothchild console.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      Polymarket (CLOB, Gamma), Kalshi
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go (Fiber, Fx)
                    </span>
                  </div>
                </div>

                {/* Earlier listing detector */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    Earlier Listing Detector (et-listing-detector)
                  </h4>
                  <p class="quant-experience__project-desc">
                    The team's first listing system, built before I joined.
                    Detectors polled the Upbit and Bithumb announcement APIs
                    through Smart Proxy with a Chrome-like TLS fingerprint and
                    pushed each new KRW listing over a channel to an executor
                    that placed market orders on Binance futures, Bybit, MEXC,
                    and OKX spot, then set a trailing stop on Bybit and an OCO
                    take-profit and stop-loss on OKX. It ran on Kubernetes on
                    GCP in Seoul and Tokyo. In my first days I ran it in a dev
                    environment, reviewed the code with the team, and wrote up
                    seven improvements covering configuration, error handling,
                    logging, unit tests, locking, verifying strategies against
                    stored ticks, and coding conventions.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      Upbit, Bithumb, Binance Futures, Bybit, MEXC, OKX, Smart
                      Proxy, Slack
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go (GORM, uTLS), PostgreSQL, Docker, Kubernetes (GCP)
                    </span>
                  </div>
                </div>

                {/* alpha-cube */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    Bybit BTC Perpetual Bot (alpha-cube)
                  </h4>
                  <p class="quant-experience__project-desc">
                    A team bot built before I joined. A Python service on async
                    ccxt trades the Bybit BTC USDT perpetual at 4x leverage: on
                    each scheduled run it cancels its open orders and re-posts
                    post-only buys and a three-step take-profit ladder around
                    the break-even price, with a 3% target. Authorized users
                    start, stop, and check it from Telegram, and it runs on EC2
                    under systemd.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      Bybit (ccxt), Telegram, Slack
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Python (ccxt, python-telegram-bot, APScheduler, asyncpg),
                      PostgreSQL, AWS EC2
                    </span>
                  </div>
                </div>

                {/* onchain-system */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    Ethereum On-Chain Indexer (onchain-system)
                  </h4>
                  <p class="quant-experience__project-desc">
                    A team indexer started before I joined. A go-ethereum fork
                    hooks each new canonical head and loads accounts, contracts,
                    balances for 15 ERC-20 tokens, transactions, and headers
                    from the node's snapshot and databases into PostgreSQL. A
                    separate RPC-based ETL splits blocks and transactions into
                    block-range partitions across SSD and HDD tablespaces and
                    labels function selectors from 4byte.directory.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      Ethereum node (geth), 4byte.directory
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go (go-ethereum fork), PostgreSQL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section class="quant-section">
          <h2 class="quant-section__title">Technical Skills</h2>
          <div class="quant-section__content">
            <p>
              At Kronon Labs the trading backends, collectors, and strategy
              engines were written in Go, with Python (Django) for data APIs.
            </p>
            <div class="quant-skills__category">
              <span class="quant-skills__category-label">Languages</span>
              <div class="quant-skills__tags">
                <span class="quant-skills__tag">🦀 Rust</span>
                <span class="quant-skills__tag">🐹 Go</span>
                <span class="quant-skills__tag">🐍 Python</span>
                <span class="quant-skills__tag">📘 TypeScript</span>
              </div>
            </div>
            <div class="quant-skills__category">
              <span class="quant-skills__category-label">Frameworks</span>
              <div class="quant-skills__tags">
                <span class="quant-skills__tag">🦀 Axum</span>
                <span class="quant-skills__tag">🦀 Reqwest</span>
                <span class="quant-skills__tag">🦀 Hyper</span>
                <span class="quant-skills__tag">🐹 Fx</span>
                <span class="quant-skills__tag">🐍 Django</span>
                <span class="quant-skills__tag">📘 NestJS</span>
                <span class="quant-skills__tag">📘 Next.js</span>
              </div>
            </div>
            <div class="quant-skills__category">
              <span class="quant-skills__category-label">Infrastructure</span>
              <div class="quant-skills__tags">
                <span class="quant-skills__tag">☁️ AWS</span>
                <span class="quant-skills__tag">🐘 PostgreSQL</span>
                <span class="quant-skills__tag">🍃 MongoDB</span>
              </div>
            </div>
            <div class="quant-skills__grid">
              {/* Trading */}
              <div class="quant-skills__card">
                <div class="quant-skills__card-icon">📊</div>
                <h3 class="quant-skills__card-title">Trading</h3>
                <ul class="quant-skills__list">
                  <li>CEX / DEX Arbitrage</li>
                  <li>On-Chain Strategies</li>
                  <li>Listing Alert Trading</li>
                  <li>News and KOL Signal Trading</li>
                </ul>
              </div>

              {/* APIs */}
              <div class="quant-skills__card">
                <div class="quant-skills__card-icon">🔌</div>
                <h3 class="quant-skills__card-title">APIs</h3>
                <ul class="quant-skills__list">
                  <li>Binance, Bybit, Bitget, KuCoin</li>
                  <li>Upbit, Bithumb, MEXC, Gate.io, OKX</li>
                  <li>Jupiter, Raydium, Helius</li>
                  <li>OpenAI, Twitter API</li>
                </ul>
              </div>

              {/* Data & Analysis */}
              <div class="quant-skills__card">
                <div class="quant-skills__card-icon">📈</div>
                <h3 class="quant-skills__card-title">Data & Analysis</h3>
                <ul class="quant-skills__list">
                  <li>Kline / Candle Data</li>
                  <li>KRW Market Arbitrage</li>
                  <li>Volatility Analysis</li>
                  <li>LLM News Scoring</li>
                </ul>
              </div>

              {/* Infrastructure */}
              <div class="quant-skills__card">
                <div class="quant-skills__card-icon">⚡</div>
                <h3 class="quant-skills__card-title">Infrastructure</h3>
                <ul class="quant-skills__list">
                  <li>AWS</li>
                  <li>PostgreSQL / MongoDB</li>
                  <li>Real-time WebSocket</li>
                  <li>Smart Proxy</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section class="quant-section quant-section--cta">
          <h2 class="quant-section__title">More Details</h2>
          <div class="quant-section__content">
            <p>
              For more detailed information about my quantitative trading
              projects and strategies, please visit my dedicated portfolio site.
            </p>
            <div class="quant-cta__links">
              <a
                href="https://kyle-quant.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                class="quant-cta__link quant-cta__link--primary"
              >
                <span>Visit Quant Portfolio</span>
                <span class="quant-cta__arrow">→</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Quant;
