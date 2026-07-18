/**
 * @module runtime-production/queue-adapter
 * @description Persistent queue adapters with multiple message queue providers.
 */

import type { QueueMessage } from './interfaces.js';
import { QueueError } from './errors.js';

export interface IExecutionQueue {
  enqueue(msg: QueueMessage): Promise<void>;
  dequeue(): Promise<QueueMessage | undefined>;
  ack(id: string): Promise<void>;
  retry(id: string): Promise<void>;
}

export class MemoryQueue implements IExecutionQueue {
  private queue: QueueMessage[] = [];
  private deadLetterQueue: QueueMessage[] = [];

  async enqueue(msg: QueueMessage): Promise<void> {
    this.queue.push(msg);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  async dequeue(): Promise<QueueMessage | undefined> {
    const msg = this.queue.shift();
    if (msg) {
      msg.status = 'PROCESSING';
    }
    return msg;
  }

  async ack(id: string): Promise<void> {
    const idx = this.queue.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.queue.splice(idx, 1);
    }
  }

  async retry(id: string): Promise<void> {
    const msg = this.queue.find((m) => m.id === id);
    if (msg) {
      msg.retryCount++;
      if (msg.retryCount > 3) {
        msg.status = 'FAILED';
        this.deadLetterQueue.push(msg);
        this.queue = this.queue.filter((m) => m.id !== id);
      } else {
        msg.status = 'PENDING';
      }
    }
  }

  getDlq(): QueueMessage[] {
    return [...this.deadLetterQueue];
  }
}

export class BullMQAdapter implements IExecutionQueue {
  async enqueue(_msg: QueueMessage): Promise<void> {
    throw new QueueError('BullMQAdapter not implemented', 'queue-adapter');
  }
  async dequeue(): Promise<QueueMessage | undefined> {
    throw new QueueError('BullMQAdapter not implemented', 'queue-adapter');
  }
  async ack(_id: string): Promise<void> {
    throw new QueueError('BullMQAdapter not implemented', 'queue-adapter');
  }
  async retry(_id: string): Promise<void> {
    throw new QueueError('BullMQAdapter not implemented', 'queue-adapter');
  }
}

export class NATSAdapter implements IExecutionQueue {
  async enqueue(_msg: QueueMessage): Promise<void> {
    throw new QueueError('NATSAdapter not implemented', 'queue-adapter');
  }
  async dequeue(): Promise<QueueMessage | undefined> {
    throw new QueueError('NATSAdapter not implemented', 'queue-adapter');
  }
  async ack(_id: string): Promise<void> {
    throw new QueueError('NATSAdapter not implemented', 'queue-adapter');
  }
  async retry(_id: string): Promise<void> {
    throw new QueueError('NATSAdapter not implemented', 'queue-adapter');
  }
}

export class TemporalAdapter implements IExecutionQueue {
  async enqueue(_msg: QueueMessage): Promise<void> {
    throw new QueueError('TemporalAdapter not implemented', 'queue-adapter');
  }
  async dequeue(): Promise<QueueMessage | undefined> {
    throw new QueueError('TemporalAdapter not implemented', 'queue-adapter');
  }
  async ack(_id: string): Promise<void> {
    throw new QueueError('TemporalAdapter not implemented', 'queue-adapter');
  }
  async retry(_id: string): Promise<void> {
    throw new QueueError('TemporalAdapter not implemented', 'queue-adapter');
  }
}
