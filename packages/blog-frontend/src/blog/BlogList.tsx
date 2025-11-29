import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount, For, Show } from 'solid-js';
import { A } from '@solidjs/router';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { globalState } from '../constants/constants';
// styles
import './Blog.css';

/**
 * Blog List Component
 * New York Times inspired blog listing
 * Clean table layout with pagination
 */
const BlogList: Component = (): JSX.Element => {
  const api_url = globalState.api_url;

  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [list, setList] = createSignal<any[]>([]);
  const [page, setPage] = createSignal(0);
  const [pages, setPages] = createSignal<string[]>([]);
  const [currentPage, setCurrentPage] = createSignal(1);

  // Update blog list
  const handleUpdateClick = (): void => {
    async function handleAsyncClick(): Promise<void> {
      try {
        await axios.get(`${api_url}/api/blog/update`);
        window.location.reload();
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
      }
    }
    void handleAsyncClick();
  };

  // Download markdown file
  const handleDownloadClick = (id: string): void => {
    async function handleAsyncClick(): Promise<void> {
      try {
        const res = await axios.get(`${api_url}/api/blog/download/${id}`, {
          responseType: 'blob',
        });
        const blob = new Blob([res.data], {
          type: res.headers['content-type'],
        });
        saveAs(blob, `${id}.md`);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
      }
    }
    void handleAsyncClick();
  };

  // Page navigation
  const handlePageClick = (index: number): void => {
    async function handleAsyncClick(): Promise<void> {
      try {
        if (index === 0 || index === page() + 1 || index === currentPage()) {
          return;
        }
        setLoading(false);

        const params = { number: index };
        const blogList = await axios.get(
          `${api_url}/api/blog/sorted-by-date/pagination`,
          { params },
        );

        setList(blogList.data);
        setCurrentPage(index);
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
    void handleAsyncClick();
  };

  onMount(() => {
    async function fetchData(): Promise<void> {
      try {
        const blogNumber = await axios.get(`${api_url}/api/blog/number`);
        setPage(Math.ceil((blogNumber.data as unknown as number) / 10));
        setPages(Array(page()).fill(''));

        const blogList = await axios.get(
          `${api_url}/api/blog/sorted-by-date/top-10`,
        );
        setList(blogList.data);
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

  return (
    <div class="blog-page">
      <div class="blog-container">
        {/* Header */}
        <header class="blog-header">
          <h1 class="blog-header__title">Blog</h1>
          <p class="blog-header__subtitle">
            Technical writings, tutorials, and thoughts on software development
          </p>
          <button class="blog-update-btn" onClick={handleUpdateClick}>
            ↻ Refresh
          </button>
        </header>

        {/* Content */}
        <div class="blog-content">
          <Show when={!loading()}>
            <div class="blog-loading">
              <div class="blog-loading__spinner"></div>
              <span class="blog-loading__text">Loading articles...</span>
            </div>
          </Show>

          <Show when={loading() && error() !== null}>
            <div class="blog-error">
              <span class="blog-error__icon">⚠️</span>
              <span class="blog-error__text">{error()?.message}</span>
            </div>
          </Show>

          <Show when={loading() && error() === null}>
            {/* Article List */}
            <div class="blog-list">
              <For each={list()}>
                {(item, index) => (
                  <article class="blog-item">
                    <span class="blog-item__number">
                      {String((currentPage() - 1) * 10 + index() + 1).padStart(
                        2,
                        '0',
                      )}
                    </span>
                    <div class="blog-item__content">
                      <A
                        href={'/blog/' + item.filename.split('.')[0]}
                        class="blog-item__title"
                      >
                        {item.title}
                      </A>
                    </div>
                    <button
                      class="blog-item__download"
                      onClick={() =>
                        handleDownloadClick(item.filename.split('.')[0])
                      }
                      title="Download Markdown"
                    >
                      ↓
                    </button>
                  </article>
                )}
              </For>
            </div>

            {/* Pagination */}
            <nav class="blog-pagination">
              <button
                class="blog-pagination__btn"
                onClick={() => handlePageClick(1)}
                disabled={currentPage() === 1}
              >
                ««
              </button>
              <button
                class="blog-pagination__btn"
                onClick={() => handlePageClick(currentPage() - 1)}
                disabled={currentPage() === 1}
              >
                «
              </button>

              <For each={pages()}>
                {(_, index) => (
                  <button
                    class={`blog-pagination__btn ${currentPage() === index() + 1 ? 'blog-pagination__btn--active' : ''}`}
                    onClick={() => handlePageClick(index() + 1)}
                  >
                    {index() + 1}
                  </button>
                )}
              </For>

              <button
                class="blog-pagination__btn"
                onClick={() => handlePageClick(currentPage() + 1)}
                disabled={currentPage() === page()}
              >
                »
              </button>
              <button
                class="blog-pagination__btn"
                onClick={() => handlePageClick(page())}
                disabled={currentPage() === page()}
              >
                »»
              </button>
            </nav>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
