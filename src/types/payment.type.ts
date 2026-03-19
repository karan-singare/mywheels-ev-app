import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export interface Payment {
  id: string;
  rider_id: string;
  rental_id: string | null;
  plan_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  gateway_transaction_id: string | null;
  receipt_url: string | null;
  created_at: string;
}

export interface PaymentReceipt {
  payment_id: string;
  rider_name: string;
  plan_name: string;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id: string;
  date: string;
}

export interface PaymentIntent {
  id: string;
  gateway_order_id: string;
  amount: number;
}
