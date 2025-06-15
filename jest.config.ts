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
    '<rootDir>/pages/**/*.{ts,tsx}',
    '<rootDir>/__test__/**/*.{ts,tsx}',
    '<rootDir>/app/**/*.{ts,tsx}',
    '<rootDir>/app/components/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/styles/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testEnvironment: 'jsdom',
  testMatch: ['**/__test__/**/*.spec.ts', '**/__test__/**/*.spec.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@clientComponents/(.*)$': '<rootDir>/app/clientComponents/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    // Fix for @testing-library modules
    '^@testing-library/(.*)$': '@testing-library/$1',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!(next-auth|@auth|@testing-library|@mui|jest-axe|axe-core)/)',
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
