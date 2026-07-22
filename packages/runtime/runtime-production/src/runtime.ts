import { PrismaClient } from '@prisma/client';
import {
  PrismaTaskRepository,
  PrismaEventRepository,
  PrismaApprovalRepository,
} from '@agentx/persistence';
import { BullMQProvider, RedisLockProvider } from '@agentx/runtime-adapters';
import { Scheduler, InMemoryEventBus } from '@agentx/core-runtime';

export class ProductionRuntime {
  public prisma: PrismaClient;
  public taskRepo: PrismaTaskRepository;
  public eventRepo: PrismaEventRepository;
  public approvalRepo: PrismaApprovalRepository;
  public queue: BullMQProvider;
  public lock: RedisLockProvider;
  public scheduler: Scheduler;
  public eventBus: InMemoryEventBus; // Until we make a BullMQ bus

  constructor(redisUrl: string = 'redis://localhost:6379') {
    this.prisma = new PrismaClient();
    this.taskRepo = new PrismaTaskRepository(this.prisma);
    this.eventRepo = new PrismaEventRepository(this.prisma);
    this.approvalRepo = new PrismaApprovalRepository(this.prisma);
    this.queue = new BullMQProvider(redisUrl);
    this.lock = new RedisLockProvider(redisUrl);
    this.eventBus = new InMemoryEventBus();

    this.scheduler = new Scheduler(this.eventBus, this.taskRepo);
  }

  async start() {
    await this.prisma.$connect();
    // Add health checks...
  }

  async stop() {
    await this.prisma.$disconnect();
  }
}
