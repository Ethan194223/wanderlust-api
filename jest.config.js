/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // load .env for every test run
  setupFiles: ['dotenv/config'],

  // allow `import foo from "@/utils/foo"`
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // discover all *.test.ts files under /tests
  testMatch: ['**/tests/**/*.test.ts'],

  // optional, but shows each test name in the console
  verbose: true,
};

