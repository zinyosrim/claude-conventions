import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke-Test gegen die gebaute App (`vite preview`). Mobile first: das Handy
 * mit 390 px Breite ist das erste Projekt, der Desktop kommt danach.
 */
export default defineConfig({
  testDir: 'test/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4189',
    serviceWorkers: 'block',
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
  },
  projects: [
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
        defaultBrowserType: 'chromium',
      },
    },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm exec vite preview --port 4189 --strictPort',
    url: 'http://localhost:4189',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
