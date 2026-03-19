import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../../config/theme.constant';

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
}) => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
};

export default LoadingSpinner;
