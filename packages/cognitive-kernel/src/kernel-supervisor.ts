/**
 * @module cognitive-kernel/kernel-supervisor
 * @description Health monitoring and anomaly tracking.
 */

export class KernelSupervisor {
  private components = new Map<string, () => boolean>();

  registerComponent(name: string, checkFn: () => boolean): void {
    this.components.set(name, checkFn);
  }

  checkHealth(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    for (const [name, fn] of this.components.entries()) {
      status[name] = fn();
    }
    return status;
  }

  isSystemHealthy(): boolean {
    const statuses = this.checkHealth();
    return Object.values(statuses).every(Boolean);
  }
}
