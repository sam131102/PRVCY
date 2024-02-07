/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ['..//src'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  verbose: true,
  coverageThreshold:{
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};