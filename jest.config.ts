import nextJest from 'next/jest'
import type { Config } from 'jest'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '<rootDir>/app/**/*.{ts,tsx}',
    '<rootDir>/components/**/*.{ts,tsx}',
    '<rootDir>/lib/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/styles/**',
    '!<rootDir>/__test__/**/*.{ts,tsx}',
    '!<rootDir>/pages/**/*.{ts,tsx}',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__test__/**/*.spec.ts',
    '**/__test__/**/*.spec.tsx',
    '**/__test__/**/*.test.ts',
    '**/__test__/**/*.test.tsx',
  ],
  testTimeout: 30000, // 30 seconds timeout to prevent hanging
  maxWorkers: 1, // Use single worker to avoid resource conflicts
  detectOpenHandles: true, // Helps identify what's keeping the process alive
  forceExit: true, // Force exit after tests complete
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@clientComponents/(.*)$': '<rootDir>/app/clientComponents/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@serverComponents/(.*)$': '<rootDir>/components/$1',
    '^@context/(.*)$': '<rootDir>/app/context/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!(next-auth|@auth|@testing-library|@mui|jest-axe|axe-core|react-jsx-runtime|@next-auth)/)',
  ],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  verbose: true,
}

export default createJestConfig(customJestConfig)
