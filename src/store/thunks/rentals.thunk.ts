import { createAsyncThunk } from '@reduxjs/toolkit';
import * as rentalService from '../../services/rental.service';

export const fetchActiveRental = createAsyncThunk(
  'rentals/fetchActiveRental',
  async (riderId: string, { rejectWithValue }) => {
    try {
      const rental = await rentalService.getActiveRental(riderId);
      return rental;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const fetchHistory = createAsyncThunk(
  'rentals/fetchHistory',
  async (riderId: string, { rejectWithValue }) => {
    try {
      const history = await rentalService.getRentalHistory(riderId);
      return history;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const createRental = createAsyncThunk(
  'rentals/createRental',
  async (
    { riderId, planId, vehicleId }: { riderId: string; planId: string; vehicleId: string },
    { rejectWithValue },
  ) => {
    try {
      const rental = await rentalService.createRental(riderId, planId, vehicleId);
      return rental;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const fetchAllActive = createAsyncThunk(
  'rentals/fetchAllActive',
  async (_, { rejectWithValue }) => {
    try {
      const rentals = await rentalService.getAllActiveRentals();
      return rentals;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);
