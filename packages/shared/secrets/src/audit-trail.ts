import { createHash } from 'crypto';
import * as fs from 'fs';

const LOG_FILE = process.env.AGENTX_SECRET_AUDIT_LOG;

/**
 * Check if audit logging is enabled
 * Disabled in production by default to prevent secret leakage
 */
const isEnabled = (): boolean => {
  const env = process.env.NODE_ENV;
  if (env === 'production') {
    return !!LOG_FILE;
  }
  return true;
};

/**
 * Secure audit trail logging
 *
 * NEVER logs the actual key value - only logs a hash prefix
 * This prevents secret leakage through logs
 *
 * @param key - Secret key identifier (will be hashed)
 * @param action - Action performed (e.g., 'get', 'set', 'rotate')
 */
export const auditTrail = (key: string, action: string): void => {
  if (!isEnabled()) {
    return;
  }

  // Hash the key to prevent leakage - only show first 8 chars of hash
  const keyHash = createHash('sha256').update(key).digest('hex').substring(0, 8);
  const entry = `[Secret Audit] ${new Date().toISOString()}: ${action} for key hash: ${keyHash}\n`;

  if (LOG_FILE) {
    // Write to secure log file
    fs.appendFileSync(LOG_FILE, entry, 'utf8');
  } else if (process.env.NODE_ENV !== 'production') {
    // Only log to console in non-production environments
    console.log(entry.trim());
  }
};
