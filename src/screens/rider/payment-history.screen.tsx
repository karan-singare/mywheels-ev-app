import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../hooks/use-auth.hook';
import { usePayments } from '../../hooks/use-payments.hook';
import { formatCurrency, formatDate } from '../../utils/formatters.util';
import { RENTAL_PLANS } from '../../constants/plans.constant';
import { colors } from '../../config/theme.constant';
import type { Payment } from '../../types/payment.type';
import type { PaymentMethod } from '../../enums/payment-method.enum';
import type { PaymentStatus } from '../../enums/payment-status.enum';

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  upi: 'UPI',
  debit_card: 'Debit Card',
  credit_card: 'Credit Card',
  net_banking: 'Net Banking',
};

const STATUS_STYLES: Record<PaymentStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e', label: 'Pending' },
  success: { bg: '#dcfce7', text: '#166534', label: 'Success' },
  failed: { bg: '#fee2e2', text: '#991b1b', label: 'Failed' },
};

function getPlanName(planId: string): string {
  const plan = RENTAL_PLANS.find((p) => p.id === planId);
  return plan?.name ?? planId;
}

function PaymentCard({ item }: Readonly<{ item: Payment }>) {
  const status = STATUS_STYLES[item.status] ?? STATUS_STYLES.pending;

  return (
    <View
      testID={`payment-card-${item.id}`}
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text testID={`payment-plan-${item.id}`} style={{ fontSize: 15, fontWeight: '700', color: colors.textMain, flex: 1 }}>
          {getPlanName(item.plan_id)}
        </Text>
        <View
          testID={`payment-status-${item.id}`}
          style={{
            backgroundColor: status.bg,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: status.text, fontSize: 12, fontWeight: '600' }}>
            {status.label}
          </Text>
        </View>
      </View>
      <Text testID={`payment-amount-${item.id}`} style={{ fontSize: 18, fontWeight: '700', color: colors.primary, marginBottom: 6 }}>
        {formatCurrency(item.amount)}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 13, color: colors.muted }}>
          {PAYMENT_METHOD_LABELS[item.payment_method] ?? item.payment_method}
        </Text>
        <Text testID={`payment-date-${item.id}`} style={{ fontSize: 13, color: colors.mutedLight }}>
          {formatDate(item.created_at)}
        </Text>
      </View>
    </View>
  );
}

export function PaymentHistoryScreen() {
  const { user } = useAuth();
  const { payments, loading, error, fetchHistory } = usePayments();

  const loadPayments = useCallback(() => {
    if (user?.id) {
      fetchHistory(user.id);
    }
  }, [user?.id, fetchHistory]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  if (loading && payments.length === 0) {
    return (
      <View testID="payment-history-loading" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View testID="payment-history-error" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg, padding: 24 }}>
        <Text style={{ fontSize: 16, color: '#ef4444', fontWeight: '600', marginBottom: 12, textAlign: 'center' }}>
          {error}
        </Text>
        <TouchableOpacity
          testID="payment-history-retry"
          onPress={loadPayments}
          style={{ backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (payments.length === 0) {
    return (
      <View testID="payment-history-empty" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg, padding: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textMain, marginBottom: 8 }}>
          No payments yet
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted, textAlign: 'center' }}>
          Your payment history will appear here once you make a payment.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      testID="payment-history-list"
      data={payments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PaymentCard item={item} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      style={{ flex: 1, backgroundColor: colors.bg }}
    />
  );
}
