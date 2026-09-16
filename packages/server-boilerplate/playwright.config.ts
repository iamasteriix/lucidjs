import { defineConfig, } from '@playwright/test';
import { config } from 'dotenv';


config({ path: '.env.test', });

const baseURL = `${process.env.ENDPOINT}:${process.env.PORT}`;


export default defineConfig({
  testDir: './src/app/',
  testMatch: '**/*.e2e.test.ts',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx tsx watch --env-file=.env.test --import ./src/telemetry/index.ts src/index.ts',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
