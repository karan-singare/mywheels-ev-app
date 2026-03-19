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
    fetchActiveRental: (riderId: string) => dispatch(fetchActiveRental(riderId)),
    fetchHistory: (riderId: string) => dispatch(fetchHistory(riderId)),
    createRental: (riderId: string, planId: string, vehicleId: string) =>
      dispatch(createRental({ riderId, planId, vehicleId })),
    fetchAllActive: () => dispatch(fetchAllActive()),
  };
}
