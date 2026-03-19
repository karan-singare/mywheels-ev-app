import { useAppSelector, useAppDispatch } from '../store';
import {
  initiatePayment,
  confirmPayment,
  fetchHistory,
  fetchReceipt,
} from '../store/thunks/payments.thunk';
import type { PaymentMethod } from '../enums/payment-method.enum';

export function usePayments() {
  const dispatch = useAppDispatch();
  const { payments, currentReceipt, loading, error } = useAppSelector((s) => s.payments);

  return {
    payments,
    currentReceipt,
    loading,
    error,
    initiatePayment: (riderId: string, planId: string, method: PaymentMethod) =>
      dispatch(initiatePayment({ riderId, planId, method })),
    confirmPayment: (paymentId: string, gatewayResponse: unknown) =>
      dispatch(confirmPayment({ paymentId, gatewayResponse })),
    fetchHistory: (riderId: string) => dispatch(fetchHistory(riderId)),
    fetchReceipt: (paymentId: string) => dispatch(fetchReceipt(paymentId)),
  };
}
