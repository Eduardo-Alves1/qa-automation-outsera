import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({

  testDir: './tests',

  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  fullyParallel: true,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  use: {
    baseURL: process.env.BASE_API_URL,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
});