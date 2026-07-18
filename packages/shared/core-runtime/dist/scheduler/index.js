import { TaskStatus } from '../interfaces/task.js';
import { EventTopic } from '../interfaces/events.js';
import { TaskStateMachine } from '../state-machine/index.js';
import { TaskNotFoundError } from '../errors.js';
export class Scheduler {
    eventBus;
    taskRepo;
    inFlightTasks = new Map();
    pausedTasks = new Set();
    activeCount = 0;
    maxParallel;
    constructor(eventBus, taskRepo, config = {}) {
        this.eventBus = eventBus;
        this.taskRepo = taskRepo;
        this.maxParallel = config.maxParallelAgents ?? 10;
    }
    async enqueue(task) {
        if (task.status === TaskStatus.CREATED ||
            task.status === TaskStatus.FAILED ||
            task.status === TaskStatus.RETRYING) {
            task = TaskStateMachine.transition(task, TaskStatus.QUEUED);
            await this.taskRepo.save(task);
            await this.eventBus.publish(EventTopic.TASK_QUEUED, task, task.traceId, task.id);
            this.inFlightTasks.set(task.id, task);
            await this.dispatch();
        }
    }
    async pause(taskId) {
        const task = this.inFlightTasks.get(taskId) || (await this.taskRepo.findById(taskId));
        if (!task)
            throw new TaskNotFoundError(taskId);
        this.pausedTasks.add(taskId);
        if (task.status === TaskStatus.RUNNING) {
            task.status = TaskStatus.WAITING_APPROVAL;
            await this.taskRepo.save(task);
            await this.eventBus.publish(EventTopic.TASK_WAITING_APPROVAL, task, task.traceId, task.id);
        }
    }
    async resume(taskId) {
        if (!this.pausedTasks.has(taskId))
            return;
        this.pausedTasks.delete(taskId);
        const task = this.inFlightTasks.get(taskId) || (await this.taskRepo.findById(taskId));
        if (!task)
            throw new TaskNotFoundError(taskId);
        if (task.status === TaskStatus.WAITING_APPROVAL) {
            task.status = TaskStatus.RUNNING;
            await this.taskRepo.save(task);
            await this.eventBus.publish(EventTopic.TASK_STARTED, task, task.traceId, task.id);
            await this.dispatch();
        }
    }
    async cancel(taskId, reason) {
        const task = this.inFlightTasks.get(taskId) || (await this.taskRepo.findById(taskId));
        if (!task)
            throw new TaskNotFoundError(taskId);
        task.cancellation = {
            reason,
            requestedBy: 'operator',
            timestamp: new Date(),
        };
        task.status = TaskStatus.CANCELLED;
        task.updatedAt = new Date();
        await this.taskRepo.save(task);
        await this.eventBus.publish(EventTopic.TASK_CANCELLED, task, task.traceId, task.id);
        this.inFlightTasks.delete(taskId);
        this.pausedTasks.delete(taskId);
        if (this.activeCount > 0)
            this.activeCount--;
        await this.dispatch();
    }
    async dispatch() {
        for (const [taskId, task] of this.inFlightTasks.entries()) {
            if (this.activeCount >= this.maxParallel)
                break;
            if (this.pausedTasks.has(taskId))
                continue;
            if (task.status === TaskStatus.QUEUED) {
                task.status = TaskStatus.RUNNING;
                this.activeCount++;
                await this.taskRepo.save(task);
                await this.eventBus.publish(EventTopic.TASK_STARTED, task, task.traceId, task.id);
            }
        }
    }
    async completeTask(taskId, result) {
        const task = this.inFlightTasks.get(taskId);
        if (!task)
            return;
        task.result = result;
        task.status = TaskStatus.COMPLETED;
        task.updatedAt = new Date();
        await this.taskRepo.save(task);
        await this.eventBus.publish(EventTopic.TASK_COMPLETED, task, task.traceId, task.id);
        this.inFlightTasks.delete(taskId);
        this.activeCount--;
        await this.dispatch();
    }
    async failTask(taskId, error) {
        const task = this.inFlightTasks.get(taskId);
        if (!task)
            return;
        task.error = error;
        task.status = TaskStatus.FAILED;
        task.updatedAt = new Date();
        await this.taskRepo.save(task);
        await this.eventBus.publish(EventTopic.TASK_FAILED, task, task.traceId, task.id);
        this.inFlightTasks.delete(taskId);
        this.activeCount--;
        await this.dispatch();
    }
}
//# sourceMappingURL=index.js.map