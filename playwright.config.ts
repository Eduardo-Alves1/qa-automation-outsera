import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import os from 'node:os';

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
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          node_version: process.version,
          baseUrl: process.env.BASE_API_URL,
          playwright_version: process.env.PLAYWRIGHT_VERSION,
        }
      }
    ]
  ],

  use: {
    baseURL: process.env.BASE_API_URL,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    trace: 'retain-on-failure',
  }
});