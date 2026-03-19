import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SectionWrapper } from '../shared/section-wrapper.component';
import {
  ABOUT_HEADER,
  ABOUT_FEATURES,
} from '../../constants/landing-data.constant';

export const AboutSection: React.FC = () => {
  return (
    <SectionWrapper title={ABOUT_HEADER.title} subtitle={ABOUT_HEADER.subtitle}>
      {/* Label */}
      <Text className="text-center text-sm text-[#6b7280] font-medium uppercase tracking-widest mb-6">
        {ABOUT_HEADER.label}
      </Text>

      {/* Feature cards — horizontal scroll on mobile */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-4 px-1 pb-2"
      >
        {ABOUT_FEATURES.map((feature) => (
          <View
            key={feature.title}
            className="w-72 bg-white rounded-2xl p-6 shadow-sm"
          >
            {/* Icon with colored background */}
            <View
              className="w-14 h-14 rounded-xl items-center justify-center mb-4"
              style={{ backgroundColor: feature.bg }}
            >
              <Text className="text-2xl">{feature.icon}</Text>
            </View>

            <Text
              className="text-lg font-semibold mb-2"
              style={{ color: feature.color }}
            >
              {feature.title}
            </Text>

            <Text className="text-sm text-[#374151] leading-6">
              {feature.desc}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SectionWrapper>
  );
};

export default AboutSection;
