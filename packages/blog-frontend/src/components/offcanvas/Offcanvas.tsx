import { type Component, type JSX } from 'solid-js';
// interface
import { type MoveProps } from './interfaces/offcanvas.interfaces';
import { globalState } from '../../constants/constants';
// styles
import './Offcanvas.css';

/**
 * Navigate Offcanvas Component
 * New York Times inspired slide-out navigation panel
 * Clean typography with elegant link styling
 */
export const Move: Component<MoveProps> = (props): JSX.Element => {
  const url = globalState.url;

  // Navigation handlers
  const handleQuantClick = (): void => {
    window.open('https://kyle-quant.xyz/');
  };

  const handleDexClick = (): void => {
    window.open(`${url}/dex`);
  };

  const handleNotionClick = (): void => {
    window.open(
      'https://kyle-park.notion.site/HI-I-m-KYLE-c52ac7c7e75c41dd92792f9db8cee895#0cbc2dce44ad44cba1e679d7ca4519c6',
    );
  };

  const handleLinkedinClick = (): void => {
    window.open('https://www.linkedin.com/in/kyle-park-io');
  };

  const handleGithubClick = (): void => {
    window.open('https://github.com/kyle-park-io');
  };

  const handleTelegramClick = (): void => {
    window.open('https://t.me/kyleparkio');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        class={`nav-overlay ${props.show ? 'nav-overlay--visible' : ''}`}
        onClick={props.onHide}
      />

      {/* Offcanvas Panel */}
      <div class={`nav-panel ${props.show ? 'nav-panel--open' : ''}`}>
        {/* Header */}
        <div class="nav-panel__header">
          <h2 class="nav-panel__title">Navigate</h2>
          <button class="nav-panel__close" onClick={props.onHide}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div class="nav-panel__body">
          {/* Featured Link */}
          <div class="nav-section">
            <span class="nav-section__label">Featured</span>
            <button
              class="nav-link nav-link--featured"
              onClick={handleQuantClick}
            >
              <span class="nav-link__icon">📈</span>
              <span class="nav-link__text">
                <span class="nav-link__title">Quant Portfolio</span>
                <span class="nav-link__desc">Trading strategies</span>
              </span>
              <span class="nav-link__arrow">→</span>
            </button>
          </div>

          {/* Projects */}
          <div class="nav-section">
            <span class="nav-section__label">Projects</span>
            <button class="nav-link" onClick={handleDexClick}>
              <span class="nav-link__icon">💱</span>
              <span class="nav-link__text">
                <span class="nav-link__title">DEX</span>
                <span class="nav-link__desc">Decentralized exchange</span>
              </span>
              <span class="nav-link__arrow">→</span>
            </button>
            <button class="nav-link" onClick={handleNotionClick}>
              <span class="nav-link__icon">📝</span>
              <span class="nav-link__text">
                <span class="nav-link__title">Notion</span>
                <span class="nav-link__desc">Documentation & notes</span>
              </span>
              <span class="nav-link__arrow">→</span>
            </button>
          </div>

          {/* Social */}
          <div class="nav-section">
            <span class="nav-section__label">Social</span>
            <button class="nav-link" onClick={handleLinkedinClick}>
              <span class="nav-link__icon">💼</span>
              <span class="nav-link__text">
                <span class="nav-link__title">LinkedIn</span>
                <span class="nav-link__desc">Professional network</span>
              </span>
              <span class="nav-link__arrow">→</span>
            </button>
            <button class="nav-link" onClick={handleGithubClick}>
              <span class="nav-link__icon">🐙</span>
              <span class="nav-link__text">
                <span class="nav-link__title">GitHub</span>
                <span class="nav-link__desc">Open source projects</span>
              </span>
              <span class="nav-link__arrow">→</span>
            </button>
            <button class="nav-link" onClick={handleTelegramClick}>
              <span class="nav-link__icon">💬</span>
              <span class="nav-link__text">
                <span class="nav-link__title">Telegram</span>
                <span class="nav-link__desc">Direct message</span>
              </span>
              <span class="nav-link__arrow">→</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div class="nav-panel__footer">
          <span class="nav-panel__copyright">© 2025 Kyle Park</span>
        </div>
      </div>
    </>
  );
};
