import { type Component, type JSX } from 'solid-js';

const App: Component = (): JSX.Element => {
  const env = import.meta.env.VITE_ENV;
  let url;
  if (env === 'DEV') {
    url = import.meta.env.VITE_DEV_URL;
  } else if (env === 'PROD') {
    url = import.meta.env.VITE_PROD_URL;
  } else {
    throw new Error('url env error');
  }

  return (
    <>
      <div>
        <div>
          <h1 class="underline">Hello world!</h1>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-blue-200 p-4">
            <a href={`${url}/blog`}>블로그</a>
          </div>
          <div class="bg-blue-200 p-4">덱스</div>
          <div class="bg-blue-200 p-4">
            <a
              href="https://www.linkedin.com/in/kyle-park-io"
              target=""
              rel="noopener noreferrer"
            >
              링크드인
            </a>
          </div>
          <div class="bg-blue-200 p-4">
            <a
              href="https://github.com/kyle-park-io"
              target=""
              rel="noopener noreferrer"
            >
              깃허브
            </a>
          </div>
          <div class="bg-blue-200 p-4">방명록</div>
          <div class="bg-blue-200 p-4">공지사항</div>
        </div>
      </div>

      {/* <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p> */}
    </>
  );
};

export default App;
