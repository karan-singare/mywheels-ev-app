import { createAsyncThunk } from '@reduxjs/toolkit';
import * as vehicleService from '../../services/vehicle.service';
import type { VehicleInput } from '../../types/vehicle.type';
import type { VehicleStatus } from '../../enums/vehicle-status.enum';

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (filter: VehicleStatus | undefined, { rejectWithValue }) => {
    try {
      const vehicles = await vehicleService.getVehicles(filter);
      return vehicles;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const addVehicle = createAsyncThunk(
  'vehicles/addVehicle',
  async (data: VehicleInput, { rejectWithValue }) => {
    try {
      const vehicle = await vehicleService.addVehicle(data);
      return vehicle;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const assignVehicle = createAsyncThunk(
  'vehicles/assignVehicle',
  async (
    { vehicleId, riderId }: { vehicleId: string; riderId: string },
    { rejectWithValue },
  ) => {
    try {
      const vehicle = await vehicleService.assignVehicle(vehicleId, riderId);
      return vehicle;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const updateVehicleStatus = createAsyncThunk(
  'vehicles/updateVehicleStatus',
  async (
    { vehicleId, status, reason }: { vehicleId: string; status: VehicleStatus; reason?: string },
    { rejectWithValue },
  ) => {
    try {
      const vehicle = await vehicleService.updateStatus(vehicleId, status, reason);
      return vehicle;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);
