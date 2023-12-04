import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount, For } from 'solid-js';
import { Link } from '@solidjs/router';
import axios from 'axios';
import Spinner from './components/Spinner';

const BlogList: Component = (): JSX.Element => {
  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [list, setList] = createSignal(['']);

  const handleClick = (): void => {
    async function handleAsyncClick(): Promise<void> {
      try {
        await axios.get('https://jungho.dev/apis/api/blog/update');
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
        setLoading(true);
      }
    }
    void fetchData();
  });

  return (
    <>
      <div class="flex-grow flex flex-col">
        <div>BlogList</div>
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
                <div>
                  <button
                    onClick={handleClick}
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Update
                  </button>
                </div>
                <div>
                  <For each={list()}>
                    {(item) => (
                      <li>
                        <Link href={'/blog' + '/' + item}>{item}</Link>
                      </li>
                    )}
                  </For>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BlogList;
