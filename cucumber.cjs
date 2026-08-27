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
      'progress'
    ],
    parallel: 1
  }
};