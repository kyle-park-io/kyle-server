import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { useParams } from '@solidjs/router';
import axios from 'axios';
import Spinner from './components/Spinner';

const BlogDetail: Component = (): JSX.Element => {
  const params = useParams();

  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [title, setTitle] = createSignal('');
  const [htmlContent, setHtmlContent] = createSignal('');

  onMount(() => {
    async function fetchData(): Promise<void> {
      try {
        const res = await axios.get(
          `https://jungho.dev/api-blog/api/blog/${params.id}`,
        );
        setTitle(res.data.title);
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

  return (
    <>
      <div class="flex-grow flex flex-col">
        <div>BlogDetail</div>
        {!loading() ? (
          <div class="flex-grow center-flex">
            Loading...
            <Spinner></Spinner>
          </div>
        ) : (
          <div>
            {error() !== null ? (
              <div>{error()?.message}</div>
            ) : (
              <div>
                {title() !== '' && (
                  <div style="white-space: pre-wrap;" innerHTML={title()} />
                )}
                {htmlContent() !== '' && (
                  <div
                    style="white-space: pre-wrap;"
                    innerHTML={htmlContent()}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BlogDetail;
