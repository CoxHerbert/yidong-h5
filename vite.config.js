import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV, VITE_OUTPUT_DIR, VITE_APP_BASE_API, VITE_APP_API_BASE_URL } = env
  return {
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    // 打包配置
    build: {
      outDir: VITE_OUTPUT_DIR,
    },
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            apiUrl:
              VITE_APP_ENV === 'production'
                ? VITE_APP_API_BASE_URL + VITE_APP_BASE_API
                : VITE_APP_API_BASE_URL,
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // vite 相关配置
    server: {
      port: 5173,
      host: true,
      open: true,
      proxy: {
        [`/dev-api`]: {
          target: VITE_APP_API_BASE_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(new RegExp(`/dev-api`), ''),
        },
        [`/api`]: {
          target: VITE_APP_API_BASE_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(new RegExp(`/api`), ''),
        },
      },
    },
  }
})
