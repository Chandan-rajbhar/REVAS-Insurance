import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import {
  createSeedBundle,
  type RevasSeedBundle,
} from '../data/mock';
import { nowIso } from '../lib/dates';
import {
  ensureSchemaVersion,
  hasStoredKey,
  load,
  onStorageError,
  resetAll,
  save,
  subscribeStorageSync,
} from '../lib/storage';
import {
  AppStoreContext,
  SLICE_TO_STORAGE_KEY,
  newId,
  type AppStoreContextValue,
} from './context';
import {
  appReducer,
  type ActiveSheet,
  type AppAction,
  type AppState,
  type PersistedSliceKey,
  type ToastMessage,
} from './reducer';

const STORAGE_KEY_TO_SLICE = Object.entries(SLICE_TO_STORAGE_KEY).reduce<
  Record<string, PersistedSliceKey>
>((acc, [slice, storageKey]) => {
  acc[storageKey] = slice as PersistedSliceKey;
  return acc;
}, {});

const PERSISTED_SLICES = Object.keys(SLICE_TO_STORAGE_KEY) as PersistedSliceKey[];

function hydrateInitialState(): AppState {
  const wipedByVersionMismatch = ensureSchemaVersion();
  const seeds = createSeedBundle();
  const hydrated = {} as RevasSeedBundle;

  for (const slice of PERSISTED_SLICES) {
    const key = SLICE_TO_STORAGE_KEY[slice];
    const seedValue = seeds[slice];
    if (wipedByVersionMismatch || !hasStoredKey(key)) {
      save(key, seedValue);
      (hydrated as unknown as Record<string, unknown>)[slice] = seedValue;
    } else {
      (hydrated as unknown as Record<string, unknown>)[slice] = load(key, seedValue);
    }
  }

  hydrated.company = {
    ...hydrated.company,
    powerUnits: hydrated.trucks.length,
    driversCount: hydrated.drivers.length,
  };

  return {
    ...hydrated,
    activeSheet: null,
    toast: null,
  };
}

function pickPersisted(state: AppState): RevasSeedBundle {
  return {
    company: state.company,
    trucks: state.trucks,
    drivers: state.drivers,
    policies: state.policies,
    documents: state.documents,
    requests: state.requests,
    notifications: state.notifications,
    quote: state.quote,
    reviews: state.reviews,
    chatMessages: state.chatMessages,
    settings: state.settings,
    ui: state.ui,
  };
}

interface PendingRemovalRecord {
  slice: PersistedSliceKey;
  previousValue: unknown;
  restoreLabel: string;
  timerId: number;
}

