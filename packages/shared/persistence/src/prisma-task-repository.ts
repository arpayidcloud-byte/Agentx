import type { ITaskRepository, TaskModel, TaskStatus } from '@agentx/core-runtime';
import { PrismaClient } from '@prisma/client';

export class PrismaTaskRepository implements ITaskRepository {
  constructor(private prisma: PrismaClient) {}

  async save(task: TaskModel): Promise<void> {
    await this.prisma.task.upsert({
      where: { id: task.id },
      update: {
        goal: task.goal,
        status: task.status,
        priority: task.priority,
        parentTaskId: task.parentTaskId,
        rootTaskId: task.rootTaskId,
        assignedAgentRole: task.assignedAgentRole,
        dependsOn: task.dependsOn,
        traceId: task.traceId,
        metadata: task.metadata as any,
        context: task.context as any,
        result: task.result as any,
        error: task.error as any,
        completedAt: task.completedAt,
        updatedAt: new Date(),
      },
      create: {
        id: task.id,
        goal: task.goal,
        status: task.status,
        priority: task.priority,
        parentTaskId: task.parentTaskId,
        rootTaskId: task.rootTaskId,
        assignedAgentRole: task.assignedAgentRole,
        dependsOn: task.dependsOn,
        traceId: task.traceId,
        metadata: task.metadata as any,
        context: task.context as any,
        result: task.result as any,
        error: task.error as any,
        completedAt: task.completedAt,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<TaskModel | undefined> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { events: true },
    });
    return task ? this.toTaskModel(task) : undefined;
  }

  async findByRootId(rootId: string): Promise<TaskModel[]> {
    const tasks = await this.prisma.task.findMany({
      where: { rootTaskId: rootId },
      orderBy: { createdAt: 'asc' },
    });
    return tasks.map((t: any) => this.toTaskModel(t));
  }

  getAll(): TaskModel[] {
    return [];
  }

  private toTaskModel(prismaTask: any): TaskModel {
    return {
      id: prismaTask.id,
      goal: prismaTask.goal,
      status: prismaTask.status as TaskStatus,
      priority: prismaTask.priority,
      parentTaskId: prismaTask.parentTaskId,
      rootTaskId: prismaTask.rootTaskId,
      assignedAgentRole: prismaTask.assignedAgentRole,
      dependsOn: prismaTask.dependsOn,
      traceId: prismaTask.traceId,
      metadata: prismaTask.metadata as any,
      context: prismaTask.context as any,
      result: prismaTask.result as any,
      error: prismaTask.error as any,
      completedAt: prismaTask.completedAt,
      createdAt: prismaTask.createdAt,
      updatedAt: prismaTask.updatedAt,
    };
  }
}
