export class CancellationToken {
    abortController;
    _reason = '';
    constructor() {
        this.abortController = new AbortController();
    }
    get signal() {
        return this.abortController.signal;
    }
    get reason() {
        return this._reason;
    }
    get isCancelled() {
        return this.abortController.signal.aborted;
    }
    cancel(reason) {
        this._reason = reason;
        this.abortController.abort(new Error(reason));
    }
    checkCancellation() {
        if (this.isCancelled) {
            throw new Error(`Operation cancelled: ${this._reason}`);
        }
    }
    fork() {
        const child = new CancellationToken();
        this.signal.addEventListener('abort', () => {
            child.cancel(`Parent cancelled: ${this._reason}`);
        });
        return child;
    }
}
export class CancellationSource {
    _token;
    constructor() {
        this._token = new CancellationToken();
    }
    get token() {
        return this._token;
    }
    cancel(reason) {
        this._token.cancel(reason);
    }
}
//# sourceMappingURL=index.js.map