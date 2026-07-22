import type { ITaskRepository, TaskModel, TaskStatus, TaskPriority } from '@agentx/core-runtime';
import type { PrismaClient } from '@prisma/client';

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
        metadata: task.metadata as unknown as TaskMetadata,
        context: task.context as unknown as TaskContext,
        result: task.result as unknown as TaskResult,
        error: task.error as unknown as TaskError,
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
        metadata: task.metadata as unknown as TaskMetadata,
        context: task.context as unknown as TaskContext,
        result: task.result as unknown as TaskResult,
        error: task.error as unknown as TaskError,
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
    return tasks.map((t: Record<string, unknown>) => this.toTaskModel(t));
  }

  getAll(): TaskModel[] {
    return [];
  }

  private toTaskModel(prismaTask: Record<string, unknown>): TaskModel {
    return {
      id: prismaTask.id as string,
      goal: prismaTask.goal as string,
      status: prismaTask.status as TaskStatus,
      priority: prismaTask.priority as TaskPriority,
      parentTaskId: prismaTask.parentTaskId as string | undefined,
      rootTaskId: prismaTask.rootTaskId as string,
      assignedAgentRole: prismaTask.assignedAgentRole as string | undefined,
      dependsOn: prismaTask.dependsOn as string[],
      traceId: prismaTask.traceId as string,
      metadata: prismaTask.metadata as unknown as TaskMetadata,
      context: prismaTask.context as unknown as TaskContext,
      result: prismaTask.result as unknown as TaskResult,
      error: prismaTask.error as unknown as TaskError,
      createdAt: prismaTask.createdAt as Date,
      updatedAt: prismaTask.updatedAt as Date,
    };
  }
}
