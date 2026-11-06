import path from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// For a project site on GitHub Pages set VITE_BASE=/<repo>/ at build time.
// For a user site or a custom domain the default "/" is correct.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  // Fixed port so the VS Code launch configurations can always find the site.
  server: { port: 5180, strictPort: true },
  test: { environment: 'node', include: ['src/**/*.test.{ts,tsx}'] },
});
