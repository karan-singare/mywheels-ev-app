import { supabase } from '../config/supabase.constant';
import type { Payment, PaymentReceipt, PaymentIntent } from '../types/payment.type';
import type { PaymentMethod } from '../enums/payment-method.enum';

export async function initiatePayment(
  riderId: string,
  planId: string,
  method: PaymentMethod,
): Promise<PaymentIntent> {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      rider_id: riderId,
      plan_id: planId,
      payment_method: method,
      status: 'pending',
    })
    .select()
    .single();
  if (error) throw new Error(`Failed to initiate payment: ${error.message}`);
  return {
    id: data.id,
    gateway_order_id: data.gateway_transaction_id ?? data.id,
    amount: data.amount,
  } as PaymentIntent;
}

export async function confirmPayment(
  paymentId: string,
  gatewayResponse: unknown,
): Promise<Payment> {
  const transactionId =
    typeof gatewayResponse === 'object' &&
    gatewayResponse !== null &&
    'transaction_id' in gatewayResponse
      ? (gatewayResponse as { transaction_id: string }).transaction_id
      : null;

  const { data, error } = await supabase
    .from('payments')
    .update({
      status: 'success',
      gateway_transaction_id: transactionId,
    })
    .eq('id', paymentId)
    .select()
    .single();
  if (error) throw new Error(`Failed to confirm payment: ${error.message}`);
  return data as Payment;
}

export async function getPaymentHistory(
  riderId: string,
): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('rider_id', riderId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch payment history: ${error.message}`);
  return data as Payment[];
}

export async function getReceipt(
  paymentId: string,
): Promise<PaymentReceipt> {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      payment_method,
      gateway_transaction_id,
      created_at,
      riders!inner(full_name),
      rental_plans!inner(name)
    `)
    .eq('id', paymentId)
    .single();
  if (error) throw new Error(`Failed to fetch payment receipt: ${error.message}`);

  const row = data as Record<string, unknown>;
  const rider = row.riders as { full_name: string };
  const plan = row.rental_plans as { name: string };

  return {
    payment_id: row.id as string,
    rider_name: rider.full_name,
    plan_name: plan.name,
    amount: row.amount as number,
    payment_method: row.payment_method as PaymentMethod,
    transaction_id: (row.gateway_transaction_id as string) ?? '',
    date: row.created_at as string,
  };
}

export async function getAllPayments(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch all payments: ${error.message}`);
  return data as Payment[];
}
