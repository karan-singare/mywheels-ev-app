import React from 'react';
import { View, Text } from 'react-native';
import { SectionWrapper } from '../shared/section-wrapper.component';
import { PricingCard } from '../shared/pricing-card.component';
import {
  PRICING_HEADER,
  PRICING_NOTE,
  PRICING_PLANS,
} from '../../constants/landing-data.constant';

export const PricingSection: React.FC = () => {
  return (
    <SectionWrapper
      title={PRICING_HEADER.title}
      subtitle={PRICING_HEADER.subtitle}
      variant="tint"
    >
      <View className="gap-6">
        {PRICING_PLANS.map((plan) => (
          <PricingCard
            key={plan.title}
            title={plan.title}
            price={plan.price}
            period={plan.period}
            features={plan.features}
            featured={plan.featured}
            tag={plan.tag}
          />
        ))}
      </View>

      {/* Note */}
      <Text className="text-center text-[#6b7280] text-sm mt-8 max-w-md mx-auto">
        {PRICING_NOTE}
      </Text>
    </SectionWrapper>
  );
};

export default PricingSection;
