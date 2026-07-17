import { ILogger } from '@agentx/shared';
import { CredentialResolver } from '@agentx/secrets';
import { TaskModel } from '../interfaces/task.js';
export interface ExecutionContextConfig {
    traceId: string;
    taskId: string;
    workflowId?: string;
    agentId?: string;
    providerId?: string;
    logger: ILogger;
    credentialResolver: CredentialResolver;
    task: TaskModel;
}
export declare class ExecutionContext {
    readonly traceId: string;
    readonly taskId: string;
    readonly workflowId?: string;
    readonly agentId?: string;
    readonly providerId?: string;
    readonly logger: ILogger;
    readonly credentialResolver: CredentialResolver;
    readonly task: TaskModel;
    private scopedVars;
    constructor(config: ExecutionContextConfig);
    setScopedVar(key: string, value: unknown): void;
    getScopedVar<T>(key: string): T | undefined;
    cloneWithAgent(agentId: string): ExecutionContext;
    cloneWithProvider(providerId: string): ExecutionContext;
}
//# sourceMappingURL=index.d.ts.map