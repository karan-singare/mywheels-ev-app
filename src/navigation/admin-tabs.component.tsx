import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutDashboard,
  FileCheck,
  Bike,
  Settings,
} from 'lucide-react-native';
import { AdminTabParamList } from '../types/navigation.type';
import { colors } from '../config/theme.constant';

// Placeholder screens
function AdminDashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Admin Dashboard</Text>
    </View>
  );
}

function KYCReviewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>KYC Review</Text>
    </View>
  );
}

function InventoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inventory</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
    </View>
  );
}

type TabIconProps = Readonly<{ color: string; size: number }>;

function DashboardIcon({ color, size }: TabIconProps) {
  return <LayoutDashboard color={color} size={size} />;
}

function KYCReviewIcon({ color, size }: TabIconProps) {
  return <FileCheck color={color} size={size} />;
}

function InventoryIcon({ color, size }: TabIconProps) {
  return <Bike color={color} size={size} />;
}

function SettingsIcon({ color, size }: TabIconProps) {
  return <Settings color={color} size={size} />;
}

const Tab = createBottomTabNavigator<AdminTabParamList>();

export function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.mutedLight,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: '#e5e7eb',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{ tabBarIcon: DashboardIcon }}
      />
      <Tab.Screen
        name="KYCReview"
        component={KYCReviewScreen}
        options={{ title: 'KYC Review', tabBarIcon: KYCReviewIcon }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ tabBarIcon: InventoryIcon }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: SettingsIcon }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textMain,
  },
});
