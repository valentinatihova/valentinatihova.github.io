import { defineConfig, devices } from '@playwright/test';

// Smoke tests against the built site (run `npm run build` first).
export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4321' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    // --ignore-lock keeps the server in the foreground; Astro 7 backgrounds it when it detects a coding agent.
    command: 'npx astro preview --port 4321 --ignore-lock',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
