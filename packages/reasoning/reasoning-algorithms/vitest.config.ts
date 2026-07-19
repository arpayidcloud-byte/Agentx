import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/reasoning-algorithms.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 98,
        functions: 98,
        branches: 85,
        statements: 98,
      },
    },
  },
});
