import { type Component, type JSX } from 'solid-js';
import './App.css';

const App: Component = (): JSX.Element => {
  return (
    <>
      <div>
        <div>
          <h1 class="text-3xl font-bold underline">Hello world!</h1>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-blue-200 p-4">
            <a href="https://jungho.dev/blog">블로그</a>
          </div>
          <div class="bg-blue-200 p-4">덱스</div>
          <div class="bg-blue-200 p-4">
            <a
              href="https://www.linkedin.com/in/kyle-park-io"
              target="_blank"
              rel="noopener noreferrer"
            >
              링크드인
            </a>
          </div>
          <div class="bg-blue-200 p-4">
            <a
              href="https://github.com/kyle-park-io"
              target="_blank"
              rel="noopener noreferrer"
            >
              깃허브
            </a>
          </div>
          <div class="bg-blue-200 p-4">방명록</div>
          <div class="bg-blue-200 p-4">공지사항</div>
        </div>
      </div>
      {/* <div>
        <h1 class="text-3xl font-bold underline">Hello world!</h1>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/Home.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p> */}
    </>
  );
};

export default App;
