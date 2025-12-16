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
              As a Quantitative Developer, I have strong expertise across
              diverse trading environments including CEX, DEX, and on-chain
              strategies.
            </p>
            <p>
              My focus is on translating trading strategies into flawless code
              implementations, ensuring precision and reliability in production
              systems.
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
                  <h3 class="quant-experience__company">Kronon Labs Inc.</h3>
                  <span class="quant-experience__period">
                    2025.04 - 2025.11
                  </span>
                </div>
                <p class="quant-experience__role">Quantitative Developer</p>

                <div class="quant-experience__divider"></div>

                {/* Arbitrage Backend */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    Arbitrage Trading Backend
                  </h4>
                  <p class="quant-experience__project-desc">
                    Developed Taker-Taker and Maker-Taker arbitrage trading
                    backend systems. Built comprehensive arbitrage dashboard
                    backend utilizing REST API and WebSocket API across multiple
                    exchanges.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      Binance, Bybit, Bitget, Kucoin, Mexc, Gateio, Bithumb,
                      Upbit, Helius, Solscan, Jupiter, Raydium
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go, Python, Django, PostgreSQL, AWS
                    </span>
                  </div>
                </div>

                {/* Solana DEX Bot */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    Solana DEX Bot Backend
                  </h4>
                  <p class="quant-experience__project-desc">
                    Developed bot backend executing various DEX and on-chain
                    strategies. Built as a modular system with Solana as primary
                    support, extensible to Ethereum, Base, and other networks.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      Dexscreener, CoinGecko, Solscan, Helius, Jupiter
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go, Python, Django, PostgreSQL, AWS
                    </span>
                  </div>
                </div>

                {/* Metrics Collection */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    Universal Trading Metrics Collection Backend
                  </h4>
                  <p class="quant-experience__project-desc">
                    Developed and deployed company-wide backend for collecting
                    foundational data across CEX, DEX, and on-chain
                    environments. Implemented collection and maintenance of
                    reference data including Kline (Candle Data), Filtered
                    Price, and Top Holders Address. Received positive feedback
                    from both technical and non-technical team members.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      Dexscreener, CoinGecko, Solscan, Helius, GoPlus, CEX APIs
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go, PostgreSQL, AWS
                    </span>
                  </div>
                </div>

                {/* AI Agent Sentiment */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    AI Agent Sentiment Analysis & Auto-Trading System
                  </h4>
                  <p class="quant-experience__project-desc">
                    Developed backend system that analyzes crypto news, KOL
                    Telegram messages, and tweets using AI Agent (Instruction).
                    Automatically triggers orders when sentiment scores exceed
                    defined thresholds.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      OpenAI, Twitter API, Binance, Bybit
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go, Fx, Python, Django, PostgreSQL, AWS
                    </span>
                  </div>
                </div>

                {/* Listing Alert */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    Real-time Exchange Listing Alert & Order System
                  </h4>
                  <p class="quant-experience__project-desc">
                    Developed backend for real-time monitoring of Bithumb and
                    Upbit listing announcements, triggering immediate orders on
                    overseas exchanges upon detection. Achieved order latency
                    optimization down to approximately 130ms.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      Binance, Bybit, Bithumb, Upbit
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go, Smart Proxy, AWS
                    </span>
                  </div>
                </div>

                {/* Metrics Chart */}
                <div class="quant-experience__project">
                  <h4 class="quant-experience__project-title">
                    Metrics Chart Backend
                  </h4>
                  <p class="quant-experience__project-desc">
                    Developed and deployed company-wide backend for collecting
                    and managing frequently used strategy metrics including
                    price change rate, volatility, volume, and Kimchi Premium.
                    Received positive feedback for creating an accessible tool
                    for both technical and non-technical team members.
                  </p>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">APIs:</span>
                    <span class="quant-experience__tech-list">
                      Bybit, Upbit, Velo
                    </span>
                  </div>
                  <div class="quant-experience__tech">
                    <span class="quant-experience__tech-label">Stack:</span>
                    <span class="quant-experience__tech-list">
                      Go, Python, Django, PostgreSQL, MongoDB, AWS
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
              I am a language-agnostic developer with strong fundamentals across
              multiple paradigms. Specialized in Rust, Go, Python, and
              TypeScript for building high-performance systems.
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
                  <li>Sentiment-based Trading</li>
                </ul>
              </div>

              {/* APIs */}
              <div class="quant-skills__card">
                <div class="quant-skills__card-icon">🔌</div>
                <h3 class="quant-skills__card-title">APIs</h3>
                <ul class="quant-skills__list">
                  <li>Binance, Bybit, Bitget, Kucoin</li>
                  <li>Upbit, Bithumb, Mexc, Gateio</li>
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
                  <li>Kimchi Premium Metrics</li>
                  <li>Volatility Analysis</li>
                  <li>AI Sentiment Analysis</li>
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
