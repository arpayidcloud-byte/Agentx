import type { IEventRepository, EventModel } from '@agentx/core-runtime';
import { PrismaClient } from '../prisma/client/index.js';

export class PrismaEventRepository implements IEventRepository {
  constructor(private prisma: PrismaClient) {}

  async save(event: EventModel): Promise<void> {
    await this.prisma.event.create({
      data: {
        id: event.id,
        topic: event.topic,
        payload: event.payload as any,
        taskId: event.taskId,
        createdAt: event.createdAt || new Date(),
      },
    });
  }

  async findByTaskId(taskId: string): Promise<EventModel[]> {
    const events = await this.prisma.event.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    });
    return events.map(e => this.toEventModel(e));
  }

  async findByTopic(topic: string, limit?: number): Promise<EventModel[]> {
    const events = await this.prisma.event.findMany({
      where: { topic },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return events.map(e => this.toEventModel(e));
  }

  private toEventModel(prismaEvent: any): EventModel {
    return {
      id: prismaEvent.id,
      topic: prismaEvent.topic,
      payload: prismaEvent.payload as any,
      taskId: prismaEvent.taskId,
      createdAt: prismaEvent.createdAt,
    };
  }
}
