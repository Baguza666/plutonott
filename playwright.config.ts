import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:8923',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'desktop-1440',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 }
      },
    },
    {
      name: 'mobile-320',
      use: { 
        ...devices['iPhone SE'], // Proche de 320x568
        viewport: { width: 320, height: 568 }
      },
    },
    {
      name: 'mobile-375',
      use: { 
        ...devices['iPhone 11'],
        viewport: { width: 375, height: 667 }
      },
    },
    {
      name: 'mobile-390',
      use: { 
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 }
      },
    },
    {
      name: 'tablet-768',
      use: { 
        ...devices['iPad (gen 7)'],
        viewport: { width: 768, height: 1024 }
      },
    },
    {
      name: 'no-js',
      use: { 
        ...devices['Desktop Chrome'],
        javaScriptEnabled: false 
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npx serve out -l 8923',
    url: 'http://localhost:8923',
    reuseExistingServer: !process.env.CI,
  },
});
