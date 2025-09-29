import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-fixed-jsdom",
  setupFiles: ["<rootDir>/src/jest.globalSetup.ts"], // run once before all test suites
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"], // run before each test suite
  globalTeardown: "<rootDir>/src/jest.globalTeardown.ts", // run once after all test suites
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};

export default config;
