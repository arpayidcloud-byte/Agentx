/**
 * @module runtime-production/graceful-shutdown-manager
 * @description Manages process termination and resource cleanup.
 */

import { ShutdownError } from './errors.js';

export type ShutdownHook = () => Promise<void>;

export class GracefulShutdownManager {
  private hooks: ShutdownHook[] = [];
  private isShuttingDown = false;

  registerHook(hook: ShutdownHook): void {
    this.hooks.push(hook);
  }

  async initiateShutdown(_reason: string): Promise<void> {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;

    for (const hook of this.hooks) {
      try {
        await hook();
      } catch (error) {
        throw new ShutdownError(
          `Shutdown hook failed: ${(error as Error).message}`,
          'shutdown-manager',
        );
      }
    }
  }

  isShutdown(): boolean {
    return this.isShuttingDown;
  }

  clear(): void {
    this.hooks = [];
    this.isShuttingDown = false;
  }
}
