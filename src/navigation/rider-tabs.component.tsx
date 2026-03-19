import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { Home, CreditCard, User, MessageCircle, ShieldAlert } from 'lucide-react-native';
import { RiderTabParamList } from '../types/navigation.type';
import { colors } from '../config/theme.constant';
import { useKYC } from '../hooks/use-kyc.hook';

// Placeholder screens
function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
    </View>
  );
}

export function PlansScreen() {
  const { status } = useKYC();
  const navigation = useNavigation();

  if (status !== 'approved') {
    return (
      <View style={styles.container} testID="kyc-gating-container">
        <ShieldAlert color={colors.primary} size={64} testID="kyc-gating-icon" />
        <Text style={styles.gatingTitle} testID="kyc-gating-message">
          KYC approval is required to view plans
        </Text>
        <Text style={styles.gatingSubtitle}>
          Complete your KYC verification to browse and select rental plans.
        </Text>
        <TouchableOpacity
          style={styles.gatingButton}
          testID="kyc-gating-navigate-button"
          onPress={() => navigation.navigate('KYC' as never)}
        >
          <Text style={styles.gatingButtonText}>Go to KYC Verification</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Plans</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
    </View>
  );
}

function SupportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Support</Text>
    </View>
  );
}

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

export function RiderTabs() {
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
  gatingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textMain,
    textAlign: 'center',
    marginTop: 20,
  },
  gatingSubtitle: {
    fontSize: 14,
    color: colors.mutedLight,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  gatingButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  gatingButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
