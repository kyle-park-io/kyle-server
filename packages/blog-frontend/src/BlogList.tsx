import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount, For } from 'solid-js';
import { Link } from '@solidjs/router';
import axios from 'axios';
import './BlogList.css';

const BlogList: Component = (): JSX.Element => {
  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [list, setList] = createSignal(['']);

  onMount(() => {
    async function fetchData(): Promise<void> {
      try {
        const res = await axios.get('https://jungho.dev/apis/api/blog');
        setList(res.data);
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
      <div>BlogList</div>
      {!loading() && <div>Loading...</div>}
      <div>
        <For each={list()}>
          {(item) => (
            <li>
              <Link href={'/blog' + '/' + item}>{item}</Link>
            </li>
          )}
        </For>
      </div>
      {error() !== null && <div>{error()?.message}</div>}
    </>
  );
};

export default BlogList;
