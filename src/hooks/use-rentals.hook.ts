import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import {
  fetchActiveRental,
  fetchHistory,
  createRental,
  fetchAllActive,
} from '../store/thunks/rentals.thunk';

export function useRentals() {
  const dispatch = useAppDispatch();
  const { activeRental, history, allActive, loading, error } = useAppSelector((s) => s.rentals);

  return {
    activeRental,
    history,
    allActive,
    loading,
    error,
    fetchActiveRental: useCallback(
      (riderId: string) => dispatch(fetchActiveRental(riderId)),
      [dispatch],
    ),
    fetchHistory: useCallback(
      (riderId: string) => dispatch(fetchHistory(riderId)),
      [dispatch],
    ),
    createRental: useCallback(
      (riderId: string, planId: string, vehicleId: string) =>
        dispatch(createRental({ riderId, planId, vehicleId })),
      [dispatch],
    ),
    fetchAllActive: useCallback(
      () => dispatch(fetchAllActive()),
      [dispatch],
    ),
  };
}
