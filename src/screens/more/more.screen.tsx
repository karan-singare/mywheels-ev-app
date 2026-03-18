import React from 'react';
import { View, Text } from 'react-native';

export function MoreScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-2xl font-bold text-foreground">More Screen</Text>
      <Text className="text-muted-foreground mt-2">Settings & preferences</Text>
    </View>
  );
}
