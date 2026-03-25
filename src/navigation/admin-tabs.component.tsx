import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutDashboard, FileCheck, Bike, Settings } from 'lucide-react-native';
import { AdminTabParamList, AdminStackParamList } from '../types/navigation.type';
import { colors } from '../config/theme.constant';
import { AdminDashboardScreen } from '../screens/admin/admin-dashboard.screen';
import { KYCReviewScreen } from '../screens/admin/kyc-review.screen';
import { InventoryScreen } from '../screens/admin/inventory.screen';
import { AdminSettingsScreen } from '../screens/admin/settings.screen';
import { RejectKYCScreen } from '../screens/admin/reject-kyc.screen';
import { ImageViewerScreen } from '../screens/shared/image-viewer.screen';

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
const Stack = createNativeStackNavigator<AdminStackParamList>();

function AdminTabsNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.green,
          tabBarInactiveTintColor: colors.mutedLight,
          tabBarStyle: { backgroundColor: colors.card, borderTopColor: '#e5e7eb' },
        }}
      >
        <Tab.Screen name="Dashboard" component={AdminDashboardScreen} options={{ tabBarIcon: DashboardIcon }} />
        <Tab.Screen name="KYCReview" component={KYCReviewScreen} options={{ title: 'KYC Review', tabBarIcon: KYCReviewIcon }} />
        <Tab.Screen name="Inventory" component={InventoryScreen} options={{ tabBarIcon: InventoryIcon }} />
        <Tab.Screen name="Settings" component={AdminSettingsScreen} options={{ tabBarIcon: SettingsIcon }} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export function AdminTabs() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'slide_from_right', animationDuration: 200, headerBackTitle: 'Back' }}>
      <Stack.Screen name="AdminTabs" component={AdminTabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="RejectKYC"
        component={RejectKYCScreen}
        options={{
          title: 'Reject KYC',
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 0.75],
          sheetGrabberVisible: true,
          sheetCornerRadius: 20,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
      <Stack.Screen
        name="ImageViewer"
        component={ImageViewerScreen}
        options={{
          presentation: 'fullScreenModal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
