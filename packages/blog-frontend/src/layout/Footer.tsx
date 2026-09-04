import { type Component, type JSX } from 'solid-js';
// images
import Notion from '@public/notion-icon.svg';
import Medium from '@public/medium-icon.svg';
import Linkedin from '@public/linkedin-icon.png';
import Github from '@public/github-icon.png';
import Telegram from '@public/telegram-icon.svg';
import X from '@public/x-icon.svg';
// styles
import './Footer.css';

/**
 * Footer Component
 * New York Times inspired classic newspaper footer design
 * Clean, minimal design with social links and copyright
 */
const Footer: Component = (): JSX.Element => {
  // Social link handlers
  const handleNotionClick = (): void => {
    window.open(
      'https://kyle-park.notion.site/HI-I-m-KYLE-c52ac7c7e75c41dd92792f9db8cee895#0cbc2dce44ad44cba1e679d7ca4519c6',
    );
  };

  const handleMediumClick = (): void => {
    window.open('https://kyle-park-io.medium.com');
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

  const handleXClick = (): void => {
    window.open('https://x.com/bcd_kyle');
  };

  return (
    <>
      <footer class="nyt-footer">
        {/* Top border decoration */}
        <div class="nyt-footer__border-top"></div>

        <div class="nyt-footer__content">
          {/* Left section - Copyright */}
          <div class="nyt-footer__copyright">
            <span class="nyt-footer__copyright-text">
              © 2026 kyle-park-io. All rights reserved.
            </span>
          </div>

          {/* Center section - Tagline */}
          <div class="nyt-footer__tagline">
            <span class="nyt-footer__tagline-text">
              ✦ Crafted with passion ✦
            </span>
          </div>

          {/* Right section - Social links */}
          <div class="nyt-footer__social">
            {/*
              The blog is served by express at /blog, outside this SPA's own
              router. `rel="external"` is the marker the router's click
              handler (see Header.tsx, Offcanvas.tsx, App.tsx) checks before
              deciding whether to intercept a click as an in-app navigation
              — without it this link would be swallowed as an SPA route and
              404 instead of reaching express.
            */}
            <a
              href="/blog/rss.xml"
              rel="external"
              class="nyt-footer__social-btn"
              aria-label="RSS feed"
            >
              <svg
                class="nyt-footer__social-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <circle cx="5" cy="19" r="1.75" fill="currentColor" />
                <path d="M4 11a9 9 0 0 1 9 9" />
                <path d="M4 4a16 16 0 0 1 16 16" />
              </svg>
            </a>
            <button
              onClick={handleNotionClick}
              class="nyt-footer__social-btn"
              aria-label="Visit Notion page"
            >
              <img src={Notion} alt="Notion" class="nyt-footer__social-icon" />
            </button>
            <button
              onClick={handleMediumClick}
              class="nyt-footer__social-btn"
              aria-label="Visit Medium blog"
            >
              <img src={Medium} alt="Medium" class="nyt-footer__social-icon" />
            </button>
            <button
              onClick={handleLinkedinClick}
              class="nyt-footer__social-btn"
              aria-label="Visit LinkedIn profile"
            >
              <img
                src={Linkedin}
                alt="LinkedIn"
                class="nyt-footer__social-icon"
              />
            </button>
            <button
              onClick={handleGithubClick}
              class="nyt-footer__social-btn"
              aria-label="Visit GitHub profile"
            >
              <img src={Github} alt="GitHub" class="nyt-footer__social-icon" />
            </button>
            <button
              onClick={handleTelegramClick}
              class="nyt-footer__social-btn"
              aria-label="Visit Telegram"
            >
              <img
                src={Telegram}
                alt="Telegram"
                class="nyt-footer__social-icon"
              />
            </button>
            <button
              onClick={handleXClick}
              class="nyt-footer__social-btn"
              aria-label="Visit X profile"
            >
              <img src={X} alt="X" class="nyt-footer__social-icon" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
