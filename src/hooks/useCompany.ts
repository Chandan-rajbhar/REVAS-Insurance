import { useCallback } from 'react';
import type { CompanyInfo } from '../data/mock';
import { useAppStore } from '../store/context';

export function useCompany() {
  const { state, dispatch, showToast } = useAppStore();

  const updateCompany = useCallback(
    (patch: Partial<CompanyInfo>) => {
      dispatch({ type: 'UPDATE_COMPANY', patch });
      showToast('Company details saved');
    },
    [dispatch, showToast],
  );

  return {
    company: state.company,
    policies: state.policies,
    truckCount: state.trucks.length,
    driverCount: state.drivers.length,
    updateCompany,
  };
}
