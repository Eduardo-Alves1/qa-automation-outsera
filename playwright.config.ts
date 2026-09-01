import { defineConfig } from '@playwright/test';
import os from 'node:os';
import {
  environmentConfig,
  testEnvironment
} from './config/environments';

export default defineConfig({
  testDir: './tests',

  timeout: 30_000,

  expect: {
    timeout: 5_000
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
          test_environment: testEnvironment,
          os_platform: os.platform(),
          os_release: os.release(),
          node_version: process.version,
          base_url: environmentConfig.api.baseUrl
        }
      }
    ]
  ],

  use: {
    baseURL: environmentConfig.api.baseUrl,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    trace: 'retain-on-failure'
  }
});
