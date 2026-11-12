import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '../store/context';

export function useScrollPersistence(
  screenKey: string,
  externalRef?: React.RefObject<HTMLDivElement | null>,
) {
  const { state, dispatch } = useAppStore();
  const internalRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const targetRef = externalRef ?? internalRef;

  const savedTop = state.ui.scrollPositions[screenKey] ?? 0;

  useEffect(() => {
    const el = targetRef.current;
    if (!el || savedTop <= 0) return;
    const rafId = window.requestAnimationFrame(() => {
      el.scrollTop = savedTop;
    });
    return () => window.cancelAnimationFrame(rafId);
    // Restore on screen mount / key switch only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenKey]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleScroll = useCallback(() => {
    const el = targetRef.current;
    if (!el) return;
    const nextTop = Math.round(el.scrollTop);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      dispatch({ type: 'SET_SCROLL_POSITION', key: screenKey, top: nextTop });
    }, 120);
  }, [dispatch, screenKey, targetRef]);

  return { scrollRef: targetRef, onScroll: handleScroll };
}
