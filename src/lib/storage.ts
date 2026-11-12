export const SCHEMA_VERSION = 'revas:v1';
export const KEY_PREFIX = `${SCHEMA_VERSION}:`;
export const SCHEMA_SHORT_KEY = '__schema__';

export const STORAGE_KEYS = {
  company: 'company',
  trucks: 'fleet.trucks',
  drivers: 'fleet.drivers',
  policies: 'policies',
  documents: 'documents',
  requests: 'requests',
  notifications: 'notifications',
  quote: 'quote',
  reviews: 'reviews',
  chatMessages: 'chat.messages',
  settings: 'settings',
  ui: 'ui',
} as const;

export type StorageErrorReason = 'quota' | 'blocked' | 'serialize' | 'corrupt';

export interface SaveResult {
  ok: boolean;
  reason?: StorageErrorReason;
}

type StorageErrorListener = (reason: StorageErrorReason, key: string) => void;

const memoryStore = new Map<string, string>();
const memoryAuthoritativeKeys = new Set<string>();
const errorListeners = new Set<StorageErrorListener>();

function getNativeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) {
      return null;
    }
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getPrefixedKey(key: string): string {
  return key.startsWith(KEY_PREFIX) ? key : `${KEY_PREFIX}${key}`;
}

export function stripKeyPrefix(fullKey: string): string | null {
  if (!fullKey.startsWith(KEY_PREFIX)) return null;
  return fullKey.slice(KEY_PREFIX.length);
}

export function onStorageError(listener: StorageErrorListener): () => void {
  errorListeners.add(listener);
  return () => {
    errorListeners.delete(listener);
  };
}

function notifyError(reason: StorageErrorReason, key: string): void {
  for (const listener of errorListeners) {
    try {
      listener(reason, key);
    } catch {
      // Ignore listener failures
    }
  }
}

function isQuotaError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const maybeErr = err as { name?: string; code?: number };
  return (
    maybeErr.name === 'QuotaExceededError' ||
    maybeErr.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    maybeErr.code === 22 ||
    maybeErr.code === 1014
  );
}

function cloneFallback<T>(value: T): T {
  try {
    if (typeof structuredClone === 'function') {
      return structuredClone(value);
    }
  } catch {
    // Fallback below
  }
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    return value;
  }
}

export function hasStoredKey(key: string): boolean {
  const fullKey = getPrefixedKey(key);
  if (memoryAuthoritativeKeys.has(fullKey)) {
    return memoryStore.has(fullKey);
  }
  const ls = getNativeStorage();
  if (ls) {
    try {
      const raw = ls.getItem(fullKey);
      if (raw !== null) return true;
    } catch {
      // Fall through to memoryStore
    }
  }
  return memoryStore.has(fullKey);
}

export function load<T>(key: string, fallback: T): T {
  const fullKey = getPrefixedKey(key);

  if (memoryAuthoritativeKeys.has(fullKey) && memoryStore.has(fullKey)) {
    try {
      return JSON.parse(memoryStore.get(fullKey)!) as T;
    } catch {
      return cloneFallback(fallback);
    }
  }

  const ls = getNativeStorage();
  if (ls) {
    try {
      const raw = ls.getItem(fullKey);
      if (raw !== null) {
        try {
          const parsed = JSON.parse(raw) as T;
          memoryStore.set(fullKey, raw);
          return parsed;
        } catch {
          // Corrupted JSON in localStorage: quarantine cleanly & fall back
          notifyError('corrupt', key);
          try {
            ls.removeItem(fullKey);
          } catch {
            // Ignore cleanup failure
          }
          memoryStore.delete(fullKey);
          return cloneFallback(fallback);
        }
      }
    } catch {
      // Storage blocked (e.g., private browsing SecurityError)
      notifyError('blocked', key);
    }
  }

  if (memoryStore.has(fullKey)) {
    try {
      return JSON.parse(memoryStore.get(fullKey)!) as T;
    } catch {
      return cloneFallback(fallback);
    }
  }

  return cloneFallback(fallback);
}

