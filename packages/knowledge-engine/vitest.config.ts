import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@agentx/shared': path.resolve(__dirname, '../shared/src/index.ts'),
      '@agentx/core-runtime': path.resolve(__dirname, '../core-runtime/src/index.ts'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/**/*.test.ts'],
      thresholds: {
        lines: 95,
        functions: 100,
        branches: 90,
        statements: 95,
      },
    },
  },
});
