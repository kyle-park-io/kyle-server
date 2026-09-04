import { type Component, type JSX } from 'solid-js';
import { createSignal, For, onMount } from 'solid-js';
// image
import HomeLogo from '@public/home.svg';
// component
import { Move } from '../components/offcanvas/Offcanvas';
import { globalState } from '../constants/constants';
import { navItems } from 'site-shell/src/nav';
// styles
import './Header.css';

/**
 * Header Component
 * New York Times inspired classic newspaper header design
 * Features serif typography and minimalist black/white aesthetic
 */
const Header: Component = (): JSX.Element => {
  const ingressWebsocketURL = globalState.ingress_reverse_proxy_websocket_url;

  // Offcanvas state management
  const [show, setShow] = createSignal(false);
  const handleOpen = (): void => {
    setShow(true);
  };
  const handleClose = (): void => {
    setShow(false);
  };

  // Real-time visitor count
  const [count, setCount] = createSignal(0);

  onMount(() => {
    // WebSocket connection for real-time visitor count
    // Skip if WebSocket URL points to localhost (development environment)
    const isDevWebSocket =
      ingressWebsocketURL.includes('localhost') ||
      ingressWebsocketURL.includes('127.0.0.1');

    if (isDevWebSocket) {
      // Skip WebSocket connection in development
      return;
    }

    try {
      const ws = new WebSocket(`${ingressWebsocketURL}/ws`);

      ws.onopen = () => console.log('WebSocket connected');
      ws.onmessage = (event) => {
        const data = event.data.trim();
        const number = parseInt(data, 10);
        if (!isNaN(number)) {
          setCount(number);
        }
      };
      ws.onerror = () => {
        // Silently handle WebSocket errors
        console.warn('WebSocket connection failed - visitor count unavailable');
      };
      ws.onclose = () => console.log('WebSocket disconnected');
    } catch (error) {
      // Handle WebSocket initialization errors
      console.warn('WebSocket initialization failed:', error);
    }
  });

  // Get current date formatted
  const getCurrentDate = (): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <>
      <header class="nyt-header">
        {/* Screen reader only text */}
        <h1 class="offscreen">Kyle Park - Personal Blog</h1>

        {/* Top utility bar */}
        <div class="nyt-header__utility-bar">
          <div class="nyt-header__utility-left">
            <a href="/" class="nyt-header__home-btn">
              <img src={HomeLogo} alt="Home" class="nyt-header__home-icon" />
            </a>
            <span class="nyt-header__date">{getCurrentDate()}</span>
          </div>
          <div class="nyt-header__utility-right">
            <span class="nyt-header__visitor-count">
              <span class="nyt-header__visitor-icon">●</span>
              {count()} online
            </span>
          </div>
        </div>

        {/* Main header with logo */}
        <div class="nyt-header__main">
          <a href="/" class="nyt-header__logo-btn">
            <span class="nyt-header__logo">
              <span class="nyt-header__logo-accent">KYLE PARK</span>
              <span class="nyt-header__logo-tagline">Personal Website</span>
            </span>
          </a>
        </div>

        {/* Navigation bar */}
        <nav class="nyt-header__nav">
          <ul class="nyt-header__nav-list">
            <For each={navItems}>
              {(item) => (
                <li class="nyt-header__nav-item">
                  <a
                    href={item.href}
                    class={
                      item.variant !== undefined
                        ? `nyt-header__nav-link nyt-header__nav-link--${item.variant}`
                        : 'nyt-header__nav-link'
                    }
                    rel={item.external === true ? 'external' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              )}
            </For>
            <li class="nyt-header__nav-item">
              <button
                onClick={handleOpen}
                class="nyt-header__nav-link"
                aria-label="Open navigation menu"
              >
                ☰
              </button>
              <Move show={show()} onHide={handleClose}></Move>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
