import { createAsyncThunk } from '@reduxjs/toolkit';
import * as riderService from '../../services/rider.service';
import type { RiderProfileInput } from '../../types/rider.type';

export const fetchProfile = createAsyncThunk(
  'rider/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const profile = await riderService.getProfile(userId);
      return profile;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const createProfile = createAsyncThunk(
  'rider/createProfile',
  async (
    { userId, data }: { userId: string; data: RiderProfileInput },
    { rejectWithValue },
  ) => {
    try {
      const profile = await riderService.createProfile(userId, data);
      return profile;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  'rider/updateProfile',
  async (
    { userId, data }: { userId: string; data: Partial<RiderProfileInput> },
    { rejectWithValue },
  ) => {
    try {
      const profile = await riderService.updateProfile(userId, data);
      return profile;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);
