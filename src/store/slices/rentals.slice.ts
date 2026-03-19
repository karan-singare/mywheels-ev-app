import { createSlice } from '@reduxjs/toolkit';
import { Rental } from '../../types/rental.type';

export interface RentalsState {
  activeRental: Rental | null;
  history: Rental[];
  allActive: Rental[];
  loading: boolean;
  error: string | null;
}

const initialState: RentalsState = {
  activeRental: null,
  history: [],
  allActive: [],
  loading: false,
  error: null,
};

const rentalsSlice = createSlice({
  name: 'rentals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchActiveRental lifecycle
    builder.addMatcher(
      (action) => action.type === 'rentals/fetchActiveRental/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'rentals/fetchActiveRental/fulfilled',
      (state, action) => {
        state.loading = false;
        state.activeRental = action.payload ?? null;
      },
    );
    builder.addMatcher(
      (action) => action.type === 'rentals/fetchActiveRental/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to fetch active rental';
      },
    );

    // fetchHistory lifecycle
    builder.addMatcher(
      (action) => action.type === 'rentals/fetchHistory/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'rentals/fetchHistory/fulfilled',
      (state, action) => {
        state.loading = false;
        state.history = action.payload ?? [];
      },
    );
    builder.addMatcher(
      (action) => action.type === 'rentals/fetchHistory/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to fetch rental history';
      },
    );

    // createRental lifecycle
    builder.addMatcher(
      (action) => action.type === 'rentals/createRental/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'rentals/createRental/fulfilled',
      (state, action) => {
        state.loading = false;
        state.activeRental = action.payload ?? null;
      },
    );
    builder.addMatcher(
      (action) => action.type === 'rentals/createRental/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to create rental';
      },
    );

    // fetchAllActive lifecycle (admin)
    builder.addMatcher(
      (action) => action.type === 'rentals/fetchAllActive/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'rentals/fetchAllActive/fulfilled',
      (state, action) => {
        state.loading = false;
        state.allActive = action.payload ?? [];
      },
    );
    builder.addMatcher(
      (action) => action.type === 'rentals/fetchAllActive/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to fetch all active rentals';
      },
    );
  },
});

export default rentalsSlice.reducer;
