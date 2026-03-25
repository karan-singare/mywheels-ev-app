import React from 'react';
import { colors } from '../../config/theme.constant';
import { Box } from '@gluestackui/box';
import { Text } from '@gluestackui/text';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from '@gluestackui/form-control';
import { Input, InputField } from '@gluestackui/input';

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
    <FormControl isInvalid={!!error} className="mb-4">
      <FormControlLabel>
        <FormControlLabelText className="text-sm font-medium text-[#141c6c]">
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      <Input className="rounded-xl h-12 bg-white">
        <Box className="ml-3 mr-2 pr-2 border-r border-gray-300 justify-center">
          <Text className="text-base text-[#374151] font-medium">+91</Text>
        </Box>
        <InputField
          value={value}
          onChangeText={handleChange}
          placeholder="Enter 10-digit number"
          placeholderTextColor={colors.mutedLight}
          keyboardType="number-pad"
          maxLength={10}
          autoComplete="tel"
          testID="phone-input"
        />
      </Input>
      <FormControlError>
        <FormControlErrorText>{error}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};
