import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle } from '../../types/vehicle.type';
import { VehicleStatus } from '../../enums/vehicle-status.enum';

export interface VehiclesState {
  vehicles: Vehicle[];
  currentVehicle: Vehicle | null;
  statusCounts: Record<VehicleStatus, number>;
  currentFilter: VehicleStatus | 'all';
  loading: boolean;
  error: string | null;
}

const initialState: VehiclesState = {
  vehicles: [],
  currentVehicle: null,
  statusCounts: { available: 0, rented: 0, maintenance: 0 },
  currentFilter: 'all',
  loading: false,
  error: null,
};

function computeStatusCounts(vehicles: Vehicle[]): Record<VehicleStatus, number> {
  return vehicles.reduce(
    (counts, v) => {
      counts[v.status] = (counts[v.status] || 0) + 1;
      return counts;
    },
    { available: 0, rented: 0, maintenance: 0 } as Record<VehicleStatus, number>,
  );
}

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<VehicleStatus | 'all'>) {
      state.currentFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchVehicles lifecycle
    builder.addMatcher(
      (action) => action.type === 'vehicles/fetchVehicles/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'vehicles/fetchVehicles/fulfilled',
      (state, action) => {
        state.loading = false;
        state.vehicles = action.payload ?? [];
        state.statusCounts = computeStatusCounts(state.vehicles);
      },
    );
    builder.addMatcher(
      (action) => action.type === 'vehicles/fetchVehicles/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to fetch vehicles';
      },
    );

    // addVehicle lifecycle
    builder.addMatcher(
      (action) => action.type === 'vehicles/addVehicle/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'vehicles/addVehicle/fulfilled',
      (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.vehicles.push(action.payload);
          state.statusCounts = computeStatusCounts(state.vehicles);
        }
      },
    );
    builder.addMatcher(
      (action) => action.type === 'vehicles/addVehicle/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to add vehicle';
      },
    );

    // assignVehicle lifecycle
    builder.addMatcher(
      (action) => action.type === 'vehicles/assignVehicle/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'vehicles/assignVehicle/fulfilled',
      (state, action) => {
        state.loading = false;
        if (action.payload) {
          const idx = state.vehicles.findIndex((v) => v.id === action.payload.id);
          if (idx >= 0) {
            state.vehicles[idx] = action.payload;
          }
          state.statusCounts = computeStatusCounts(state.vehicles);
        }
      },
    );
    builder.addMatcher(
      (action) => action.type === 'vehicles/assignVehicle/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to assign vehicle';
      },
    );

    // updateVehicleStatus lifecycle
    builder.addMatcher(
      (action) => action.type === 'vehicles/updateVehicleStatus/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'vehicles/updateVehicleStatus/fulfilled',
      (state, action) => {
        state.loading = false;
        if (action.payload) {
          const idx = state.vehicles.findIndex((v) => v.id === action.payload.id);
          if (idx >= 0) {
            state.vehicles[idx] = action.payload;
          }
          state.statusCounts = computeStatusCounts(state.vehicles);
        }
      },
    );
    builder.addMatcher(
      (action) => action.type === 'vehicles/updateVehicleStatus/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to update vehicle status';
      },
    );

    // fetchVehicle (single) lifecycle
    builder.addMatcher(
      (action) => action.type === 'vehicles/fetchVehicle/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'vehicles/fetchVehicle/fulfilled',
      (state, action) => {
        state.loading = false;
        state.currentVehicle = action.payload ?? null;
      },
    );
    builder.addMatcher(
      (action) => action.type === 'vehicles/fetchVehicle/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to fetch vehicle';
      },
    );
  },
});

export const { setFilter } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
