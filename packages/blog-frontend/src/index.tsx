import { type ParentComponent } from 'solid-js';
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
import DevRel from './devrel/DevRel';
import Quant from './quant/Quant';
import PersonalQuant from './personal-quant/PersonalQuant';
import Chat from './chat/Chat';
import NotFoundPage from './components/404/NotFoundPage';

/**
 * Main Application Entry Point
 * New York Times inspired layout structure
 * - Header: Classic newspaper masthead
 * - Main: White background content area
 * - Footer: Minimal footer with social links
 */
const root = document.getElementById('root');

/**
 * The masthead and footer around every route. They sit inside the Router
 * (as its root) so the Header can follow the current path: the Navigate
 * panel closes when a route changes, which it could not see from outside.
 */
const Layout: ParentComponent = (props) => (
  <div class="nyt-app-container tw-flex tw-flex-col tw-min-h-screen">
    {/* Header Section - NYT style masthead */}
    <div class="nyt-header-wrapper">
      <Header />
    </div>

    {/* Main Content Section - White background */}
    <main class="nyt-main-content tw-flex-grow tw-flex tw-flex-wrap tw-bg-white">
      {props.children}
    </main>

    {/* Footer Section - Minimal NYT style */}
    <div class="nyt-footer-wrapper">
      <Footer />
    </div>
  </div>
);

if (root != null) {
  render(
    () => (
      <Router root={Layout}>
        <Route path="/" component={App} />
        <Route path="/about" component={About} />
        <Route path="/profile" component={Profile} />
        <Route path="/devrel" component={DevRel} />
        <Route path="/quant" component={Quant} />
        <Route path="/personal-quant" component={PersonalQuant} />
        <Route path="/chat" component={Chat} />
        <Route path="/404" component={NotFoundPage} />
        <Route path="*" component={NotFoundPage} />
      </Router>
    ),
    root,
  );
} else {
  console.error('Cannot find the root element');
}
