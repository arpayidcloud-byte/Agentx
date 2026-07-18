/**
 * @module runtime-production/lock-manager
 * @description Distributed lock manager abstraction with multiple providers.
 */

import type { LockOptions, LockInfo } from './interfaces.js';
import { DistributedLockError } from './errors.js';

export interface IDistributedLockManager {
  acquire(key: string, options: LockOptions): Promise<LockInfo>;
  release(lockId: string): Promise<void>;
  renew(lockId: string, ttlMs: number): Promise<void>;
  expire(key: string): Promise<void>;
}

export class MemoryLockProvider implements IDistributedLockManager {
  private locks = new Map<string, LockInfo>();

  async acquire(key: string, options: LockOptions): Promise<LockInfo> {
    const existing = this.locks.get(key);
    if (existing && existing.expiresAt.getTime() > Date.now()) {
      throw new DistributedLockError(`Lock already held: ${key}`, 'lock-manager');
    }

    const lock: LockInfo = {
      id: `lock-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      key,
      ownerId: `owner-${Date.now()}`,
      acquiredAt: new Date(),
      expiresAt: new Date(Date.now() + options.ttlMs),
    };
    this.locks.set(key, lock);
    return lock;
  }

  async release(lockId: string): Promise<void> {
    for (const [_key, lock] of this.locks.entries()) {
      if (lock.id === lockId) {
        this.locks.delete(_key);
        return;
      }
    }
    throw new DistributedLockError(`Lock not found: ${lockId}`, 'lock-manager');
  }

  async renew(lockId: string, ttlMs: number): Promise<void> {
    for (const [_key, lock] of this.locks.entries()) {
      if (lock.id === lockId) {
        lock.expiresAt = new Date(Date.now() + ttlMs);
        return;
      }
    }
    throw new DistributedLockError(`Lock not found: ${lockId}`, 'lock-manager');
  }

  async expire(key: string): Promise<void> {
    this.locks.delete(key);
  }
}

export class RedisLockProvider implements IDistributedLockManager {
  async acquire(_key: string, _options: LockOptions): Promise<LockInfo> {
    throw new DistributedLockError('RedisLockProvider not implemented', 'lock-manager');
  }
  async release(_lockId: string): Promise<void> {
    throw new DistributedLockError('RedisLockProvider not implemented', 'lock-manager');
  }
  async renew(_lockId: string, _ttlMs: number): Promise<void> {
    throw new DistributedLockError('RedisLockProvider not implemented', 'lock-manager');
  }
  async expire(_key: string): Promise<void> {
    throw new DistributedLockError('RedisLockProvider not implemented', 'lock-manager');
  }
}

export class PostgresAdvisoryLockProvider implements IDistributedLockManager {
  async acquire(_key: string, _options: LockOptions): Promise<LockInfo> {
    throw new DistributedLockError('PostgresAdvisoryLockProvider not implemented', 'lock-manager');
  }
  async release(_lockId: string): Promise<void> {
    throw new DistributedLockError('PostgresAdvisoryLockProvider not implemented', 'lock-manager');
  }
  async renew(_lockId: string, _ttlMs: number): Promise<void> {
    throw new DistributedLockError('PostgresAdvisoryLockProvider not implemented', 'lock-manager');
  }
  async expire(_key: string): Promise<void> {
    throw new DistributedLockError('PostgresAdvisoryLockProvider not implemented', 'lock-manager');
  }
}
