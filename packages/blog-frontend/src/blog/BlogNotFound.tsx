import { type Component, type JSX } from 'solid-js';
import { useSearchParams, useNavigate } from '@solidjs/router';
// styles
import './Blog.css';

/**
 * Blog Not Found Component
 * New York Times inspired 404 page
 */
const BlogNotFound: Component = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const blogId = searchParams.id;
  const navigate = useNavigate();

  const handleHomeClick = (): void => {
    navigate('/');
  };

  const handleBlogClick = (): void => {
    navigate('/blog');
  };

  return (
    <div class="blog-page blog-page--notfound">
      <div class="blog-notfound">
        <span class="blog-notfound__icon">📄</span>
        <h1 class="blog-notfound__title">Article Not Found</h1>
        <p class="blog-notfound__message">
          The article "<strong>{blogId}</strong>" doesn't exist or has been
          removed.
        </p>
        <div class="blog-notfound__actions">
          <button class="blog-notfound__btn" onClick={handleBlogClick}>
            Browse Articles
          </button>
          <button
            class="blog-notfound__btn blog-notfound__btn--secondary"
            onClick={handleHomeClick}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogNotFound;
