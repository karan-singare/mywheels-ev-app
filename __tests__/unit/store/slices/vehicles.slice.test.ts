import vehiclesReducer, { VehiclesState, setFilter } from '../../../../src/store/slices/vehicles.slice';
import { Vehicle } from '../../../../src/types/vehicle.type';

const initialState: VehiclesState = {
  vehicles: [],
  statusCounts: { available: 0, rented: 0, maintenance: 0 },
  currentFilter: 'all',
  loading: false,
  error: null,
};

const mockVehicle: Vehicle = {
  id: 'v1',
  vehicle_id: 'MW-001',
  model: 'Ather 450X',
  registration_number: 'TS09AB1234',
  battery_number: 'BAT-001',
  status: 'available',
  assigned_rider_id: null,
  maintenance_reason: null,
  last_gps_lat: null,
  last_gps_lng: null,
  last_gps_timestamp: null,
  last_battery_percentage: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('vehicles.slice', () => {
  it('returns initial state', () => {
    expect(vehiclesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('setFilter updates currentFilter', () => {
    const state = vehiclesReducer(initialState, setFilter('rented'));
    expect(state.currentFilter).toBe('rented');
  });

  it('fetchVehicles/fulfilled sets vehicles and computes counts', () => {
    const vehicles: Vehicle[] = [
      mockVehicle,
      { ...mockVehicle, id: 'v2', status: 'rented' },
      { ...mockVehicle, id: 'v3', status: 'maintenance' },
      { ...mockVehicle, id: 'v4', status: 'available' },
    ];
    const state = vehiclesReducer(
      { ...initialState, loading: true },
      { type: 'vehicles/fetchVehicles/fulfilled', payload: vehicles },
    );
    expect(state.loading).toBe(false);
    expect(state.vehicles).toHaveLength(4);
    expect(state.statusCounts).toEqual({ available: 2, rented: 1, maintenance: 1 });
  });

  it('addVehicle/fulfilled appends vehicle and updates counts', () => {
    const state = vehiclesReducer(
      { ...initialState, loading: true },
      { type: 'vehicles/addVehicle/fulfilled', payload: mockVehicle },
    );
    expect(state.vehicles).toHaveLength(1);
    expect(state.statusCounts.available).toBe(1);
  });

  it('assignVehicle/fulfilled updates vehicle in list', () => {
    const assigned = { ...mockVehicle, status: 'rented' as const, assigned_rider_id: 'r1' };
    const stateWithVehicle: VehiclesState = {
      ...initialState,
      vehicles: [mockVehicle],
      statusCounts: { available: 1, rented: 0, maintenance: 0 },
      loading: true,
    };
    const state = vehiclesReducer(stateWithVehicle, {
      type: 'vehicles/assignVehicle/fulfilled',
      payload: assigned,
    });
    expect(state.vehicles[0].status).toBe('rented');
    expect(state.vehicles[0].assigned_rider_id).toBe('r1');
    expect(state.statusCounts).toEqual({ available: 0, rented: 1, maintenance: 0 });
  });
});
