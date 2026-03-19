import { createAsyncThunk } from '@reduxjs/toolkit';
import * as paymentService from '../../services/payment.service';
import type { PaymentMethod } from '../../enums/payment-method.enum';

export const initiatePayment = createAsyncThunk(
  'payments/initiatePayment',
  async (
    { riderId, planId, method }: { riderId: string; planId: string; method: PaymentMethod },
    { rejectWithValue },
  ) => {
    try {
      const intent = await paymentService.initiatePayment(riderId, planId, method);
      return intent;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const confirmPayment = createAsyncThunk(
  'payments/confirmPayment',
  async (
    { paymentId, gatewayResponse }: { paymentId: string; gatewayResponse: unknown },
    { rejectWithValue },
  ) => {
    try {
      const payment = await paymentService.confirmPayment(paymentId, gatewayResponse);
      return payment;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const fetchHistory = createAsyncThunk(
  'payments/fetchHistory',
  async (riderId: string, { rejectWithValue }) => {
    try {
      const payments = await paymentService.getPaymentHistory(riderId);
      return payments;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const fetchReceipt = createAsyncThunk(
  'payments/fetchReceipt',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const receipt = await paymentService.getReceipt(paymentId);
      return receipt;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);
