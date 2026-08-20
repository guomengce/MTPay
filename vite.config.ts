import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *; @use "@/styles/breakpoints.scss" as *;`,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    // 代理端固定使用 9528，避免与管理端 9527 冲突。
    port: 9528,
    strictPort: true,
  },
});
