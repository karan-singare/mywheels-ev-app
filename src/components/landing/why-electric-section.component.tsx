import React from 'react';
import { View, Text } from 'react-native';
import { SectionWrapper } from '../shared/section-wrapper.component';
import {
  WHY_ELECTRIC_HEADER,
  WHY_ELECTRIC_CARD,
  WHY_ELECTRIC_STATS,
  WHY_ELECTRIC_BULLETS,
} from '../../constants/landing-data.constant';

export const WhyElectricSection: React.FC = () => {
  return (
    <SectionWrapper
      title={WHY_ELECTRIC_HEADER.title}
      subtitle={WHY_ELECTRIC_HEADER.label}
    >
      <View className="flex-col md:flex-row gap-6">
        {/* Left side — Go Electric card with stats */}
        <View className="bg-[#184cba] rounded-2xl p-6 md:w-1/3">
          <Text className="text-3xl mb-2">{WHY_ELECTRIC_CARD.icon}</Text>
          <Text className="text-2xl font-bold text-white mb-1">
            {WHY_ELECTRIC_CARD.title}
          </Text>
          <Text className="text-sm text-white/70 mb-6">
            {WHY_ELECTRIC_CARD.subtitle}
          </Text>

          {/* Stats */}
          <View className="flex-row gap-6">
            {WHY_ELECTRIC_STATS.map((stat) => (
              <View key={stat.label}>
                <Text className="text-2xl font-bold text-[#84d06e]">
                  {stat.value}
                </Text>
                <Text className="text-xs text-white/70">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Right side — Bullet points */}
        <View className="flex-1 gap-5">
          {WHY_ELECTRIC_BULLETS.map((bullet) => (
            <View key={bullet.title} className="flex-row gap-4">
              <View className="w-10 h-10 rounded-xl bg-[#184cba]/10 items-center justify-center">
                <Text className="text-lg">{bullet.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-[#141c6c] mb-1">
                  {bullet.title}
                </Text>
                <Text className="text-sm text-[#374151] leading-6">
                  {bullet.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SectionWrapper>
  );
};

export default WhyElectricSection;
