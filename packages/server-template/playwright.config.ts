import 'dotenv';
import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './src/app/',
  testMatch: '**/*.e2e.test.ts',
  use: {
    baseURL: `${process.env.ENDPOINT}:${process.env.PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
