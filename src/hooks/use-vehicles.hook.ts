import { useAppSelector, useAppDispatch } from '../store';
import {
  fetchVehicles,
  addVehicle,
  assignVehicle,
  updateVehicleStatus,
} from '../store/thunks/vehicles.thunk';
import { setFilter } from '../store/slices/vehicles.slice';
import type { VehicleInput } from '../types/vehicle.type';
import type { VehicleStatus } from '../enums/vehicle-status.enum';

export function useVehicles() {
  const dispatch = useAppDispatch();
  const { vehicles, statusCounts, currentFilter, loading, error } = useAppSelector(
    (s) => s.vehicles,
  );

  return {
    vehicles,
    statusCounts,
    currentFilter,
    loading,
    error,
    fetchVehicles: (filter?: VehicleStatus) => dispatch(fetchVehicles(filter)),
    addVehicle: (data: VehicleInput) => dispatch(addVehicle(data)),
    assignVehicle: (vehicleId: string, riderId: string) =>
      dispatch(assignVehicle({ vehicleId, riderId })),
    updateVehicleStatus: (vehicleId: string, status: VehicleStatus, reason?: string) =>
      dispatch(updateVehicleStatus({ vehicleId, status, reason })),
    setFilter: (filter: VehicleStatus | 'all') => dispatch(setFilter(filter)),
  };
}
