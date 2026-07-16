import { defineConfig } from 'vitest/config';
import path from 'path';
export default defineConfig({
  test: {
    globals: true, environment: 'node',
    alias: {
      '@agentx/shared': path.resolve(__dirname, '../shared/src/index.ts'),
      '@agentx/core-runtime': path.resolve(__dirname, '../core-runtime/src/index.ts'),
      '@agentx/tool-sdk': path.resolve(__dirname, '../tool-sdk/src/index.ts'),
      '@agentx/agent-platform': path.resolve(__dirname, '../agent-platform/src/index.ts'),
      '@agentx/workflow-engine': path.resolve(__dirname, '../workflow-engine/src/index.ts'),
      '@agentx/context-engine': path.resolve(__dirname, '../context-engine/src/index.ts'),
      '@agentx/memory-engine': path.resolve(__dirname, '../memory-engine/src/index.ts'),
      '@agentx/knowledge-engine': path.resolve(__dirname, '../knowledge-engine/src/index.ts'),
      '@agentx/planning-engine': path.resolve(__dirname, '../planning-engine/src/index.ts'),
    },
    coverage: {
      provider: 'v8', reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'], exclude: ['src/index.ts', 'src/**/*.test.ts'],
      thresholds: { lines: 95, functions: 90, branches: 90, statements: 95 },
    },
  },
});
