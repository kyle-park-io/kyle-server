import { type Component, type JSX } from 'solid-js';
// images
import Notion from '@public/notion-icon.svg';
import Linkedin from '@public/linkedin-icon.png';
import Github from '@public/github-icon.png';
import Telegram from '@public/telegram-icon.svg';
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
            <button
              onClick={handleNotionClick}
              class="nyt-footer__social-btn"
              aria-label="Visit Notion page"
            >
              <img src={Notion} alt="Notion" class="nyt-footer__social-icon" />
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
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
