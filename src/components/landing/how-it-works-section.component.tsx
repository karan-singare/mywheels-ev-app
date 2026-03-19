import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SectionWrapper } from '../shared/section-wrapper.component';
import { HOW_IT_WORKS_STEPS } from '../../constants/landing-data.constant';

export const HowItWorksSection: React.FC = () => {
  return (
    <SectionWrapper
      title="How It Works"
      subtitle="Register, verify, choose your plan, and start earning — simple and fast."
      variant="light"
    >
      {/* 5-step horizontal flow */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-4 px-1 pb-2"
      >
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <View
            key={step.title}
            className="w-44 bg-white rounded-2xl p-5 shadow-sm items-center"
          >
            {/* Step number */}
            <View className="w-8 h-8 rounded-full bg-[#184cba] items-center justify-center mb-3">
              <Text className="text-white text-xs font-bold">
                {index + 1}
              </Text>
            </View>

            {/* Icon */}
            <Text className="text-3xl mb-3">{step.icon}</Text>

            {/* Title */}
            <Text className="text-sm font-semibold text-[#141c6c] text-center mb-1">
              {step.title}
            </Text>

            {/* Description */}
            <Text className="text-xs text-[#374151] text-center leading-5">
              {step.desc}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SectionWrapper>
  );
};

export default HowItWorksSection;
