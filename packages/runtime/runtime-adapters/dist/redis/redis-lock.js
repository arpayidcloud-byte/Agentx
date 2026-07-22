import { Redis } from 'ioredis';
export class RedisLockProvider {
    redis;
    total = 0;
    successes = 0;
    failures = 0;
    constructor(redisUrl = 'redis://localhost:6379') {
        this.redis = new Redis(redisUrl);
    }
    getMetadata() {
        return {
            id: 'redis-lock',
            name: 'Redis Lock Provider',
            type: 'lock',
            version: '1.0.0',
        };
    }
    getCapabilities() {
        return { distributedLocks: true };
    }
    async healthCheck() {
        try {
            await this.redis.ping();
            return { healthy: true, latencyMs: 1, lastChecked: new Date(), status: 'ACTIVE' };
        }
        catch (e) {
            return { healthy: false, latencyMs: 0, lastChecked: new Date(), status: 'DEGRADED', details: { reason: String(e) } };
        }
    }
    getMetrics() {
        return {
            totalRequests: this.total,
            successfulRequests: this.successes,
            failedRequests: this.failures,
            averageLatencyMs: 0,
        };
    }
    async acquire(key, ttlMs) {
        this.total++;
        const lockId = `lock-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        // Set IF NOT EXISTS with PX (milliseconds)
        const result = await this.redis.set(`lock:${key}`, lockId, 'PX', ttlMs, 'NX');
        if (result === 'OK') {
            this.successes++;
            return lockId;
        }
        this.failures++;
        throw new Error(`Lock already held: ${key}`);
    }
    async release(key, lockId) {
        // Use Lua script to ensure we only delete if we own the lock
        const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
        await this.redis.eval(script, 1, `lock:${key}`, lockId);
    }
    async renew(key, lockId, ttlMs) {
        // Use Lua script to ensure we only renew if we own the lock
        const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("pexpire", KEYS[1], ARGV[2])
      else
        return 0
      end
    `;
        await this.redis.eval(script, 1, `lock:${key}`, lockId, ttlMs);
    }
    async expire(key) {
        await this.redis.del(`lock:${key}`);
    }
    async isLocked(key) {
        const exists = await this.redis.exists(`lock:${key}`);
        return exists === 1;
    }
}
//# sourceMappingURL=redis-lock.js.map