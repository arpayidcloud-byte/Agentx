import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/provider-sdk.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/conformance/**/*.ts'],
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 95,
        functions: 75,
        branches: 90,
        statements: 95,
      },
    },
  },
});
