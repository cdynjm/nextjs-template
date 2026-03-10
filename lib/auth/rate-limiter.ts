// lib/rate-limiter.ts
interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
}

const LOGIN_ATTEMPTS = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5; // max attempts
const BLOCK_TIME = 5 * 60 * 1000; // block for 5 minutes

export function checkRateLimit(key: string) {
  const now = Date.now();
  const entry = LOGIN_ATTEMPTS.get(key);

  if (!entry) {
    LOGIN_ATTEMPTS.set(key, { attempts: 1, lastAttempt: now });
    return false; // not blocked
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    if (now - entry.lastAttempt < BLOCK_TIME) {
      return true; // blocked
    } else {
      // reset after block time
      LOGIN_ATTEMPTS.set(key, { attempts: 1, lastAttempt: now });
      return false;
    }
  }

  // increment attempts
  entry.attempts += 1;
  entry.lastAttempt = now;
  LOGIN_ATTEMPTS.set(key, entry);
  return false;
}

export function resetRateLimit(key: string) {
  LOGIN_ATTEMPTS.delete(key);
}