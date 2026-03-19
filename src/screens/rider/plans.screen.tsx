import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ShieldAlert } from 'lucide-react-native';
import { useKYC } from '../../hooks/use-kyc.hook';
import { PricingCard } from '../../components/shared/pricing-card.component';
import { RENTAL_PLANS } from '../../constants/plans.constant';
import { colors } from '../../config/theme.constant';
import type { RentalPlan } from '../../types/rental.type';

function formatPrice(price: number): string {
  return price.toLocaleString('en-IN');
}

function periodLabel(plan: RentalPlan): string {
  if (plan.type === 'daily') return '/day';
  if (plan.type === 'weekly') return '/week';
  return '/month';
}

export function PlansScreen() {
  const { status } = useKYC();
  const navigation = useNavigation();

  if (status !== 'approved') {
    return (
      <View
        className="flex-1 justify-center items-center bg-[#f8fafc] px-8"
        testID="kyc-gating-container"
      >
        <ShieldAlert color={colors.primary} size={64} testID="kyc-gating-icon" />
        <Text
          className="text-lg font-bold text-[#141c6c] text-center mt-5"
          testID="kyc-gating-message"
        >
          KYC approval is required to view plans
        </Text>
        <Text className="text-sm text-[#6b7280] text-center mt-2">
          Complete your KYC verification to browse and select rental plans.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-[#184cba] py-3 px-6 rounded-lg"
          testID="kyc-gating-navigate-button"
          onPress={() => navigation.navigate('KYC' as never)}
        >
          <Text className="text-white text-base font-semibold">
            Go to KYC Verification
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSelectPlan = (planId: string) => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Payment' as never, { planId } as never);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#f8fafc]"
      contentContainerClassName="px-5 py-6 pb-10"
      testID="plans-screen"
    >
      <Text
        className="text-2xl font-bold text-[#141c6c] text-center mb-1"
        testID="plans-title"
      >
        Choose Your Plan
      </Text>
      <Text className="text-sm text-[#6b7280] text-center mb-6">
        Simple, transparent pricing. No hidden charges.
      </Text>

      <View className="gap-5" testID="plans-list">
        {RENTAL_PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            title={plan.name}
            price={formatPrice(plan.price)}
            period={periodLabel(plan)}
            features={plan.features}
            featured={plan.featured}
            tag={plan.tag ?? undefined}
            onSelect={() => handleSelectPlan(plan.id)}
          />
        ))}
      </View>

      <Text
        className="text-xs text-[#6b7280] text-center mt-6 px-4"
        testID="plans-note"
      >
        Contact us for exact rates based on your usage and vehicle preference.
      </Text>
    </ScrollView>
  );
}

export default PlansScreen;
