import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CreditCard, Smartphone, Building2, Banknote, AlertCircle } from 'lucide-react-native';
import { useAuth } from '../../hooks/use-auth.hook';
import { usePayments } from '../../hooks/use-payments.hook';
import { RENTAL_PLANS } from '../../constants/plans.constant';
import { formatCurrency } from '../../utils/formatters.util';
import { colors } from '../../config/theme.constant';
import type { PaymentMethod } from '../../enums/payment-method.enum';
import type { RiderStackParamList } from '../../types/navigation.type';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PaymentRouteProp = RouteProp<RiderStackParamList, 'Payment'>;
type PaymentNavProp = NativeStackNavigationProp<RiderStackParamList, 'Payment'>;

interface MethodOption {
  id: PaymentMethod;
  label: string;
  icon: React.ReactNode;
}

const PAYMENT_METHODS: MethodOption[] = [
  { id: 'upi', label: 'UPI', icon: <Smartphone color={colors.primary} size={24} /> },
  { id: 'debit_card', label: 'Debit Card', icon: <CreditCard color={colors.primary} size={24} /> },
  { id: 'credit_card', label: 'Credit Card', icon: <Banknote color={colors.primary} size={24} /> },
  { id: 'net_banking', label: 'Net Banking', icon: <Building2 color={colors.primary} size={24} /> },
];

function periodText(days: number): string {
  if (days === 1) return '1 day';
  return `${days} days`;
}

export function PaymentScreen() {
  const route = useRoute<PaymentRouteProp>();
  const navigation = useNavigation<PaymentNavProp>();
  const { user } = useAuth();
  const { initiatePayment, confirmPayment } = usePayments();

  const { planId } = route.params;
  const plan = RENTAL_PLANS.find((p) => p.id === planId);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = useCallback(async () => {
    if (!selectedMethod || !user?.id || !plan) return;

    setProcessing(true);
    setErrorMessage(null);

    try {
      const intentResult = await initiatePayment(user.id, plan.id, selectedMethod);
      const intent = intentResult.payload as { id: string; gateway_order_id: string; amount: number } | undefined;

      if (!intent?.id) {
        throw new Error('Payment initiation failed. Please try again.');
      }

      // Simulate gateway processing (stub)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const confirmResult = await confirmPayment(intent.id, {
        transaction_id: `txn_${Date.now()}`,
        status: 'success',
      });

      if (confirmResult.meta.requestStatus === 'rejected') {
        throw new Error('Payment confirmation failed. Please try again.');
      }

      // Success — navigate to dashboard
      navigation.navigate('RiderTabs');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setErrorMessage(message);
    } finally {
      setProcessing(false);
    }
  }, [selectedMethod, user?.id, plan, initiatePayment, confirmPayment, navigation]);

  if (!plan) {
    return (
      <View className="flex-1 bg-[#f8fafc] justify-center items-center">
        <Text className="text-base text-[#6b7280]">Plan not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f8fafc]" testID="payment-screen">
      <ScrollView
        contentContainerClassName="px-5 py-6 pb-10"
        testID="payment-scroll"
      >
        {/* Order Summary */}
        <View
          className="bg-white rounded-xl p-5 mb-6 border border-[#e5e7eb]"
          testID="order-summary"
        >
          <Text className="text-base font-semibold text-[#141c6c] mb-3">
            Order Summary
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-[#6b7280]">Plan</Text>
            <Text className="text-sm font-semibold text-[#141c6c]" testID="order-plan-name">
              {plan.name}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-[#6b7280]">Price</Text>
            <Text className="text-sm font-semibold text-[#141c6c]" testID="order-plan-price">
              {formatCurrency(plan.price)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-[#6b7280]">Rental Period</Text>
            <Text className="text-sm font-semibold text-[#141c6c]" testID="order-plan-period">
              {periodText(plan.period_days)}
            </Text>
          </View>
        </View>

        {/* Payment Method Selection */}
        <Text className="text-base font-semibold text-[#141c6c] mb-3">
          Select Payment Method
        </Text>
        <View className="gap-3 mb-6" testID="payment-methods">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = selectedMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                testID={`payment-method-${method.id}`}
                accessibilityRole="radio"
                accessibilityLabel={method.label}
                accessibilityState={{ selected: isSelected }}
                className={`flex-row items-center p-4 rounded-xl border ${
                  isSelected
                    ? 'border-[#184cba] bg-[#eef2ff]'
                    : 'border-[#e5e7eb] bg-white'
                }`}
                onPress={() => {
                  setSelectedMethod(method.id);
                  setErrorMessage(null);
                }}
                disabled={processing}
              >
                {method.icon}
                <Text
                  className={`ml-3 text-base ${
                    isSelected ? 'font-semibold text-[#184cba]' : 'text-[#374151]'
                  }`}
                >
                  {method.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Error State */}
        {errorMessage && (
          <View
            className="flex-row items-start bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
            testID="payment-error"
          >
            <AlertCircle color="#dc2626" size={20} />
            <View className="ml-3 flex-1">
              <Text className="text-sm text-red-700 mb-2">{errorMessage}</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  testID="payment-retry-button"
                  accessibilityRole="button"
                  accessibilityLabel="Retry payment"
                  onPress={handlePay}
                >
                  <Text className="text-sm font-semibold text-[#184cba]">Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="payment-change-method-button"
                  accessibilityRole="button"
                  accessibilityLabel="Change payment method"
                  onPress={() => {
                    setSelectedMethod(null);
                    setErrorMessage(null);
                  }}
                >
                  <Text className="text-sm font-semibold text-[#6b7280]">Change Method</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Pay Now Button */}
        <TouchableOpacity
          testID="pay-now-button"
          accessibilityRole="button"
          accessibilityLabel={`Pay ${formatCurrency(plan.price)}`}
          className={`py-4 rounded-xl items-center ${
            selectedMethod && !processing ? 'bg-[#184cba]' : 'bg-[#a3b8e0]'
          }`}
          disabled={!selectedMethod || processing}
          onPress={handlePay}
        >
          {processing ? (
            <ActivityIndicator color="#ffffff" size="small" testID="payment-loading" />
          ) : (
            <Text className="text-white text-base font-bold">
              Pay {formatCurrency(plan.price)}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default PaymentScreen;
