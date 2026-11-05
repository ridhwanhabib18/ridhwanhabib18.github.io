import { defineConfig } from '@playwright/test';

// Layout tests run against the built site (`npm run build` first), served by `vite preview` on port 4180.
// They use the browser already installed on the machine (no download): Edge on Windows, Chrome elsewhere.
// Override with PW_CHANNEL=chrome|msedge.
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4180',
    channel: process.env.PW_CHANNEL ?? (process.platform === 'win32' ? 'msedge' : 'chrome'),
  },
  webServer: {
    command: 'npm run preview -- --port 4180 --strictPort',
    url: 'http://localhost:4180',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
