import { type Component, type JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
// styles
import './NotFoundPage.css';

/**
 * 404 Not Found Page
 * New York Times inspired design
 * Elegant error page with navigation options
 */
const NotFoundPage: Component = (): JSX.Element => {
  const navigate = useNavigate();

  const handleHomeClick = (): void => {
    navigate('/');
  };

  const handleBackClick = (): void => {
    window.history.back();
  };

  return (
    <div class="notfound-page">
      <div class="notfound-container">
        {/* Decorative Element */}
        <div class="notfound-deco">
          <span class="notfound-deco__line"></span>
          <span class="notfound-deco__number">404</span>
          <span class="notfound-deco__line"></span>
        </div>

        {/* Content */}
        <h1 class="notfound-title">Page Not Found</h1>
        <p class="notfound-message">
          The page you're looking for doesn't exist or has been moved.
          <br />
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div class="notfound-actions">
          <button
            class="notfound-btn notfound-btn--primary"
            onClick={handleHomeClick}
          >
            Go to Homepage
          </button>
          <button
            class="notfound-btn notfound-btn--secondary"
            onClick={handleBackClick}
          >
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div class="notfound-links">
          <span class="notfound-links__label">Quick Links</span>
          <div class="notfound-links__list">
            <a href="/about" class="notfound-links__item">
              About
            </a>
            <span class="notfound-links__divider">·</span>
            <a href="/profile" class="notfound-links__item">
              Profile
            </a>
            <span class="notfound-links__divider">·</span>
            <a href="/blog" class="notfound-links__item">
              Blog
            </a>
            <span class="notfound-links__divider">·</span>
            <a href="/chat" class="notfound-links__item">
              Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
