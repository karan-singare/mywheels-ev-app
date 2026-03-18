import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../../../components/ui/card';

export function HomeScreen() {
  return (
    <View className="justify-center items-center p-4 bg-background">
      <Card size="lg" variant="outline">
        <Text className="text-2xl font-bold text-foreground mb-4">Home Screen</Text>
        <Text className="text-muted-foreground">
          Gluestack UI v5 is working!
        </Text>
      </Card>
    </View>
  );
}
