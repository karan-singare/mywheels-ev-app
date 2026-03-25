import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, CreditCard, MessageCircle, Settings } from 'lucide-react-native';
import { RiderTabParamList, RiderStackParamList } from '../types/navigation.type';
import { colors } from '../config/theme.constant';
import { PlansScreen } from '../screens/rider/plans.screen';
import { PaymentScreen } from '../screens/rider/payment.screen';
import { PaymentHistoryScreen } from '../screens/rider/payment-history.screen';
import { DashboardScreen } from '../screens/rider/dashboard.screen';
import { ProfileScreen } from '../screens/rider/profile.screen';
import { SupportScreen } from '../screens/rider/support.screen';
import { SettingsScreen } from '../screens/rider/settings.screen';
import { KYCScreen } from '../screens/kyc/kyc.screen';

type TabIconProps = Readonly<{ color: string; size: number }>;

function HomeIcon({ color, size }: TabIconProps) {
  return <Home color={color} size={size} />;
}

function PlansIcon({ color, size }: TabIconProps) {
  return <CreditCard color={color} size={size} />;
}

function SupportIcon({ color, size }: TabIconProps) {
  return <MessageCircle color={color} size={size} />;
}

function SettingsIcon({ color, size }: TabIconProps) {
  return <Settings color={color} size={size} />;
}

const Tab = createBottomTabNavigator<RiderTabParamList>();
const Stack = createNativeStackNavigator<RiderStackParamList>();

function RiderTabsNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Tab.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.mutedLight,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: '#e5e7eb',
        },
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarIcon: HomeIcon }} />
      <Tab.Screen name="Plans" component={PlansScreen} options={{ tabBarIcon: PlansIcon }} />
      <Tab.Screen name="Support" component={SupportScreen} options={{ tabBarIcon: SupportIcon }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: SettingsIcon }} />
    </Tab.Navigator>
    </SafeAreaView>
  );
}

export function RiderTabs() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'slide_from_right', animationDuration: 200, headerBackTitle: 'Back' }}>
      <Stack.Screen name="RiderTabs" component={RiderTabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ title: 'Payment History' }} />
      <Stack.Screen name="KYC" component={KYCScreen} options={{ title: 'KYC Verification' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </Stack.Navigator>
  );
}
