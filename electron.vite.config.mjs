import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

// 开发环境：Vite 的 HMR 需要 WebSocket（connect-src），
// 心跳检测会用 blob SharedWorker（worker-src blob:），React Refresh 需要内联脚本。
const CSP_DEV = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' ws: wss: http: https:"
].join('; ')

// 生产环境：只允许本地资源，不放开内联脚本与外网连接。
const CSP_PROD = [
  "default-src 'self'",
  "script-src 'self'",
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'"
].join('; ')

function injectCsp() {
  let isDev = false
  return {
    name: 'inject-csp',
    configResolved(config) {
      isDev = config.command === 'serve'
    },
    transformIndexHtml(html) {
      const content = isDev ? CSP_DEV : CSP_PROD
      return html.replace(
        '<!--csp-placeholder-->',
        `<meta http-equiv="Content-Security-Policy" content="${content}" />`
      )
    }
  }
}

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), injectCsp()]
  }
})