export function save<T>(key: string, value: T): SaveResult {
  const fullKey = getPrefixedKey(key);
  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch {
    notifyError('serialize', key);
    return { ok: false, reason: 'serialize' };
  }

  memoryStore.set(fullKey, serialized);
  const ls = getNativeStorage();

  if (!ls) {
    memoryAuthoritativeKeys.add(fullKey);
    return { ok: true };
  }

  try {
    ls.setItem(fullKey, serialized);
    memoryAuthoritativeKeys.delete(fullKey);
    return { ok: true };
  } catch (err) {
    memoryAuthoritativeKeys.add(fullKey);
    const reason: StorageErrorReason = isQuotaError(err) ? 'quota' : 'blocked';
    notifyError(reason, key);
    return { ok: false, reason };
  }
}

export function remove(key: string): void {
  const fullKey = getPrefixedKey(key);
  memoryStore.delete(fullKey);
  memoryAuthoritativeKeys.delete(fullKey);

  const ls = getNativeStorage();
  if (!ls) return;

  try {
    ls.removeItem(fullKey);
  } catch {
    // Ignore storage removal errors in restricted environments
  }
}

function collectRevasKeys(ls: Storage): string[] {
  const keys: string[] = [];
  try {
    for (let i = 0; i < ls.length; i += 1) {
      const k = ls.key(i);
      if (k && k.startsWith('revas:')) {
        keys.push(k);
      }
    }
  } catch {
    // Ignore enumeration error
  }
  return keys;
}

export function resetAll(): void {
  for (const key of Array.from(memoryStore.keys())) {
    if (key.startsWith('revas:')) {
      memoryStore.delete(key);
      memoryAuthoritativeKeys.delete(key);
    }
  }

  const ls = getNativeStorage();
  if (ls) {
    try {
      const existing = collectRevasKeys(ls);
      for (const fullKey of existing) {
        try {
          ls.removeItem(fullKey);
        } catch {
          // Ignore individual remove errors
        }
      }
      // Also ensure known keys are cleared even if length/key enumeration is mocked or incomplete
      for (const shortKey of Object.values(STORAGE_KEYS)) {
        try {
          ls.removeItem(getPrefixedKey(shortKey));
        } catch {
          // Ignore
        }
      }
      ls.removeItem(getPrefixedKey(SCHEMA_SHORT_KEY));
    } catch {
      // Ignore blocked storage
    }
  }

  save(SCHEMA_SHORT_KEY, SCHEMA_VERSION);
}

/**
 * Verifies the persisted schema version.
 * If keys belong to another version or the stored schema marker disagrees with SCHEMA_VERSION,
 * all prior revas:* keys are cleared and true is returned so callers re-seed cleanly.
 */
export function ensureSchemaVersion(): boolean {
  const ls = getNativeStorage();
  let mismatchFound = false;

  if (ls) {
    try {
      const existingKeys = collectRevasKeys(ls);
      const hasOtherVersionKeys = existingKeys.some((k) => !k.startsWith(KEY_PREFIX));
      const storedMarkerRaw = ls.getItem(getPrefixedKey(SCHEMA_SHORT_KEY));
      let storedMarker: string | null = null;
      if (storedMarkerRaw !== null) {
        try {
          storedMarker = JSON.parse(storedMarkerRaw) as string;
        } catch {
          storedMarker = null;
          mismatchFound = true;
        }
      }

      if (hasOtherVersionKeys || (storedMarker !== null && storedMarker !== SCHEMA_VERSION)) {
        mismatchFound = true;
      }
    } catch {
      // Blocked storage: keep memory state
    }
  }

  if (mismatchFound) {
    resetAll();
    return true;
  }

  if (!hasStoredKey(SCHEMA_SHORT_KEY)) {
    save(SCHEMA_SHORT_KEY, SCHEMA_VERSION);
  }
  return false;
}

export function subscribeStorageSync(
  onRemoteChange: (shortKey: string | null) => void,
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event: StorageEvent) => {
    if (event.storageArea && getNativeStorage() && event.storageArea !== getNativeStorage()) {
      return;
    }

    if (event.key === null) {
      // Storage was cleared remotely
      memoryStore.clear();
      memoryAuthoritativeKeys.clear();
      onRemoteChange(null);
      return;
    }

    const shortKey = stripKeyPrefix(event.key);
    if (!shortKey || shortKey === SCHEMA_SHORT_KEY) return;

    if (event.newValue !== null) {
      memoryStore.set(event.key, event.newValue);
    } else {
      memoryStore.delete(event.key);
    }
    memoryAuthoritativeKeys.delete(event.key);
    onRemoteChange(shortKey);
  };

  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('storage', handler);
  };
}

