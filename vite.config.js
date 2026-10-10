import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Browsers cannot call Ollama directly (CORS), so /ollama is proxied to the local server.
// The Origin header is dropped so the app also works when opened from a phone on the same Wi-Fi.
const ollama = {
  '/ollama': {
    target: process.env.OLLAMA_HOST || 'http://localhost:11434',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/ollama/, ''),
    configure: (proxy) => proxy.on('proxyReq', (req) => req.removeHeader('origin')),
    timeout: 200_000,
    proxyTimeout: 200_000,
  },
};

export default defineConfig({
  plugins: [react()],
  server: { proxy: ollama, host: true },
  preview: { proxy: ollama, host: true },
});
