import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutDashboard,
  FileCheck,
  Bike,
  Settings,
} from 'lucide-react-native';
import { AdminTabParamList } from '../types/navigation.type';
import { colors } from '../config/theme.constant';
import { AdminDashboardScreen } from '../screens/admin/admin-dashboard.screen';
import { KYCReviewScreen } from '../screens/admin/kyc-review.screen';
import { InventoryScreen } from '../screens/admin/inventory.screen';
import { AdminSettingsScreen } from '../screens/admin/settings.screen';

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
        component={AdminSettingsScreen}
        options={{ tabBarIcon: SettingsIcon }}
      />
    </Tab.Navigator>
  );
}
