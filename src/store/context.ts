import { createContext, useContext } from 'react';
import type React from 'react';
import { STORAGE_KEYS } from '../lib/storage';
import type { ActiveSheet, AppAction, AppState, PersistedSliceKey } from './reducer';

export const SLICE_TO_STORAGE_KEY: Record<PersistedSliceKey, string> = {
  company: STORAGE_KEYS.company,
  trucks: STORAGE_KEYS.trucks,
  drivers: STORAGE_KEYS.drivers,
  policies: STORAGE_KEYS.policies,
  documents: STORAGE_KEYS.documents,
  requests: STORAGE_KEYS.requests,
  notifications: STORAGE_KEYS.notifications,
  quote: STORAGE_KEYS.quote,
  reviews: STORAGE_KEYS.reviews,
  chatMessages: STORAGE_KEYS.chatMessages,
  settings: STORAGE_KEYS.settings,
  ui: STORAGE_KEYS.ui,
};

export function newId(): string {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID();
  }
  return `rev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export interface AppStoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  showToast: (
    text: string,
    options?: { actionLabel?: string; onAction?: () => void; durationMs?: number },
  ) => void;
  dismissToast: () => void;
  openSheet: (sheet: ActiveSheet) => void;
  closeSheet: () => void;
  scheduleDeleteWithUndo: (
    slice: 'trucks' | 'drivers' | 'documents' | 'quote',
    action: AppAction,
    previousValue: unknown,
    label: string,
  ) => void;
  sendChatWithAutoReply: (text: string) => void;
  resetDemoData: () => void;
}

export const AppStoreContext = createContext<AppStoreContextValue | null>(null);

export function useAppStore(): AppStoreContextValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return ctx;
}

