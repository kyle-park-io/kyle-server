import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';

// global css
import './css/global.css';

// basic
import Header from './layout/Header';
import Footer from './layout/Footer';

// route
import App from './app/App';
import About from './about/About';
import Profile from './profile/Profile';
import BlogList from './blog/BlogList';
import BlogDetail from './blog/BlogDetail';
import BlogNotFound from './blog/BlogNotFound';
import Chat from './chat/Chat';
import NotFoundPage from './components/404/NotFoundPage';
// test component
import Test from './blog/Test';

const root = document.getElementById('root');
if (root != null) {
  render(
    () => (
      <div class="tw-flex tw-flex-col tw-min-h-screen">
        <div class="tw-bg-white tw-h-10 tw-overflow-auto">
          <Header></Header>
        </div>
        <div class="tw-flex-grow tw-flex tw-flex-wrap">
          <Router>
            <Route path="/" component={App} />
            <Route path="/test" component={Test} />
            <Route path="/about" component={About} />
            <Route path="/profile" component={Profile} />
            <Route path="/blog" component={BlogList} />
            <Route path="/blog/not-found" component={BlogNotFound} />
            <Route path="/blog/:id" component={BlogDetail} />
            <Route path="/chat" component={Chat} />
            <Route path="/404" component={NotFoundPage} />
            <Route path="*" component={NotFoundPage} />
          </Router>
        </div>
        <div class="tw-bg-gray-400 tw-h-8">
          <Footer></Footer>
        </div>
      </div>
    ),
    root,
  );
} else {
  console.error('Cannot find the root element');
}
