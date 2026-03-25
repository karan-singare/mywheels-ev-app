import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import { AlertCircle } from 'lucide-react-native';
import { useAuth } from '../../hooks/use-auth.hook';
import { useRider } from '../../hooks/use-rider.hook';
import { RENTAL_PLANS } from '../../constants/plans.constant';
import { formatCurrency } from '../../utils/formatters.util';
import { supabase } from '../../config/supabase.constant';
import { colors } from '../../config/theme.constant';
import type { RiderStackParamList } from '../../types/navigation.type';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PaymentRouteProp = RouteProp<RiderStackParamList, 'Payment'>;
type PaymentNavProp = NativeStackNavigationProp<RiderStackParamList, 'Payment'>;

const RAZORPAY_KEY = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || '';

function periodText(days: number): string {
  if (days === 1) return '1 day';
  return `${days} days`;
}

export function PaymentScreen() {
  const route = useRoute<PaymentRouteProp>();
  const navigation = useNavigation<PaymentNavProp>();
  const { user } = useAuth();
  const { profile } = useRider();

  const { planId } = route.params;
  const plan = RENTAL_PLANS.find((p) => p.id === planId);

  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = useCallback(async () => {
    if (!user?.id || !plan || !profile) return;

    setProcessing(true);
    setErrorMessage(null);

    try {
      // Razorpay amount is in paise (1 INR = 100 paise)
      const amountInPaise = plan.price * 100;

      const options = {
        description: `MyWheels EV - ${plan.name}`,
        image: 'https://mywheelsev.com/logo.png',
        currency: 'INR',
        key: RAZORPAY_KEY,
        amount: amountInPaise,
        name: 'MyWheels EV',
        prefill: {
          contact: profile.phone ? `+91${profile.phone}` : '',
          name: profile.full_name || '',
        },
        theme: { color: colors.primary },
      };

      console.log('[payment] Opening Razorpay with options:', { ...options, key: '***' });
      const paymentResponse = await RazorpayCheckout.open(options);

      // Record payment in Supabase
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          rider_id: profile.id,
          plan_id: plan.id,
          amount: plan.price,
          payment_method: 'upi', // Razorpay handles method selection
          status: 'success',
          gateway_transaction_id: paymentResponse.razorpay_payment_id,
        });

      if (paymentError) {
        console.error('[payment] DB insert error:', paymentError);
      }

      Alert.alert('Payment Successful', `Your ${plan.name} is now active.`, [
        { text: 'OK', onPress: () => navigation.navigate('RiderTabs') },
      ]);
    } catch (err: unknown) {
      const error = err as { code?: number; description?: string };
      if (error.code === 2) {
        // User cancelled
        setErrorMessage(null);
      } else {
        setErrorMessage(error.description || 'Payment failed. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  }, [user?.id, plan, profile, navigation]);

  if (!plan) {
    return (
      <View className="flex-1 bg-[#f8fafc] justify-center items-center">
        <Text className="text-base text-[#6b7280]">Plan not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f8fafc]" testID="payment-screen">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Order Summary */}
        <View className="bg-white rounded-xl p-5 mb-6 border border-[#e5e7eb]" testID="order-summary">
          <Text className="text-base font-semibold text-[#141c6c] mb-3">Order Summary</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-[#6b7280]">Plan</Text>
            <Text className="text-sm font-semibold text-[#141c6c]" testID="order-plan-name">{plan.name}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-[#6b7280]">Price</Text>
            <Text className="text-sm font-semibold text-[#141c6c]" testID="order-plan-price">{formatCurrency(plan.price)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-[#6b7280]">Rental Period</Text>
            <Text className="text-sm font-semibold text-[#141c6c]" testID="order-plan-period">{periodText(plan.period_days)}</Text>
          </View>
        </View>

        {/* Info note */}
        <View className="bg-blue-50 rounded-xl p-4 mb-6">
          <Text className="text-sm text-[#1e40af]">
            You'll be redirected to Razorpay's secure checkout to complete payment via UPI, card, or net banking.
          </Text>
        </View>

        {/* Error */}
        {errorMessage && (
          <View className="flex-row items-start bg-red-50 border border-red-200 rounded-xl p-4 mb-6" testID="payment-error">
            <AlertCircle color="#dc2626" size={20} />
            <Text className="text-sm text-red-700 ml-3 flex-1">{errorMessage}</Text>
          </View>
        )}

        {/* Pay Button */}
        <TouchableOpacity
          testID="pay-now-button"
          className={`py-4 rounded-xl items-center ${processing ? 'bg-[#a3b8e0]' : 'bg-[#184cba]'}`}
          disabled={processing}
          onPress={handlePay}
        >
          {processing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-white text-base font-bold">Pay {formatCurrency(plan.price)}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default PaymentScreen;
