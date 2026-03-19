import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SectionWrapper } from '../shared/section-wrapper.component';
import {
  FAQ_HEADER,
  FAQ_ITEMS,
} from '../../constants/landing-data.constant';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <SectionWrapper title={FAQ_HEADER.title}>
      {/* Label */}
      <Text className="text-center text-sm text-[#6b7280] font-medium uppercase tracking-widest mb-6">
        {FAQ_HEADER.label}
      </Text>

      <View className="gap-3">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <View
              key={item.q}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <TouchableOpacity
                onPress={() => toggle(index)}
                className="flex-row items-center justify-between p-5"
                accessibilityRole="button"
                accessibilityLabel={item.q}
                accessibilityState={{ expanded: isOpen }}
              >
                <Text className="text-[#141c6c] font-semibold text-sm flex-1 pr-4">
                  {item.q}
                </Text>
                <Text
                  className="text-[#184cba] text-xl font-light"
                  style={{
                    transform: [{ rotate: isOpen ? '45deg' : '0deg' }],
                  }}
                >
                  +
                </Text>
              </TouchableOpacity>

              {isOpen && (
                <View className="px-5 pb-5">
                  <Text className="text-sm text-[#374151] leading-6">
                    {item.a}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </SectionWrapper>
  );
};

export default FAQSection;
