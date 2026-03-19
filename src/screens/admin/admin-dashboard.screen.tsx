import React, { useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useVehicles } from '../../hooks/use-vehicles.hook';
import { useRentals } from '../../hooks/use-rentals.hook';
import { useKYC } from '../../hooks/use-kyc.hook';
import { colors } from '../../config/theme.constant';
import type { AdminTabParamList } from '../../types/navigation.type';

type AdminDashboardNav = BottomTabNavigationProp<AdminTabParamList, 'Dashboard'>;

interface SummaryCardProps {
  readonly label: string;
  readonly value: number;
  readonly color: string;
  readonly bg: string;
  readonly testID: string;
}

function SummaryCard({ label, value, color, bg, testID }: SummaryCardProps) {
  return (
    <View
      testID={testID}
      style={{
        flex: 1,
        backgroundColor: bg,
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        minWidth: 100,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: '700', color }}>{value}</Text>
      <Text style={{ fontSize: 11, color, fontWeight: '600', textAlign: 'center', marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export function AdminDashboardScreen() {
  const navigation = useNavigation<AdminDashboardNav>();
  const { statusCounts, loading: vehiclesLoading, fetchVehicles } = useVehicles();
  const { allActive, loading: rentalsLoading, fetchAllActive } = useRentals();
  const { pendingCount, loading: kycLoading } = useKYC();

  useEffect(() => {
    fetchVehicles();
    fetchAllActive();
  }, [fetchVehicles, fetchAllActive]);

  const totalVehicles = statusCounts.available + statusCounts.rented + statusCounts.maintenance;
  const loading = vehiclesLoading || rentalsLoading || kycLoading;

  if (loading) {
    return (
      <View testID="admin-dashboard-loading" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      testID="admin-dashboard-screen"
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Text style={{ fontSize: 22, fontWeight: '700', color: colors.textMain, marginBottom: 16 }}>
        Admin Dashboard
      </Text>

      {/* Summary cards row 1 */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <SummaryCard testID="card-total-vehicles" label="Total Vehicles" value={totalVehicles} color={colors.primary} bg="#dbeafe" />
        <SummaryCard testID="card-active-rentals" label="Active Rentals" value={allActive?.length ?? 0} color="#22c55e" bg="#dcfce7" />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <SummaryCard testID="card-available" label="Available" value={statusCounts.available} color="#22c55e" bg="#dcfce7" />
        <SummaryCard testID="card-maintenance" label="Maintenance" value={statusCounts.maintenance} color="#f59e0b" bg="#fef3c7" />
        <SummaryCard testID="card-pending-kyc" label="Pending KYC" value={pendingCount} color="#ef4444" bg="#fee2e2" />
      </View>

      {/* Quick navigation */}
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain, marginTop: 16, marginBottom: 12 }}>
        Quick Actions
      </Text>
      <View style={{ gap: 8 }}>
        <TouchableOpacity
          testID="nav-kyc-review"
          onPress={() => navigation.navigate('KYCReview')}
          style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textMain }}>KYC Review Queue</Text>
          {pendingCount > 0 && (
            <View style={{ backgroundColor: '#ef4444', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{pendingCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          testID="nav-inventory"
          onPress={() => navigation.navigate('Inventory')}
          style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16 }}
        >
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textMain }}>Manage Inventory</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
