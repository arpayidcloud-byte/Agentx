/// <reference types="node" resolution-mode="require"/>
export interface ICancellationToken {
    readonly signal: AbortSignal;
    readonly reason: string;
    readonly isCancelled: boolean;
    cancel(reason: string): void;
    checkCancellation(): void;
    fork(): ICancellationToken;
}
export declare class CancellationToken implements ICancellationToken {
    private abortController;
    private _reason;
    constructor();
    get signal(): AbortSignal;
    get reason(): string;
    get isCancelled(): boolean;
    cancel(reason: string): void;
    checkCancellation(): void;
    fork(): ICancellationToken;
}
export declare class CancellationSource {
    private _token;
    constructor();
    get token(): ICancellationToken;
    cancel(reason: string): void;
}
//# sourceMappingURL=index.d.ts.map