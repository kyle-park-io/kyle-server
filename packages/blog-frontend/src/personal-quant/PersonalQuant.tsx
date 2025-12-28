import { type Component, type JSX } from 'solid-js';
// images
import TelegramIcon from '@public/telegram-icon.svg';
import NotionIcon from '@public/notion-icon.svg';
// styles
import './PersonalQuant.css';

/**
 * Personal Quant Page Component
 * Showcases personal trading strategies and projects
 * Dark theme with accent colors for a professional finance aesthetic
 */
const PersonalQuant: Component = (): JSX.Element => {
  return (
    <div class="quant-page">
      {/* Main Content */}
      <div class="quant-container">
        {/* Overview Section */}
        <section class="quant-section">
          <h2 class="quant-section__title">Overview</h2>
          <div class="quant-section__content">
            <p>
              This section documents personal quantitative trading strategies
              that I research, analyze, and implement independently alongside my
              professional work.
            </p>
            <p>
              These projects serve as both experimental testbeds for novel
              trading ideas and practical applications of quantitative methods
              across CEX, DEX, and on-chain ecosystems. The following strategies
              are continuously refined through iterative testing and real-world
              validation.
            </p>
          </div>
        </section>

        {/* Strategies Section */}
        <section class="quant-section">
          <h2 class="quant-section__title">Personal Strategies</h2>
          <div class="personal-strategies">
            {/* Strategy 1: Polymarket 15M Arbitrage */}
            <div class="strategy-card">
              <div class="strategy-card__header">
                <h3 class="strategy-card__title">
                  Polymarket 15M Chart Arbitrage
                </h3>
                <span class="strategy-card__category">
                  Prediction Market Arbitrage
                </span>
              </div>

              <div class="strategy-card__section">
                <h4 class="strategy-card__subtitle">Strategy Overview</h4>
                <p class="strategy-card__description">
                  Arbitrage strategy targeting Polymarket's 15-minute chart data
                  that exploits market inefficiencies in binary outcome markets.
                  The system monitors prediction markets where the sum of Yes
                  and No outcome prices falls below $1.00, capturing risk-free
                  profit opportunities. This strategy takes advantage of
                  temporary mispricing in decentralized prediction markets where
                  the total probability should theoretically equal 100% ($1.00).
                </p>
              </div>

              <div class="strategy-card__section">
                <h4 class="strategy-card__subtitle">
                  Technical Specifications
                </h4>
                <div class="strategy-card__specs">
                  <div class="strategy-card__spec-item">
                    <span class="strategy-card__spec-icon">🦀</span>
                    <span class="strategy-card__spec-label">Language:</span>
                    <span class="strategy-card__spec-value">Rust</span>
                  </div>
                  <div class="strategy-card__spec-item">
                    <span class="strategy-card__spec-icon">🐹</span>
                    <span class="strategy-card__spec-label">Language:</span>
                    <span class="strategy-card__spec-value">Go</span>
                  </div>
                  <div class="strategy-card__spec-item">
                    <span class="strategy-card__spec-icon">📊</span>
                    <span class="strategy-card__spec-label">Market:</span>
                    <span class="strategy-card__spec-value">
                      Polymarket Crypto 15M
                    </span>
                  </div>
                  <div class="strategy-card__spec-item">
                    <span class="strategy-card__spec-icon">⏱️</span>
                    <span class="strategy-card__spec-label">Timeframe:</span>
                    <span class="strategy-card__spec-value">15 Minutes</span>
                  </div>
                </div>
              </div>

              <div class="strategy-card__section">
                <h4 class="strategy-card__subtitle">Key Features</h4>
                <ul class="strategy-card__features">
                  <li>
                    Monitors binary outcome markets (Yes/No) where price sum
                    &lt; $1.00
                  </li>
                  <li>
                    Captures arbitrage opportunities by simultaneously buying
                    both outcomes when underpriced
                  </li>
                  <li>
                    Real-time 15-minute chart analysis for crypto prediction
                    markets
                  </li>
                  <li>
                    Risk-free profit strategy exploiting prediction market
                    inefficiencies
                  </li>
                  <li>
                    High-performance implementation in Rust and Go for
                    low-latency execution
                  </li>
                </ul>
              </div>

              <div class="strategy-card__section">
                <h4 class="strategy-card__subtitle">Market Reference</h4>
                <div class="strategy-card__links">
                  <a
                    href="https://polymarket.com/crypto/15M"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="strategy-card__link"
                  >
                    <span class="strategy-card__spec-icon">🔗</span>
                    <span>View Polymarket Crypto 15M Markets</span>
                    <span class="strategy-card__link-arrow">→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Strategy 2: Binance Triangular Arbitrage */}
            <div class="strategy-card">
              <div class="strategy-card__header">
                <h3 class="strategy-card__title">
                  Binance Triangular Arbitrage
                </h3>
                <span class="strategy-card__category">CEX Arbitrage</span>
              </div>

              <div class="strategy-card__section">
                <h4 class="strategy-card__subtitle">Strategy Overview</h4>
                <p class="strategy-card__description">
                  Triangular arbitrage strategy that identifies and exploits
                  price inefficiencies across three currency pairs on Binance
                  (e.g., BTC/USDT → ETH/BTC → ETH/USDT). The system continuously
                  monitors order book depth and calculates optimal execution
                  paths to profit from temporary price discrepancies, with a
                  primary focus on minimizing execution latency.
                </p>
              </div>

              <div class="strategy-card__section">
                <h4 class="strategy-card__subtitle">
                  Technical Specifications
                </h4>
                <div class="strategy-card__specs">
                  <div class="strategy-card__spec-item">
                    <span class="strategy-card__spec-icon">📡</span>
                    <span class="strategy-card__spec-label">Protocol:</span>
                    <span class="strategy-card__spec-value">FIX 4.4</span>
                  </div>
                  <div class="strategy-card__spec-item">
                    <span class="strategy-card__spec-icon">🦀</span>
                    <span class="strategy-card__spec-label">Language:</span>
                    <span class="strategy-card__spec-value">Rust</span>
                  </div>
                  <div class="strategy-card__spec-item">
                    <span class="strategy-card__spec-icon">🔒</span>
                    <span class="strategy-card__spec-label">TLS Library:</span>
                    <span class="strategy-card__spec-value">rustls</span>
                  </div>
                  <div class="strategy-card__spec-item">
                    <span class="strategy-card__spec-icon">⚙️</span>
                    <span class="strategy-card__spec-label">Encoding:</span>
                    <span class="strategy-card__spec-value">
                      SBE (Simple Binary Encoding)
                    </span>
                  </div>
                </div>
              </div>

              <div class="strategy-card__section">
                <h4 class="strategy-card__subtitle">Key Features</h4>
                <ul class="strategy-card__features">
                  <li>
                    Executes three consecutive orders across linked currency
                    pairs to complete arbitrage cycle
                  </li>
                  <li>
                    FIX 4.4 protocol with SBE encoding reduces network overhead
                    for low-latency execution
                  </li>
                  <li>
                    Rust async runtime enables concurrent order book processing
                    and order placement
                  </li>
                  <li>
                    Real-time profitability calculation accounting for trading
                    fees and slippage
                  </li>
                </ul>
              </div>

              <div class="strategy-card__section">
                <h4 class="strategy-card__subtitle">Documentation</h4>
                <div class="strategy-card__links">
                  <a
                    href="https://kyle-park.notion.site/Triangular-Arbitrage-Strategy-Binance-2cb5e2b1051680108813dde7f828dcd9"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="strategy-card__link"
                  >
                    <img
                      src={NotionIcon}
                      alt="Notion"
                      class="strategy-card__link-icon"
                    />
                    <span>View detailed documentation on Notion</span>
                    <span class="strategy-card__link-arrow">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section class="quant-section quant-section--cta">
          <h2 class="quant-section__title">Get in Touch</h2>
          <div class="quant-section__content">
            <p>
              Discussions about trading strategies are always welcome. Feel free
              to reach out via Telegram to share ideas, ask questions, or
              explore potential collaborations.
            </p>
            <div class="quant-cta__links">
              <a
                href="https://t.me/kyleparkio"
                target="_blank"
                rel="noopener noreferrer"
                class="quant-cta__link quant-cta__link--primary"
              >
                <img
                  src={TelegramIcon}
                  alt="Telegram"
                  class="quant-cta__icon-img"
                />
                <span>Contact via Telegram</span>
                <span class="quant-cta__arrow">→</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PersonalQuant;
