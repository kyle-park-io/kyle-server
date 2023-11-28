import { render } from 'solid-js/web';
import { Router, Route, Routes } from '@solidjs/router';

// root css
import './index.css';

// route
import App from './App';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import NotFoundPage from './NotFoundPage';

const root = document.getElementById('root');
if (root != null) {
  render(
    () => (
      <Router>
        <Routes>
          <Route path="/" component={App} />
          <Route path="/blog" component={BlogList} />
          <Route path="/blog/:id" component={BlogDetail} />
          <Route path="/404" component={NotFoundPage} />
          <Route path="*" component={NotFoundPage} />
        </Routes>
      </Router>
    ),
    root,
  );
} else {
  console.error('Cannot find the root element');
}
