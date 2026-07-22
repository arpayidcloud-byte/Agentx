
import { PrismaClient } from '@prisma/client';

export interface EventModel {
  id: string;
  topic: string;
  payload: Record<string, unknown>;
  taskId?: string;
  createdAt: Date;
}

export interface IEventRepository {
  save(event: EventModel): Promise<void>;
  findByTaskId(taskId: string): Promise<EventModel[]>;
  findByTopic(topic: string, limit?: number): Promise<EventModel[]>;
}

export class PrismaEventRepository implements IEventRepository {
  constructor(private prisma: PrismaClient) {}

  async save(event: EventModel): Promise<void> {
    await this.prisma.event.create({
      data: {
        id: event.id,
        topic: event.topic,
        payload: event.payload,
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
    return events.map((e: any) => this.toEventModel(e));
  }

  async findByTopic(topic: string, limit?: number): Promise<EventModel[]> {
    const events = await this.prisma.event.findMany({
      where: { topic },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return events.map((e: any) => this.toEventModel(e));
  }

  private toEventModel(prismaEvent: any): EventModel {
    return {
      id: prismaEvent.id,
      topic: prismaEvent.topic,
      payload: prismaEvent.payload as Record<string, unknown>,
      taskId: prismaEvent.taskId,
      createdAt: prismaEvent.createdAt,
    };
  }
}
