const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function nowIso(nowMs = Date.now()): string {
  return new Date(nowMs).toISOString();
}

export function minutesAgoIso(minutes: number, baseMs = Date.now()): string {
  return new Date(baseMs - minutes * MINUTE_MS).toISOString();
}

export function daysAgoIso(days: number, baseMs = Date.now()): string {
  return new Date(baseMs - days * DAY_MS).toISOString();
}

export function daysFromNowIso(days: number, baseMs = Date.now()): string {
  return new Date(baseMs + days * DAY_MS).toISOString();
}

export function parseIsoMs(isoDate: string | undefined | null): number | null {
  if (!isoDate) return null;
  const ms = Date.parse(isoDate);
  return Number.isNaN(ms) ? null : ms;
}

export function isSameLocalCalendarDay(aMs: number, bMs: number): boolean {
  const a = new Date(aMs);
  const b = new Date(bMs);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Classifies notifications into "Today" vs "Earlier".
 * Items within 12 hours or matching the same local calendar day appear under "Today".
 */
export function isTodaySection(isoDate: string, nowMs = Date.now()): boolean {
  const ms = parseIsoMs(isoDate);
  if (ms === null) return false;
  const diff = nowMs - ms;
  if (diff >= 0 && diff < 12 * HOUR_MS) return true;
  return isSameLocalCalendarDay(ms, nowMs);
}

export function formatShortDate(isoDate: string): string {
  const ms = parseIsoMs(isoDate);
  if (ms === null) return isoDate;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(ms));
}

export function formatClockTime(isoDate: string): string {
  const ms = parseIsoMs(isoDate);
  if (ms === null) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(ms));
}

export function formatRelativeTime(isoDate: string, nowMs = Date.now()): string {
  const ms = parseIsoMs(isoDate);
  if (ms === null) return isoDate;

  const diffMs = nowMs - ms;
  if (diffMs < 0) {
    return formatShortDate(isoDate);
  }
  if (diffMs < MINUTE_MS) {
    return 'Just now';
  }
  if (diffMs < HOUR_MS) {
    const mins = Math.floor(diffMs / MINUTE_MS);
    return `${mins}m ago`;
  }
  if (diffMs < DAY_MS) {
    const hours = Math.floor(diffMs / HOUR_MS);
    return `${hours}h ago`;
  }

  const days = Math.floor(diffMs / DAY_MS);
  if (days === 1) {
    return 'Yesterday';
  }
  if (days < 7) {
    return `${days} days ago`;
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  return formatShortDate(isoDate);
}

export function getDaysUntil(isoDate: string, nowMs = Date.now()): number | null {
  const ms = parseIsoMs(isoDate);
  if (ms === null) return null;
  return Math.ceil((ms - nowMs) / DAY_MS);
}

export function formatExpiryCountdown(isoDate: string, nowMs = Date.now()): string {
  const days = getDaysUntil(isoDate, nowMs);
  if (days === null) return '';
  if (days < 0) {
    const abs = Math.abs(days);
    return abs === 1 ? 'Expired 1 day ago' : `Expired ${abs} days ago`;
  }
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires in 1 day';
  return `Expires in ${days} days`;
}

