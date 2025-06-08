import type { Config } from 'jest'

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/layout.tsx',
    '!app/**/loading.tsx',
    '!app/**/not-found.tsx',
    '!app/**/error.tsx',
    '!app/**/page.tsx',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__test__/**/*.spec.ts', '**/__test__/**/*.spec.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@clientComponents/(.*)$': '<rootDir>/app/clientComponents/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(next-auth|@auth|@testing-library|@mui)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
}

export default config
