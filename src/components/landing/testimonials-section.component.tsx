import React from 'react';
import { View, Text } from 'react-native';
import { SectionWrapper } from '../shared/section-wrapper.component';
import {
  TESTIMONIALS_HEADER,
  TESTIMONIALS,
} from '../../constants/landing-data.constant';

const GRADIENT_COLORS: Record<string, [string, string]> = {
  'from-primary to-secondary': ['#184cba', '#1a70c3'],
  'from-tertiary to-teal': ['#2994bf', '#40b1af'],
  'from-green to-mint': ['#84d06e', '#61c194'],
};

export const TestimonialsSection: React.FC = () => {
  return (
    <SectionWrapper title={TESTIMONIALS_HEADER.title}>
      {/* Label */}
      <Text className="text-center text-sm text-[#6b7280] font-medium uppercase tracking-widest mb-6">
        {TESTIMONIALS_HEADER.label}
      </Text>

      <View className="gap-6">
        {TESTIMONIALS.map((testimonial) => {
          const gradientPair = GRADIENT_COLORS[testimonial.gradient] ?? ['#184cba', '#1a70c3'];

          return (
            <View
              key={testimonial.name}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              {/* Avatar + Info row */}
              <View className="flex-row items-center gap-3 mb-4">
                {/* Avatar circle with gradient-like background */}
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: gradientPair[0] }}
                >
                  <Text className="text-white font-bold text-sm">
                    {testimonial.initials}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className="text-[#141c6c] font-semibold text-sm">
                    {testimonial.name}
                  </Text>
                  <Text className="text-[#6b7280] text-xs">
                    {testimonial.location}
                  </Text>
                </View>
              </View>

              {/* Star rating */}
              <Text className="text-sm mb-3">⭐⭐⭐⭐⭐</Text>

              {/* Quote */}
              <Text className="text-sm text-[#374151] leading-6">
                "{testimonial.quote}"
              </Text>
            </View>
          );
        })}
      </View>
    </SectionWrapper>
  );
};

export default TestimonialsSection;
