import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { colors } from '../../config/theme.constant';

export interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  label?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  error,
  label = 'Phone Number',
}) => {
  const handleChange = (text: string) => {
    const numeric = text.replaceAll(/\D/g, '');
    if (numeric.length <= 10) {
      onChangeText(numeric);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-[#141c6c] mb-1.5">{label}</Text>
      <View
        className={`flex-row items-center rounded-xl border px-3 h-12 bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <View className="mr-2 pr-2 border-r border-gray-300">
          <Text className="text-base text-[#374151] font-medium">+91</Text>
        </View>
        <TextInput
          className="flex-1 text-base text-[#141c6c]"
          value={value}
          onChangeText={handleChange}
          placeholder="Enter 10-digit number"
          placeholderTextColor={colors.mutedLight}
          keyboardType="number-pad"
          maxLength={10}
          autoComplete="tel"
          testID="phone-input"
        />
      </View>
      {error ? (
        <Text className="text-xs text-red-500 mt-1">{error}</Text>
      ) : null}
    </View>
  );
};
