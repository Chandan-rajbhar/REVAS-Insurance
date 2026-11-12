import { useCallback, useMemo } from 'react';
import { nowIso } from '../lib/dates';
import { newId, useAppStore } from '../store/context';

export function useNotifications() {
  const { state, dispatch, showToast } = useAppStore();

  const unreadCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications],
  );

  const urgentCount = useMemo(
    () => state.notifications.filter((n) => n.urgent).length,
    [state.notifications],
  );

  const markRead = useCallback(
    (id: string) => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', id });
    },
    [dispatch],
  );

  const markAllRead = useCallback(() => {
    if (unreadCount === 0) return;
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
    showToast('All notifications marked read');
  }, [dispatch, showToast, unreadCount]);

  const sendMedicalReminder = useCallback(() => {
    dispatch({
      type: 'REMIND_MEDICAL_CARD',
      id: newId(),
      timestampIso: nowIso(),
    });
    showToast('Reminder sent to Marcus Vance');
  }, [dispatch, showToast]);

  return {
    notifications: state.notifications,
    unreadCount,
    urgentCount,
    markRead,
    markAllRead,
    sendMedicalReminder,
  };
}
