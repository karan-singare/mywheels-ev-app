import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, CreditCard, User, MessageCircle } from 'lucide-react-native';
import { RiderTabParamList, RiderStackParamList } from '../types/navigation.type';
import { colors } from '../config/theme.constant';
import { PlansScreen } from '../screens/rider/plans.screen';
import { PaymentScreen } from '../screens/rider/payment.screen';
import { PaymentHistoryScreen } from '../screens/rider/payment-history.screen';
import { DashboardScreen } from '../screens/rider/dashboard.screen';
import { ProfileScreen } from '../screens/rider/profile.screen';
import { SupportScreen } from '../screens/rider/support.screen';
import { KYCScreen } from '../screens/kyc/kyc.screen';

type TabIconProps = Readonly<{ color: string; size: number }>;

function HomeIcon({ color, size }: TabIconProps) {
  return <Home color={color} size={size} />;
}

function PlansIcon({ color, size }: TabIconProps) {
  return <CreditCard color={color} size={size} />;
}

function ProfileIcon({ color, size }: TabIconProps) {
  return <User color={color} size={size} />;
}

function SupportIcon({ color, size }: TabIconProps) {
  return <MessageCircle color={color} size={size} />;
}

const Tab = createBottomTabNavigator<RiderTabParamList>();
const Stack = createNativeStackNavigator<RiderStackParamList>();

function RiderTabsNavigator() {
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
        name="Home"
        component={DashboardScreen}
        options={{ tabBarIcon: HomeIcon }}
      />
      <Tab.Screen
        name="Plans"
        component={PlansScreen}
        options={{ tabBarIcon: PlansIcon }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ProfileIcon }}
      />
      <Tab.Screen
        name="Support"
        component={SupportScreen}
        options={{ tabBarIcon: SupportIcon }}
      />
    </Tab.Navigator>
  );
}

export function RiderTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RiderTabs" component={RiderTabsNavigator} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="KYC" component={KYCScreen} />
    </Stack.Navigator>
  );
}

