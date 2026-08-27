module.exports = {
  default: {
    paths: [
      'tests/e2e/features/**/*.feature'
    ],

    requireModule: [
      'tsx/cjs'
    ],

    require: [
      'tests/e2e/steps/**/*.ts',
      'tests/e2e/support/**/*.ts'
    ],

    format: [
      'progress',
      'allure-cucumberjs/reporter'
    ],

    formatOptions: {
      resultsDir: 'allure-results',
      environmentInfo: {
        framework: 'Cucumber.js + Playwright',
        browser: 'Chromium',
        node_version: process.version
      }
    },

    parallel: 1
  }
};