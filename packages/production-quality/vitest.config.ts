import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/production-quality.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 95,
        functions: 80,
        branches: 80,
        statements: 95,
      },
    },
  },
});
