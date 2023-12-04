import { render } from 'solid-js/web';
import { Router, Route, Routes } from '@solidjs/router';

// global css
import 'normalize.css';
import './css/global.css';

// basic
import Header from './layout/Header';
import Footer from './layout/Footer';

// route
import App from './App';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import NotFoundPage from './NotFoundPage';

const root = document.getElementById('root');
if (root != null) {
  render(
    () => (
      <div class="flex flex-col min-h-screen">
        <Router>
          <div class="h-12 bg-blue-500">
            <Header></Header>
          </div>
          <div class="flex-grow bg-green-500">
            <Routes>
              <Route path="/" component={App} />
              <Route path="/blog" component={BlogList} />
              <Route path="/blog/:id" component={BlogDetail} />
              <Route path="/404" component={NotFoundPage} />
              <Route path="*" component={NotFoundPage} />
            </Routes>
          </div>
          <div class="center-flex h-10 bg-red-500">
            <Footer></Footer>
          </div>
        </Router>
      </div>
    ),
    root,
  );
} else {
  console.error('Cannot find the root element');
}
