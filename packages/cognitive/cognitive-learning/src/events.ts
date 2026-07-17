/**
 * @module cognitive-learning/events
 * @description Learning-specific event bus.
 */

export class LearningEventBus {
  private listeners = new Map<string, Function[]>();

  publish(type: string, payload: unknown): void {
    const list = this.listeners.get(type) || [];
    for (const fn of list) fn(payload);
  }

  subscribe(type: string, fn: Function): void {
    const current = this.listeners.get(type) || [];
    this.listeners.set(type, [...current, fn]);
  }

  clear(): void {
    this.listeners.clear();
  }
}
