import { useCallback } from 'react';
import { nowIso } from '../lib/dates';
import { useAppStore } from '../store/context';

export function useSettings() {
  const { state, dispatch, openSheet, resetDemoData, showToast } = useAppStore();

  const setReduceMotion = useCallback(
    (reduceMotion: boolean) => {
      dispatch({ type: 'UPDATE_SETTINGS', patch: { reduceMotion } });
      showToast(reduceMotion ? 'Reduced motion enabled' : 'Reduced motion off');
    },
    [dispatch, showToast],
  );

  const setShowTutorial = useCallback(
    (showTutorial: boolean) => {
      dispatch({ type: 'UPDATE_SETTINGS', patch: { showTutorial } });
      if (showTutorial) {
        openSheet({ type: 'tutorial' });
      }
    },
    [dispatch, openSheet],
  );

  const signOut = useCallback(() => {
    dispatch({ type: 'SIGN_OUT' });
    showToast('Signed out');
  }, [dispatch, showToast]);

  const signIn = useCallback(
    (email: string) => {
      const cleanEmail = email.trim() || state.company.email || 'dispatch@apexhauling.com';
      dispatch({
        type: 'SIGN_IN',
        email: cleanEmail,
        timestampIso: nowIso(),
      });
      showToast(`Signed in as ${cleanEmail}`);
    },
    [dispatch, showToast, state.company.email],
  );

  return {
    settings: state.settings,
    setReduceMotion,
    setShowTutorial,
    signOut,
    signIn,
    resetDemoData,
  };
}
