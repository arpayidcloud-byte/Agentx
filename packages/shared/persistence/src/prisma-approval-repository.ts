import { PrismaClient } from '@prisma/client';

export interface ApprovalModel {
  id: string;
  taskId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  approvedBy?: string;
  decidedAt?: Date;
  createdAt: Date;
}

export interface IApprovalRepository {
  save(approval: ApprovalModel): Promise<void>;
  findByTaskId(taskId: string): Promise<ApprovalModel | undefined>;
  approve(taskId: string, approvedBy: string, reason?: string): Promise<void>;
  reject(taskId: string, approvedBy: string, reason: string): Promise<void>;
}

export class PrismaApprovalRepository implements IApprovalRepository {
  constructor(private prisma: PrismaClient) {}

  async save(approval: ApprovalModel): Promise<void> {
    await this.prisma.approval.upsert({
      where: { taskId: approval.taskId },
      update: {
        status: approval.status,
        reason: approval.reason,
        approvedBy: approval.approvedBy,
        decidedAt: approval.decidedAt,
      },
      create: {
        id: approval.id,
        taskId: approval.taskId,
        status: approval.status,
        reason: approval.reason,
        approvedBy: approval.approvedBy,
        decidedAt: approval.decidedAt,
        createdAt: approval.createdAt,
      },
    });
  }

  async findByTaskId(taskId: string): Promise<ApprovalModel | undefined> {
    const approval = await this.prisma.approval.findUnique({
      where: { taskId },
    });
    return approval ? this.toApprovalModel(approval) : undefined;
  }

  async approve(taskId: string, approvedBy: string, reason?: string): Promise<void> {
    await this.prisma.approval.update({
      where: { taskId },
      data: {
        status: 'APPROVED',
        approvedBy,
        reason,
        decidedAt: new Date(),
      },
    });
  }

  async reject(taskId: string, approvedBy: string, reason: string): Promise<void> {
    await this.prisma.approval.update({
      where: { taskId },
      data: {
        status: 'REJECTED',
        approvedBy,
        reason,
        decidedAt: new Date(),
      },
    });
  }

  private toApprovalModel(prismaApproval: any): ApprovalModel {
    return {
      id: prismaApproval.id,
      taskId: prismaApproval.taskId,
      status: prismaApproval.status,
      reason: prismaApproval.reason,
      approvedBy: prismaApproval.approvedBy,
      decidedAt: prismaApproval.decidedAt,
      createdAt: prismaApproval.createdAt,
    };
  }
}
