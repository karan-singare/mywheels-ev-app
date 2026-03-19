import { createSlice } from '@reduxjs/toolkit';
import { Payment, PaymentReceipt } from '../../types/payment.type';

export interface PaymentsState {
  payments: Payment[];
  currentReceipt: PaymentReceipt | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  payments: [],
  currentReceipt: null,
  loading: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // initiatePayment lifecycle
    builder.addMatcher(
      (action) => action.type === 'payments/initiatePayment/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'payments/initiatePayment/fulfilled',
      (state) => { state.loading = false; },
    );
    builder.addMatcher(
      (action) => action.type === 'payments/initiatePayment/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to initiate payment';
      },
    );

    // confirmPayment lifecycle
    builder.addMatcher(
      (action) => action.type === 'payments/confirmPayment/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'payments/confirmPayment/fulfilled',
      (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.payments.unshift(action.payload);
        }
      },
    );
    builder.addMatcher(
      (action) => action.type === 'payments/confirmPayment/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to confirm payment';
      },
    );

    // fetchHistory lifecycle
    builder.addMatcher(
      (action) => action.type === 'payments/fetchHistory/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'payments/fetchHistory/fulfilled',
      (state, action) => {
        state.loading = false;
        state.payments = action.payload ?? [];
      },
    );
    builder.addMatcher(
      (action) => action.type === 'payments/fetchHistory/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to fetch payment history';
      },
    );

    // fetchReceipt lifecycle
    builder.addMatcher(
      (action) => action.type === 'payments/fetchReceipt/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'payments/fetchReceipt/fulfilled',
      (state, action) => {
        state.loading = false;
        state.currentReceipt = action.payload ?? null;
      },
    );
    builder.addMatcher(
      (action) => action.type === 'payments/fetchReceipt/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to fetch receipt';
      },
    );
  },
});

export default paymentsSlice.reducer;
