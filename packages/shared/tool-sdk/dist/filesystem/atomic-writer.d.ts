import type { IAtomicWriter } from './interfaces.js';
export declare class AtomicWriter implements IAtomicWriter {
    write(filePath: string, content: string): Promise<void>;
    rollback(tempFilePath: string): Promise<void>;
    private cleanup;
    private cleanupDirectory;
}
//# sourceMappingURL=atomic-writer.d.ts.map