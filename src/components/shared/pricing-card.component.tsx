import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { CONTACT_INFO } from '../../constants/landing-data.constant';

export interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
  tag?: string;
  onSelect?: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  features,
  featured = false,
  tag,
  onSelect,
}) => {
  const handlePress = () => {
    if (onSelect) {
      onSelect();
    } else {
      Linking.openURL(`tel:${CONTACT_INFO.phone.replaceAll(' ', '')}`);
    }
  };

  return (
    <View
      className={`rounded-2xl p-6 ${
        featured
          ? 'bg-[#184cba] scale-105'
          : 'bg-white border border-gray-200'
      }`}
    >
      {/* Most Popular badge for featured */}
      {featured && (
        <View className="bg-[#84d06e] self-start rounded-full px-3 py-1 mb-4">
          <Text className="text-[#141c6c] text-xs font-semibold">Most Popular</Text>
        </View>
      )}

      {/* Tag */}
      {tag && (
        <Text
          className={`text-xs font-medium mb-2 ${
            featured ? 'text-white/70' : 'text-[#6b7280]'
          }`}
        >
          {tag}
        </Text>
      )}

      {/* Title */}
      <Text
        className={`text-lg font-semibold mb-2 ${
          featured ? 'text-white' : 'text-[#141c6c]'
        }`}
      >
        {title}
      </Text>

      {/* Price */}
      <View className="flex-row items-baseline mb-6">
        <Text
          className={`text-3xl font-bold ${
            featured ? 'text-white' : 'text-[#141c6c]'
          }`}
        >
          ₹{price}
        </Text>
        <Text
          className={`text-sm ml-1 ${
            featured ? 'text-white/70' : 'text-[#6b7280]'
          }`}
        >
          {period}
        </Text>
      </View>

      {/* Features list */}
      <View className="mb-6 gap-3">
        {features.map((feature) => (
          <View key={feature} className="flex-row items-start gap-2">
            <Text className="text-sm text-[#84d06e]">
              ✓
            </Text>
            <Text
              className={`text-sm flex-1 ${
                featured ? 'text-white/90' : 'text-[#374151]'
              }`}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        onPress={handlePress}
        className={`py-3 rounded-xl items-center ${
          featured
            ? 'bg-[#84d06e]'
            : 'bg-[#184cba]'
        }`}
        accessibilityRole="button"
        accessibilityLabel={`Get Started with ${title}`}
      >
        <Text
          className={`font-semibold text-sm ${
            featured ? 'text-[#141c6c]' : 'text-white'
          }`}
        >
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PricingCard;
