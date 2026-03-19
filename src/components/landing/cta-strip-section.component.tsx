import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CTA_STRIP,
  WHATSAPP_URL,
} from '../../constants/landing-data.constant';

interface CTAStripSectionProps {
  onGetStarted?: () => void;
}

export const CTAStripSection: React.FC<CTAStripSectionProps> = ({ onGetStarted }) => {
  const handleWhatsApp = () => {
    Linking.openURL(WHATSAPP_URL);
  };

  return (
    <LinearGradient
      colors={['#184cba', '#1a70c3', '#2994bf']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-6 py-16"
    >
      <View className="items-center max-w-xl mx-auto">
        {/* Headline */}
        <Text className="text-2xl font-bold text-white text-center mb-4 tracking-tight">
          {CTA_STRIP.headline}
        </Text>

        {/* Subtitle */}
        <Text className="text-sm text-white/80 text-center mb-8 leading-6">
          {CTA_STRIP.subtitle}
        </Text>

        {/* CTA Buttons */}
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={onGetStarted}
            className="px-8 py-4 rounded-2xl bg-[#84d06e]"
            accessibilityRole="button"
            accessibilityLabel={CTA_STRIP.ctaPrimary}
          >
            <Text className="text-[#141c6c] font-semibold text-sm">
              {CTA_STRIP.ctaPrimary}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleWhatsApp}
            className="px-8 py-4 rounded-2xl border border-white/25"
            accessibilityRole="button"
            accessibilityLabel={CTA_STRIP.ctaSecondary}
          >
            <Text className="text-white/80 font-medium text-sm">
              {CTA_STRIP.ctaSecondary}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default CTAStripSection;
