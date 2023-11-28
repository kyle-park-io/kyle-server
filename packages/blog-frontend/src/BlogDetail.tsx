import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { useParams } from '@solidjs/router';
import axios from 'axios';
import './BlogDetail.css';

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
          `https://jungho.dev/apis/api/blog/${params.id}`,
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
        setLoading(false);
      }
    }
    void fetchData();
  });

  return (
    <>
      <div>BlogDetail</div>
      {!loading() && <div>Loading...</div>}
      {title() !== '' && (
        <div style="white-space: pre-wrap;" innerHTML={title()} />
      )}
      {htmlContent() !== '' && (
        <div style="white-space: pre-wrap;" innerHTML={htmlContent()} />
      )}
      {error() !== null && <div>{error()?.message}</div>}
    </>
  );
};

export default BlogDetail;
