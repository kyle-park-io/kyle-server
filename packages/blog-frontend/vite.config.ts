import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/blog-static',
  plugins: [solid(), svgr()],
  css: { postcss: './postcss.config.js' },
  build: {
    outDir: 'static',
    rollupOptions: {
      // input: {
      //   main: '/src/main.tsx',
      //   // myStaticPage: '/public/myStaticPage.html', // 정적 페이지 경로 추가
      // },
      output: {
        entryFileNames: `assets/[name].blog.js`, // JavaScript 파일의 이름 패턴
        chunkFileNames: `assets/[name].blog.js`, // 비동기 청크 파일의 이름 패턴
        assetFileNames: `assets/[name].blog.[ext]`, // CSS, 이미지 등의 파일 이름 패턴
      },
    },
  },
});
