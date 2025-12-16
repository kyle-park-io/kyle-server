import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';

// global css
import './css/global.css';

// layout components
import Header from './layout/Header';
import Footer from './layout/Footer';

// route components
import App from './app/App';
import About from './about/About';
import Profile from './profile/Profile';
import Quant from './quant/Quant';
import PersonalQuant from './personal-quant/PersonalQuant';
import BlogList from './blog/BlogList';
import BlogDetail from './blog/BlogDetail';
import BlogNotFound from './blog/BlogNotFound';
import Chat from './chat/Chat';
import NotFoundPage from './components/404/NotFoundPage';
// test component
import Test from './blog/Test';

/**
 * Main Application Entry Point
 * New York Times inspired layout structure
 * - Header: Classic newspaper masthead
 * - Main: White background content area
 * - Footer: Minimal footer with social links
 */
const root = document.getElementById('root');

if (root != null) {
  render(
    () => (
      <div class="nyt-app-container tw-flex tw-flex-col tw-min-h-screen">
        {/* Header Section - NYT style masthead */}
        <div class="nyt-header-wrapper">
          <Header />
        </div>

        {/* Main Content Section - White background */}
        <main class="nyt-main-content tw-flex-grow tw-flex tw-flex-wrap tw-bg-white">
          <Router>
            <Route path="/" component={App} />
            <Route path="/test" component={Test} />
            <Route path="/about" component={About} />
            <Route path="/profile" component={Profile} />
            <Route path="/quant" component={Quant} />
            <Route path="/personal-quant" component={PersonalQuant} />
            <Route path="/blog" component={BlogList} />
            <Route path="/blog/not-found" component={BlogNotFound} />
            <Route path="/blog/:id" component={BlogDetail} />
            <Route path="/chat" component={Chat} />
            <Route path="/404" component={NotFoundPage} />
            <Route path="*" component={NotFoundPage} />
          </Router>
        </main>

        {/* Footer Section - Minimal NYT style */}
        <div class="nyt-footer-wrapper">
          <Footer />
        </div>
      </div>
    ),
    root,
  );
} else {
  console.error('Cannot find the root element');
}
