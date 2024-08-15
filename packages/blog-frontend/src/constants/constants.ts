import { createStore } from 'solid-js/store';

const isProd = process.env.NODE_ENV === 'production';

const [globalState, setGlobalState] = createStore({
  url: isProd ? 'https://jungho.dev' : 'http://localhost:3000',
  api_url: 'https://jungho.dev/api-blog',
  grpc_url: isProd ? 'https://jungho.dev/api-chat' : '/api-chat',
});

export { globalState, setGlobalState };
