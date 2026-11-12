import { useCallback, useMemo } from 'react';
import { nowIso } from '../lib/dates';
import { newId, useAppStore } from '../store/context';

export function useRequests() {
  const { state, dispatch, showToast } = useAppStore();

  const submitServiceOrder = useCallback(
    (service: { id: string; title: string; price: string }) => {
      const requestId = newId();
      const refSuffix = requestId.replace(/-/g, '').slice(0, 5).toUpperCase();
      const refNumber = `REV-SVC-${refSuffix}`;

      dispatch({
        type: 'SUBMIT_SERVICE_ORDER',
        serviceId: service.id,
        title: service.title,
        price: service.price,
        subtitle: `Submitted via Revas App • ${service.price}`,
        requestId,
        refNumber,
        notificationId: newId(),
        timelineId: newId(),
        timestampIso: nowIso(),
      });

      showToast(`${service.title} submitted`);
    },
    [dispatch, showToast],
  );

  const filterCounts = useMemo(
    () => ({
      all: state.requests.length,
      in_progress: state.requests.filter((r) => r.filterTags.includes('in_progress')).length,
      action_needed: state.requests.filter((r) => r.filterTags.includes('action_needed')).length,
      cleared: state.requests.filter((r) => r.filterTags.includes('cleared')).length,
    }),
    [state.requests],
  );

  const actionNeededCount = filterCounts.action_needed;

  return {
    requests: state.requests,
    filterCounts,
    actionNeededCount,
    submitServiceOrder,
  };
}
