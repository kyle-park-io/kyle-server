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
      <div class="flex-grow flex flex-col">
        <div>
          <h1 class="underline">Hello world!</h1>
        </div>
        <div class="flex-grow center-flex">
          <div class="w-full grid grid-cols-3 gap-2">
            <div class="w-full h-[100px] bg-blue-200 center-flex">
              <a href={`${url}/blog`}>블로그</a>
            </div>
            <div class="w-full h-[100px] bg-blue-200 center-flex">CAREER</div>
            <div class="w-full h-[100px] bg-blue-200 center-flex">DEX</div>
            <div class="w-full h-[100px] bg-blue-200 center-flex">
              <a
                href="https://www.linkedin.com/in/kyle-park-io"
                target=""
                rel="noopener noreferrer"
              >
                LINKEDIN
              </a>
            </div>
            <div class="w-full h-[100px] bg-blue-200 center-flex">
              <a
                href="https://github.com/kyle-park-io"
                target=""
                rel="noopener noreferrer"
              >
                GITHUB
              </a>
            </div>
            <div class="w-full h-[100px] bg-blue-200 center-flex">
              ANONYMOUS<br></br>CHAT
            </div>
          </div>
          {/* <p class="read-the-docs">
            Click on the Vite and Solid logos to learn more
          </p> */}
        </div>
      </div>
    </>
  );
};

export default App;
