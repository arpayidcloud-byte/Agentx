/**
 * @module native-providers/providers/nats-queue
 * @description Native NATS PubSub and streaming queue provider wrapper (Stub implementation).
 */

import { IQueueProvider, ProviderMetadata, ProviderCapabilities, ProviderHealth, ProviderMetrics } from '@agentx/runtime-adapters';
import { IConfigurationProvider, INativeProvider } from '../interfaces.js';
import { ConfigurationError } from '../errors.js';

export class NATSQueueProvider implements IQueueProvider, INativeProvider {
  id = 'nats-queue';
  name = 'NATS Queue Provider';
  private connected = false;
  private config!: IConfigurationProvider;

  async initialize(config: IConfigurationProvider): Promise<void> {
    this.config = config;
    if (!this.config.has('NATS_URL')) {
      throw new ConfigurationError('NATS_URL is required for NATS', this.id);
    }
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async getHealth() {
    return { status: this.connected ? 'UP' : 'DOWN' as const, latencyMs: 4 };
  }

  getMetadata(): ProviderMetadata {
    return { id: this.id, name: this.name, type: 'queue', version: '1.0.0' };
  }

  getCapabilities(): ProviderCapabilities {
    return { priorityQueue: false };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return { healthy: this.connected, latencyMs: 4, lastChecked: new Date(), status: this.connected ? 'ACTIVE' : 'DOWN' };
  }

  getMetrics(): ProviderMetrics {
    return { totalRequests: 0, successfulRequests: 0, failedRequests: 0, averageLatencyMs: 0 };
  }

  async enqueue(topic: string, message: unknown, priority?: number): Promise<void> {}
  async dequeue(topic: string): Promise<unknown | undefined> { return undefined; }
  async peek(topic: string): Promise<unknown | undefined> { return undefined; }
  async ack(topic: string, messageId: string): Promise<void> {}
  async retry(topic: string, messageId: string): Promise<void> {}
  async deadLetter(topic: string, messageId: string): Promise<void> {}
  async getDepth(topic: string): Promise<number> { return 0; }
  async purge(topic: string): Promise<void> {}
}
