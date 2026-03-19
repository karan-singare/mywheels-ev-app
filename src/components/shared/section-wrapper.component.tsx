import React from 'react';
import { View, Text } from 'react-native';

export interface SectionWrapperProps {
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'light' | 'tint';
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  default: '',
  light: 'bg-white',
  tint: 'bg-primary/5',
};

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  title,
  subtitle,
  variant = 'default',
  children,
}) => {
  return (
    <View className={`px-5 py-16 md:py-20 ${variantClasses[variant] ?? ''}`}>
      <View className="max-w-7xl mx-auto w-full">
        {title && (
          <View className="items-center mb-10">
            <Text className="text-2xl md:text-3xl font-semibold text-[#141c6c] tracking-tight text-center">
              {title}
            </Text>
            <View className="mt-4 w-12 h-[3px] rounded-full bg-[#184cba]" />
            {subtitle && (
              <Text className="mt-4 text-base text-[#374151] text-center max-w-xl leading-7">
                {subtitle}
              </Text>
            )}
          </View>
        )}
        {children}
      </View>
    </View>
  );
};

export default SectionWrapper;
