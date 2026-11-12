import { useCallback } from 'react';
import type { QuoteDraft, QuoteStep, VehicleItem } from '../data/mock';
import { nowIso } from '../lib/dates';
import { newId, useAppStore } from '../store/context';

export function useQuote() {
  const { state, dispatch, showToast, scheduleDeleteWithUndo } = useAppStore();
  const quote = state.quote;

  const progressPercent = quote
    ? Math.round((quote.currentStep / quote.totalSteps) * 100)
    : 0;

  const startOrResumeQuote = useCallback(
    (step?: QuoteStep) => {
      dispatch({
        type: 'START_OR_RESUME_QUOTE',
        step,
        timestampIso: nowIso(),
      });
    },
    [dispatch],
  );

  const updateQuote = useCallback(
    (patch: Partial<QuoteDraft>) => {
      dispatch({ type: 'UPDATE_QUOTE', patch, timestampIso: nowIso() });
    },
    [dispatch],
  );

  const setQuoteStep = useCallback(
    (step: QuoteStep) => {
      dispatch({ type: 'SET_QUOTE_STEP', step, timestampIso: nowIso() });
    },
    [dispatch],
  );

  const saveQuoteVehicle = useCallback(
    (vehicle: Omit<VehicleItem, 'id'> & { id?: string }, isEdit: boolean) => {
      const nextVehicle: VehicleItem = {
        ...vehicle,
        id: vehicle.id ?? newId(),
      };
      dispatch({
        type: 'UPSERT_QUOTE_VEHICLE',
        vehicle: nextVehicle,
        isEdit,
        timestampIso: nowIso(),
      });
      showToast(isEdit ? 'Vehicle updated' : 'Vehicle added to quote');
    },
    [dispatch, showToast],
  );

  const deleteQuoteVehicle = useCallback(
    (id: string) => {
      if (!quote) return;
      const target = quote.vehicles.find((v) => v.id === id);
      if (!target) return;
      scheduleDeleteWithUndo(
        'quote',
        { type: 'REMOVE_QUOTE_VEHICLE', id, timestampIso: nowIso() },
        quote,
        target.name,
      );
    },
    [quote, scheduleDeleteWithUndo],
  );

  const toggleCoverage = useCallback(
    (id: string) => {
      dispatch({
        type: 'TOGGLE_QUOTE_COVERAGE',
        id,
        timestampIso: nowIso(),
      });
    },
    [dispatch],
  );

  const saveForLater = useCallback(() => {
    const step = state.quote?.currentStep ?? 1;
    const total = state.quote?.totalSteps ?? 6;
    dispatch({ type: 'SAVE_QUOTE_FOR_LATER', timestampIso: nowIso() });
    showToast(`Quote draft saved at Step ${step} of ${total}`);
  }, [dispatch, showToast, state.quote]);

  const submitQuote = useCallback(() => {
    const requestId = newId();
    const refNumber = `REV-Q-${requestId.replace(/-/g, '').slice(0, 5).toUpperCase()}`;
    dispatch({
      type: 'SUBMIT_QUOTE',
      requestId,
      refNumber,
      notificationId: newId(),
      timelineId: newId(),
      timestampIso: nowIso(),
    });
    showToast('Fleet Policy Quote submitted');
  }, [dispatch, showToast]);

  return {
    quote,
    hasQuoteInProgress: quote !== null,
    progressPercent,
    startOrResumeQuote,
    updateQuote,
    setQuoteStep,
    saveQuoteVehicle,
    deleteQuoteVehicle,
    toggleCoverage,
    saveForLater,
    submitQuote,
  };
}
