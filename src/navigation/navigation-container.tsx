import React from 'react';
import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MoreHorizontal } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { HomeScreen, MoreScreen } from '../screens';

const Tab = createBottomTabNavigator();

type TabIconProps = Readonly<{ color: string; size: number }>;

function HomeTabIcon({ color, size }: TabIconProps) {
  return <Home color={color} size={size} />;
}

function MoreTabIcon({ color, size }: TabIconProps) {
  return <MoreHorizontal color={color} size={size} />;
}

export function NavigationContainer() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <RNNavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: isDark ? '#60a5fa' : '#2563eb',
          background: isDark ? '#09090b' : '#ffffff',
          card: isDark ? '#18181b' : '#ffffff',
          text: isDark ? '#fafafa' : '#09090b',
          border: isDark ? '#27272a' : '#e4e4e7',
          notification: '#ef4444',
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
      }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: isDark ? '#60a5fa' : '#2563eb',
          tabBarInactiveTintColor: isDark ? '#71717a' : '#a1a1aa',
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarIcon: HomeTabIcon }}
        />
        <Tab.Screen
          name="More"
          component={MoreScreen}
          options={{ tabBarIcon: MoreTabIcon }}
        />
      </Tab.Navigator>
    </RNNavigationContainer>
  );
}
