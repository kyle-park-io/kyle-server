import { type Component, type JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { globalState } from '../constants/constants';
// styles
import './App.css';

/**
 * Main App Component
 * New York Times inspired homepage design
 * Clean grid layout with elegant project cards
 */
const App: Component = (): JSX.Element => {
  const url = globalState.url;
  const navigate = useNavigate();

  // Navigation handlers
  const handleQuantClick = (): void => {
    window.open('https://kyle-quant.xyz/');
  };

  const handleProfileClick = (): void => {
    navigate('/profile');
  };

  const handleLinkedinClick = (): void => {
    window.open('https://www.linkedin.com/in/kyle-park-io');
  };

  const handleGithubClick = (): void => {
    window.open('https://github.com/kyle-park-io');
  };

  const handleDexClick = (): void => {
    window.open(`${url}/dex`);
  };

  const handleDistributedClick = (): void => {
    window.location.href =
      'https://kyle-park.notion.site/Distributed-Computing-1315e2b1051680f3bc8ee9f38bbd18a3';
  };

  const handleTrackerNotionClick = (): void => {
    window.open(
      'https://kyle-park.notion.site/Token-ETH-ERC20-Tracker-Infura-API-Transfer-History-1655e2b105168058a9c4f82c00919f7b',
    );
  };

  const handleTrackerLogsClick = (): void => {
    window.open(`${url}/tracker/logs/tracker`);
  };

  const handleTimestampClick = (): void => {
    window.open(`${url}/recorder/logs/timestamp`);
  };

  const handleChainClick = (): void => {
    window.location.href =
      'https://kyle-park.notion.site/Chain-Communicator-08fe9b295ed34662b4a72e70a608f937';
  };

  const handleJunghoClick = (): void => {
    window.location.href =
      'https://kyle-park.notion.site/jungho-dev-03cc176ddcdb496a969cacaeec0c253f';
  };

  const handleWeddingClick = (): void => {
    window.location.href =
      'https://kyle-park.notion.site/Cardly-Mobile-Wedding-Invitation-519b87bb3c534155ae7d1da51bc89478';
  };

  const handleBlogClick = (): void => {
    navigate('/blog');
  };

  const handleChatClick = (): void => {
    navigate('/chat');
  };

  return (
    <div class="home-page">
      <div class="home-container">
        {/* Featured Section */}
        <section class="home-section home-section--featured">
          <button class="featured-card" onClick={handleQuantClick}>
            <div class="featured-card__content">
              <span class="featured-card__label">Featured</span>
              <h2 class="featured-card__title">Quant Portfolio</h2>
              <p class="featured-card__desc">
                Explore trading strategies and quantitative analysis projects
              </p>
              <span class="featured-card__link">Visit Site →</span>
            </div>
            <div class="featured-card__icon">📈</div>
          </button>
        </section>

        {/* Introduce Section */}
        <section class="home-section">
          <h2 class="home-section__title">Introduce</h2>
          <div class="home-grid home-grid--3">
            <button class="project-card" onClick={handleProfileClick}>
              <span class="project-card__icon">👤</span>
              <h3 class="project-card__title">Profile</h3>
              <p class="project-card__desc">About me</p>
            </button>

            <button class="project-card" onClick={handleLinkedinClick}>
              <span class="project-card__icon">💼</span>
              <h3 class="project-card__title">LinkedIn</h3>
              <p class="project-card__desc">Professional network</p>
            </button>

            <button class="project-card" onClick={handleGithubClick}>
              <span class="project-card__icon">🐙</span>
              <h3 class="project-card__title">GitHub</h3>
              <p class="project-card__desc">Open source</p>
            </button>
          </div>
        </section>

        {/* Projects Section */}
        <section class="home-section">
          <h2 class="home-section__title">Projects</h2>
          <div class="home-grid home-grid--4">
            <button
              class="project-card project-card--dex"
              onClick={handleDexClick}
            >
              <span class="project-card__icon">💱</span>
              <h3 class="project-card__title">DEX (Uniswap V2)</h3>
              <p class="project-card__desc">Decentralized exchange</p>
            </button>

            <button class="project-card" onClick={handleDistributedClick}>
              <span class="project-card__icon">🖥️</span>
              <h3 class="project-card__title">Distributed Computing</h3>
              <p class="project-card__desc">Parallel systems</p>
            </button>

            <button class="project-card" onClick={handleChainClick}>
              <span class="project-card__icon">🔗</span>
              <h3 class="project-card__title">Chain Communicator</h3>
              <p class="project-card__desc">Blockchain communicator</p>
            </button>

            <button class="project-card" onClick={handleJunghoClick}>
              <span class="project-card__icon">🌐</span>
              <h3 class="project-card__title">jungho.dev</h3>
              <p class="project-card__desc">Personal site infrastructure</p>
            </button>

            <button class="project-card" onClick={handleTrackerNotionClick}>
              <span class="project-card__icon">📊</span>
              <h3 class="project-card__title">Token Tracker</h3>
              <p class="project-card__desc">
                ETH/ERC20 transfer history via Infura API
              </p>
            </button>

            <button class="project-card" onClick={handleTrackerLogsClick}>
              <span class="project-card__icon">📋</span>
              <h3 class="project-card__title">Tracker Docs</h3>
              <p class="project-card__desc">Swagger API & real-time logs</p>
            </button>

            <button class="project-card" onClick={handleTimestampClick}>
              <span class="project-card__icon">⏱️</span>
              <h3 class="project-card__title">Blockchain Recorder</h3>
              <p class="project-card__desc">Block timestamp</p>
            </button>
          </div>
        </section>

        {/* Extra Section */}
        <section class="home-section">
          <h2 class="home-section__title">Extra</h2>
          <div class="home-grid home-grid--2">
            <button
              class="project-card project-card--large"
              onClick={handleBlogClick}
            >
              <span class="project-card__icon">📝</span>
              <h3 class="project-card__title">Blog</h3>
              <p class="project-card__desc">Technical writings and thoughts</p>
            </button>

            <button
              class="project-card project-card--large"
              onClick={handleChatClick}
            >
              <span class="project-card__icon">💬</span>
              <h3 class="project-card__title">Chat</h3>
              <p class="project-card__desc">Anonymous real-time chat</p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
