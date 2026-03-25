import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import {
  fetchVehicles,
  fetchVehicle,
  addVehicle,
  assignVehicle,
  updateVehicleStatus,
} from '../store/thunks/vehicles.thunk';
import { setFilter } from '../store/slices/vehicles.slice';
import type { VehicleInput } from '../types/vehicle.type';
import type { VehicleStatus } from '../enums/vehicle-status.enum';

export function useVehicles() {
  const dispatch = useAppDispatch();
  const { vehicles, currentVehicle, statusCounts, currentFilter, loading, error } = useAppSelector(
    (s) => s.vehicles,
  );

  return {
    vehicles,
    currentVehicle,
    statusCounts,
    currentFilter,
    loading,
    error,
    fetchVehicles: useCallback(
      (filter?: VehicleStatus) => dispatch(fetchVehicles(filter)),
      [dispatch],
    ),
    fetchVehicle: useCallback(
      (vehicleId: string) => dispatch(fetchVehicle(vehicleId)),
      [dispatch],
    ),
    addVehicle: useCallback(
      (data: VehicleInput) => dispatch(addVehicle(data)),
      [dispatch],
    ),
    assignVehicle: useCallback(
      (vehicleId: string, riderId: string) =>
        dispatch(assignVehicle({ vehicleId, riderId })),
      [dispatch],
    ),
    updateVehicleStatus: useCallback(
      (vehicleId: string, status: VehicleStatus, reason?: string) =>
        dispatch(updateVehicleStatus({ vehicleId, status, reason })),
      [dispatch],
    ),
    setFilter: useCallback(
      (filter: VehicleStatus | 'all') => dispatch(setFilter(filter)),
      [dispatch],
    ),
  };
}
