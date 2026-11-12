import { useCallback } from 'react';
import type { FleetDriver, FleetTruck } from '../data/mock';
import { newId, useAppStore } from '../store/context';

export function useFleet() {
  const { state, dispatch, showToast, scheduleDeleteWithUndo } = useAppStore();

  const saveTruck = useCallback(
    (
      truckInput: Omit<FleetTruck, 'id'> & { id?: string },
      isEdit: boolean,
    ) => {
      const truck: FleetTruck = {
        ...truckInput,
        id: truckInput.id ?? newId(),
      };
      dispatch({ type: 'UPSERT_TRUCK', truck, isEdit });
      showToast(isEdit ? `Updated ${truck.unitNumber}` : `Added ${truck.unitNumber} to fleet`);
    },
    [dispatch, showToast],
  );

  const deleteTruck = useCallback(
    (id: string) => {
      const target = state.trucks.find((t) => t.id === id);
      if (!target) return;
      scheduleDeleteWithUndo(
        'trucks',
        { type: 'REMOVE_TRUCK', id },
        state.trucks,
        `${target.unitNumber} (${target.name})`,
      );
    },
    [state.trucks, scheduleDeleteWithUndo],
  );

  const saveDriver = useCallback(
    (
      driverInput: Omit<FleetDriver, 'id'> & { id?: string },
      isEdit: boolean,
    ) => {
      const driver: FleetDriver = {
        ...driverInput,
        id: driverInput.id ?? newId(),
      };
      dispatch({ type: 'UPSERT_DRIVER', driver, isEdit });
      showToast(isEdit ? `Updated ${driver.name}` : `Added ${driver.name} to roster`);
    },
    [dispatch, showToast],
  );

  const deleteDriver = useCallback(
    (id: string) => {
      const target = state.drivers.find((d) => d.id === id);
      if (!target) return;
      scheduleDeleteWithUndo(
        'drivers',
        { type: 'REMOVE_DRIVER', id },
        state.drivers,
        target.name,
      );
    },
    [state.drivers, scheduleDeleteWithUndo],
  );

  return {
    trucks: state.trucks,
    drivers: state.drivers,
    saveTruck,
    deleteTruck,
    saveDriver,
    deleteDriver,
  };
}