export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, rawDispatch] = useReducer(appReducer, undefined, hydrateInitialState);
  const latestStateRef = useRef<AppState>(state);
  const prevPersistedRef = useRef<RevasSeedBundle>(pickPersisted(state));
  const pendingDirtySlicesRef = useRef<Set<PersistedSliceKey>>(new Set());
  const debounceTimerRef = useRef<number | null>(null);
  const skipNextSaveSlicesRef = useRef<Set<PersistedSliceKey>>(new Set());
  const deferredSlicesRef = useRef<Set<PersistedSliceKey>>(new Set());
  const pendingRemovalRef = useRef<PendingRemovalRecord | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const sarahReplyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    latestStateRef.current = state;
  }, [state]);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    rawDispatch({ type: 'SET_TOAST', toast: null });
  }, []);

  const showToast = useCallback(
    (
      text: string,
      options?: { actionLabel?: string; onAction?: () => void; durationMs?: number },
    ) => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
      const toast: ToastMessage = {
        id: newId(),
        text,
        actionLabel: options?.actionLabel,
        onAction: options?.onAction,
      };
      rawDispatch({ type: 'SET_TOAST', toast });
      const duration = options?.durationMs ?? 2800;
      toastTimerRef.current = window.setTimeout(() => {
        rawDispatch({ type: 'SET_TOAST', toast: null });
        toastTimerRef.current = null;
      }, duration);
    },
    [],
  );

  useEffect(() => {
    let lastQuotaToastAt = 0;
    return onStorageError((reason) => {
      if (reason === 'quota') {
        const now = Date.now();
        if (now - lastQuotaToastAt > 4000) {
          lastQuotaToastAt = now;
          showToast('Storage almost full — keeping changes in memory.');
        }
      }
    });
  }, [showToast]);

  const flushDirtySlices = useCallback((slices?: Iterable<PersistedSliceKey>) => {
    const targets = slices
      ? Array.from(slices)
      : Array.from(pendingDirtySlicesRef.current);
    const current = latestStateRef.current;

    for (const slice of targets) {
      if (deferredSlicesRef.current.has(slice)) continue;
      pendingDirtySlicesRef.current.delete(slice);
      save(SLICE_TO_STORAGE_KEY[slice], current[slice]);
      if (slice === 'trucks' || slice === 'drivers') {
        save(SLICE_TO_STORAGE_KEY.company, current.company);
      }
    }
  }, []);

  useEffect(() => {
    const prev = prevPersistedRef.current;
    let queuedAny = false;

    for (const slice of PERSISTED_SLICES) {
      if (prev[slice] !== state[slice]) {
        if (skipNextSaveSlicesRef.current.has(slice)) {
          skipNextSaveSlicesRef.current.delete(slice);
          continue;
        }
        if (deferredSlicesRef.current.has(slice)) {
          continue;
        }
        pendingDirtySlicesRef.current.add(slice);
        queuedAny = true;
      }
    }

    prevPersistedRef.current = pickPersisted(state);

    if (queuedAny) {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = window.setTimeout(() => {
        debounceTimerRef.current = null;
        flushDirtySlices();
      }, 200);
    }
  }, [state, flushDirtySlices]);

  useEffect(() => {
    const handleFlush = () => {
      if (pendingDirtySlicesRef.current.size > 0) {
        flushDirtySlices();
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        handleFlush();
      }
    };
    window.addEventListener('pagehide', handleFlush);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('pagehide', handleFlush);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [flushDirtySlices]);

  useEffect(() => {
    return subscribeStorageSync((shortKey) => {
      if (shortKey === null) {
        const fresh = createSeedBundle();
        for (const slice of PERSISTED_SLICES) {
          skipNextSaveSlicesRef.current.add(slice);
        }
        rawDispatch({ type: 'REPLACE_ALL_PERSISTED', bundle: fresh });
        return;
      }

      const slice = STORAGE_KEY_TO_SLICE[shortKey];
      if (!slice) return;
      const fallbackBundle = createSeedBundle();
      const loaded = load(shortKey, fallbackBundle[slice]);
      skipNextSaveSlicesRef.current.add(slice);
      rawDispatch({ type: 'SYNC_REMOTE_SLICE', slice, value: loaded });
    });
  }, []);

  const clearDeferredForSlice = useCallback((slice: PersistedSliceKey) => {
    deferredSlicesRef.current.delete(slice);
    if (slice === 'trucks' || slice === 'drivers') {
      deferredSlicesRef.current.delete('company');
    }
  }, []);

  const commitPendingRemovalNow = useCallback(() => {
    const pending = pendingRemovalRef.current;
    if (!pending) return;
    window.clearTimeout(pending.timerId);
    clearDeferredForSlice(pending.slice);
    pendingRemovalRef.current = null;
    flushDirtySlices([pending.slice]);
  }, [clearDeferredForSlice, flushDirtySlices]);

  const scheduleDeleteWithUndo = useCallback(
    (
      slice: 'trucks' | 'drivers' | 'documents' | 'quote',
      action: AppAction,
      previousValue: unknown,
      label: string,
    ) => {
      commitPendingRemovalNow();

      deferredSlicesRef.current.add(slice);
      if (slice === 'trucks' || slice === 'drivers') {
        deferredSlicesRef.current.add('company');
      }

      rawDispatch(action);

      const timerId = window.setTimeout(() => {
        if (!pendingRemovalRef.current || pendingRemovalRef.current.slice !== slice) {
          return;
        }
        pendingRemovalRef.current = null;
        clearDeferredForSlice(slice);
        flushDirtySlices([slice]);
      }, 5000);

      pendingRemovalRef.current = {
        slice,
        previousValue,
        restoreLabel: label,
        timerId,
      };

      showToast(`Removed ${label}`, {
        actionLabel: 'Undo',
        durationMs: 5000,
        onAction: () => {
          const active = pendingRemovalRef.current;
          if (!active) return;
          window.clearTimeout(active.timerId);
          pendingRemovalRef.current = null;
          clearDeferredForSlice(active.slice);
          rawDispatch({
            type: 'RESTORE_SLICE',
            slice: active.slice,
            value: active.previousValue,
          });
          showToast(`Restored ${active.restoreLabel}`);
        },
      });
    },
    [clearDeferredForSlice, commitPendingRemovalNow, flushDirtySlices, showToast],
  );

  const sendChatWithAutoReply = useCallback((rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed) return;

    rawDispatch({
      type: 'ADD_CHAT_MESSAGE',
      message: {
        id: newId(),
        from: 'user',
        text: trimmed,
        createdAt: nowIso(),
      },
    });

    if (sarahReplyTimerRef.current !== null) {
      window.clearTimeout(sarahReplyTimerRef.current);
    }

    sarahReplyTimerRef.current = window.setTimeout(() => {
      sarahReplyTimerRef.current = null;
      rawDispatch({
        type: 'ADD_CHAT_MESSAGE',
        message: {
          id: newId(),
          from: 'sarah',
          text: "Thanks — got your message. I've noted it on your Apex Hauling file and will follow up shortly.",
          createdAt: nowIso(),
        },
      });
    }, 1000);
  }, []);

  const resetDemoData = useCallback(() => {
    if (pendingRemovalRef.current) {
      window.clearTimeout(pendingRemovalRef.current.timerId);
      pendingRemovalRef.current = null;
    }
    deferredSlicesRef.current.clear();
    pendingDirtySlicesRef.current.clear();
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    resetAll();
    const freshBundle = createSeedBundle();
    for (const slice of PERSISTED_SLICES) {
      save(SLICE_TO_STORAGE_KEY[slice], freshBundle[slice]);
      skipNextSaveSlicesRef.current.add(slice);
    }
    rawDispatch({ type: 'REPLACE_ALL_PERSISTED', bundle: freshBundle });
    showToast('Demo data reset to defaults');
  }, [showToast]);

  const openSheet = useCallback((sheet: ActiveSheet) => {
    rawDispatch({ type: 'SET_ACTIVE_SHEET', sheet });
  }, []);

  const closeSheet = useCallback(() => {
    rawDispatch({ type: 'SET_ACTIVE_SHEET', sheet: null });
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) window.clearTimeout(debounceTimerRef.current);
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
      if (sarahReplyTimerRef.current !== null) window.clearTimeout(sarahReplyTimerRef.current);
      if (pendingRemovalRef.current) window.clearTimeout(pendingRemovalRef.current.timerId);
    };
  }, []);

  const value = useMemo<AppStoreContextValue>(
    () => ({
      state,
      dispatch: rawDispatch,
      showToast,
      dismissToast,
      openSheet,
      closeSheet,
      scheduleDeleteWithUndo,
      sendChatWithAutoReply,
      resetDemoData,
    }),
    [
      state,
      showToast,
      dismissToast,
      openSheet,
      closeSheet,
      scheduleDeleteWithUndo,
      sendChatWithAutoReply,
      resetDemoData,
    ],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};
