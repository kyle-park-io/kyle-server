import { createStore } from 'solid-js/store';

const isProd = true;

const [globalState, setGlobalState] = createStore({
  url: isProd ? 'https://jungho.dev' : 'http://localhost:3000',
  api_url: 'https://jungho.dev/api-blog',
});

export { globalState, setGlobalState };
