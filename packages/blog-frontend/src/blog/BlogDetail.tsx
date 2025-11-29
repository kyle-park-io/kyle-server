import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount, Show } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
import axios from 'axios';
import { globalState } from '../constants/constants';
// styles
import './Blog.css';

/**
 * Blog Detail Component
 * New York Times inspired article view
 * Clean reading experience with optional notes
 */
const BlogDetail: Component = (): JSX.Element => {
  const api_url = globalState.api_url;
  const params = useParams();
  const navigate = useNavigate();

  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [htmlContent, setHtmlContent] = createSignal('');

  onMount(() => {
    async function fetchData(): Promise<void> {
      try {
        const res = await axios.get(`${api_url}/api/blog/${params.id}`);
        if (!res.data.exist) {
          navigate(`/blog/not-found?id=${params.id}`);
        }

        setHtmlContent(res.data.detail);
        setLoading(true);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
        setLoading(true);
      }
    }
    void fetchData();
  });

  const handleBackClick = (): void => {
    navigate('/blog');
  };

  return (
    <div class="blog-page blog-page--detail">
      <div class="blog-detail-container">
        {/* Back Button */}
        <button class="blog-back-btn" onClick={handleBackClick}>
          ← Back to Blog
        </button>

        {/* Content */}
        <Show when={!loading()}>
          <div class="blog-loading">
            <div class="blog-loading__spinner"></div>
            <span class="blog-loading__text">Loading article...</span>
          </div>
        </Show>

        <Show when={loading() && error() !== null}>
          <div class="blog-error">
            <span class="blog-error__icon">⚠️</span>
            <span class="blog-error__text">{error()?.message}</span>
          </div>
        </Show>

        <Show when={loading() && error() === null}>
          <div class="blog-detail-layout">
            {/* Article Content */}
            <article class="blog-article">
              <Show when={htmlContent() !== ''}>
                <div class="blog-article__content" innerHTML={htmlContent()} />
              </Show>
            </article>

            {/* Notes Sidebar */}
            <aside class="blog-notes">
              <label class="blog-notes__label">Notes</label>
              <textarea
                class="blog-notes__textarea"
                placeholder="Take notes while reading..."
              />
            </aside>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default BlogDetail;
