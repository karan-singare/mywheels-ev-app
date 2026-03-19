import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../hooks/use-auth.hook';
import { colors } from '../../config/theme.constant';

export function AdminSettingsScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => { void signOut(); } },
    ]);
  };

  return (
    <View testID="admin-settings-screen" style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: colors.textMain, marginBottom: 24 }}>Settings</Text>

      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain, marginBottom: 8 }}>Admin Profile</Text>
        <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>Email: {user?.email ?? 'N/A'}</Text>
        <Text style={{ fontSize: 13, color: colors.muted }}>Role: Admin</Text>
      </View>

      <TouchableOpacity
        testID="logout-button"
        onPress={handleLogout}
        style={{
          backgroundColor: '#ef4444',
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
