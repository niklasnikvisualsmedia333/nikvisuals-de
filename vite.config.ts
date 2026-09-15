import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
export default defineConfig(({ mode, isSsrBuild }) => {
 const env = loadEnv(mode, process.cwd(), 'VITE_');
 const base = env.VITE_BASE_PATH || '/nikvisuals-de/';
 if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('VITE_BASE_PATH must start and end with /');
 return { base, plugins: [react(), tailwindcss()], build: { rollupOptions: isSsrBuild ? {} : { input: { de: resolve('index.html'), en: resolve('en/index.html'), links: resolve('links/index.html'), enLinks: resolve('en/links/index.html'), videos: resolve('videos/index.html'), enVideos: resolve('en/videos/index.html') } } } };
});
