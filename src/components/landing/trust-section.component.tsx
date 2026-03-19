import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { TRUST_LABEL, TRUST_BRANDS } from '../../constants/landing-data.constant';

export const TrustSection: React.FC = () => {
  return (
    <View className="py-10 px-5">
      <Text className="text-center text-sm text-[#6b7280] font-medium uppercase tracking-widest mb-6">
        {TRUST_LABEL}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row items-center justify-center gap-3 px-2"
      >
        {TRUST_BRANDS.map((brand) => (
          <View
            key={brand.name}
            className="px-5 py-2.5 rounded-full"
            style={{ backgroundColor: `${brand.color}15` }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: brand.color }}
            >
              {brand.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TrustSection;
