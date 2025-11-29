import { createStore } from 'solid-js/store';

const isProd = process.env.NODE_ENV === 'production';

const [globalState, setGlobalState] = createStore({
  ingress_reverse_proxy_url: isProd
    ? 'https://jungho.dev'
    : 'http://localhost:8080',
  ingress_reverse_proxy_websocket_url: isProd
    ? 'wss://jungho.dev'
    : 'ws://localhost:8080',
  url: isProd ? 'https://jungho.dev' : 'http://localhost:3002',
  api_url: 'https://jungho.dev/api-blog',
  grpc_url: isProd ? 'https://jungho.dev/api-chat' : '/api-chat',
});

export { globalState, setGlobalState };
