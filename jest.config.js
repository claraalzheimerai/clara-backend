/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^uuid$': '<rootDir>/src/tests/__mocks__/uuid.ts',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/tests/**',
    '!src/server.ts',
  ],
  coverageThreshold: {
    global: {
      lines:     60,
      functions: 55,
    },
  },
  verbose: true,
};