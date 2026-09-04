import { type Component, type JSX } from 'solid-js';
import { createSignal, For, onCleanup, onMount } from 'solid-js';
// image
import HomeLogo from '@public/home.svg';
// component
import { Move } from '../components/offcanvas/Offcanvas';
import { globalState } from '../constants/constants';
import { navItems } from 'site-shell/src/nav';
import { connectPresence, type Presence } from 'site-shell/src/presence';
import { renderPresenceCard } from 'site-shell/src/presence-card';
// styles
import './Header.css';
import 'site-shell/src/styles/presence.css';

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

  // Live presence: the count in the masthead, and the panel behind it.
  const [count, setCount] = createSignal(0);
  let cardRef: HTMLDivElement | undefined;

  onMount(() => {
    // The socket lives on the ingress proxy, which is not running in front
    // of a dev server.
    const isDevWebSocket =
      ingressWebsocketURL.includes('localhost') ||
      ingressWebsocketURL.includes('127.0.0.1');
    if (isDevWebSocket) return;

    const disconnect = connectPresence({
      origin: ingressWebsocketURL,
      path: window.location.pathname,
      onUpdate: (presence: Presence) => {
        setCount(presence.count);
        if (cardRef) renderPresenceCard(cardRef, presence);
      },
    });

    // The socket used to be opened and never closed. Solid tears this
    // component down on navigation, so without this a session that moved
    // between pages left a socket behind on every hop.
    onCleanup(disconnect);
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
            <div class="presence">
              <button
                type="button"
                class="presence__trigger"
                aria-label="Who is online"
              >
                <span class="presence__dot" aria-hidden="true">
                  ●
                </span>
                {count()} online
              </button>
              <div class="presence__card" ref={cardRef} role="status" />
            </div>
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
