import { useCallback } from 'react';
import type { ScreenId, UiState } from '../data/mock';
import { useAppStore } from '../store/context';

export function useUiState() {
  const { state, dispatch } = useAppStore();

  const navigate = useCallback(
    (screen: ScreenId) => {
      dispatch({ type: 'NAVIGATE', screen });
    },
    [dispatch],
  );

  const setUiPatch = useCallback(
    (patch: Partial<UiState>) => {
      dispatch({ type: 'SET_UI', patch });
    },
    [dispatch],
  );

  const toggleRequestExpanded = useCallback(
    (id: string) => {
      dispatch({ type: 'TOGGLE_REQUEST_EXPANDED', id });
    },
    [dispatch],
  );

  const setScrollPosition = useCallback(
    (key: string, top: number) => {
      dispatch({ type: 'SET_SCROLL_POSITION', key, top });
    },
    [dispatch],
  );

  return {
    ui: state.ui,
    navigate,
    setUiPatch,
    toggleRequestExpanded,
    setScrollPosition,
  };
}
