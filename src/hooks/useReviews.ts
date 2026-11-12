import { useCallback, useMemo } from 'react';
import { nowIso } from '../lib/dates';
import { computeReviewStats } from '../store/reducer';
import { newId, useAppStore } from '../store/context';

export function useReviews() {
  const { state, dispatch, showToast } = useAppStore();

  const stats = useMemo(
    () => computeReviewStats(state.reviews),
    [state.reviews],
  );

  const submitReview = useCallback(
    (rating: number, text: string) => {
      const companyName = state.company.name.trim() || 'Apex Hauling LLC';
      const parts = companyName.split(/\s+/);
      const initials =
        parts.length >= 2
          ? `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
          : companyName.slice(0, 2).toUpperCase();

      dispatch({
        type: 'ADD_REVIEW',
        review: {
          id: newId(),
          initials: initials || 'AH',
          company: companyName,
          rating,
          createdAt: nowIso(),
          text: text.trim(),
        },
      });
      showToast('Thank you for your review');
    },
    [dispatch, showToast, state.company.name],
  );

  return {
    reviews: state.reviews,
    ratingText: stats.ratingText,
    reviewCount: stats.count,
    summarySubtitle: stats.summarySubtitle,
    submitReview,
  };
}
