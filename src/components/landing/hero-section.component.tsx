import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { HERO } from '../../constants/landing-data.constant';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <View className="relative min-h-[600px] w-full">
      {/* Gradient overlay background */}
      <LinearGradient
        colors={['rgba(20,28,108,0.92)', 'rgba(24,76,186,0.85)', 'rgba(28,41,139,0.88)', 'rgba(20,28,108,0.90)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      {/* Content */}
      <View className="relative z-10 flex-1 justify-center px-6 py-20">
        <View className="max-w-xl">
          {/* Tagline */}
          <Text className="text-[#84d06e] text-sm font-semibold uppercase tracking-widest mb-6">
            {HERO.tagline}
          </Text>

          {/* Headline */}
          <Text className="text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
            We Power Hyderabad's{' '}
            <Text className="text-[#84d06e]">Delivery Heroes</Text> ⚡
          </Text>

          {/* Subtitle */}
          <Text className="text-base text-white/80 mb-10 leading-7">
            {HERO.subtitle}
          </Text>

          {/* CTA Buttons */}
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={onGetStarted}
              className="px-8 py-4 rounded-2xl bg-[#84d06e]"
              accessibilityRole="button"
              accessibilityLabel={HERO.ctaPrimary}
            >
              <Text className="text-[#141c6c] font-semibold text-sm">
                {HERO.ctaPrimary}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-8 py-4 rounded-2xl border border-white/25"
              accessibilityRole="button"
              accessibilityLabel={HERO.ctaSecondary}
            >
              <Text className="text-white/80 font-medium text-sm">
                {HERO.ctaSecondary}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HeroSection;
