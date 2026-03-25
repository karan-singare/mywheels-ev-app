import React, { useEffect, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRider } from '../../hooks/use-rider.hook';
import { useRentals } from '../../hooks/use-rentals.hook';
import { useVehicles } from '../../hooks/use-vehicles.hook';
import { useKYC } from '../../hooks/use-kyc.hook';
import { formatCurrency, formatDate, daysRemaining } from '../../utils/formatters.util';
import { openGPSTracker, openBatteryMonitor } from '../../utils/deeplink.util';
import { RENTAL_PLANS } from '../../constants/plans.constant';
import { colors } from '../../config/theme.constant';
import type { RiderTabParamList, RiderStackParamList } from '../../types/navigation.type';
import type { RiderProfile } from '../../types/rider.type';

type DashboardNav = CompositeNavigationProp<
  BottomTabNavigationProp<RiderTabParamList, 'Home'>,
  NativeStackNavigationProp<RiderStackParamList>
>;

const PROFILE_FIELDS: (keyof RiderProfile)[] = [
  'full_name',
  'phone',
  'date_of_birth',
  'gender',
  'address',
  'city',
  'emergency_contact',
];

function computeProfileCompletion(profile: RiderProfile | null): number {
  if (!profile) return 0;
  const filled = PROFILE_FIELDS.filter((f) => {
    const val = profile[f];
    return val !== undefined && val !== null && val !== '';
  }).length;
  return Math.round((filled / PROFILE_FIELDS.length) * 100);
}

function KYCStatusBadge({ status }: Readonly<{ status: string }>) {
  const labelMap: Record<string, string> = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
  };

  const colorMap: Record<string, string> = {
    not_started: '#6b7280',
    in_progress: '#f59e0b',
    under_review: '#3b82f6',
    approved: '#22c55e',
    rejected: '#ef4444',
  };

  const bgMap: Record<string, string> = {
    not_started: '#f3f4f6',
    in_progress: '#fef3c7',
    under_review: '#dbeafe',
    approved: '#dcfce7',
    rejected: '#fee2e2',
  };

  return (
    <View
      testID="kyc-status-badge"
      style={{
        backgroundColor: bgMap[status] ?? '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: colorMap[status] ?? '#6b7280', fontSize: 13, fontWeight: '600' }}>
        KYC: {labelMap[status] ?? status}
      </Text>
    </View>
  );
}

export function DashboardScreen() {
  const navigation = useNavigation<DashboardNav>();
  const { profile, loading: riderLoading } = useRider();
  const { activeRental, loading: rentalLoading, fetchActiveRental } = useRentals();
  const { currentVehicle, fetchVehicle } = useVehicles();
  const { status: kycStatus } = useKYC();

  useEffect(() => {
    if (profile?.id) {
      fetchActiveRental(profile.id);
    }
  }, [profile?.id, fetchActiveRental]);

  useEffect(() => {
    if (activeRental?.vehicle_id) {
      fetchVehicle(activeRental.vehicle_id);
    }
  }, [activeRental?.vehicle_id, fetchVehicle]);

  const planName = useMemo(() => {
    if (!activeRental) return '';
    const plan = RENTAL_PLANS.find((p) => p.id === activeRental.plan_id);
    return plan?.name ?? activeRental.plan_type;
  }, [activeRental]);

  const remaining = useMemo(
    () => (activeRental ? daysRemaining(activeRental.end_date) : 0),
    [activeRental],
  );

  const profileCompletion = useMemo(() => computeProfileCompletion(profile), [profile]);

  const showRenewalReminder = activeRental?.status === 'active' && remaining <= 3;

  if (riderLoading || rentalLoading) {
    return (
      <View testID="dashboard-loading" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      testID="dashboard-screen"
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      {/* Welcome header */}
      <Text
        testID="welcome-header"
        style={{ fontSize: 24, fontWeight: '700', color: colors.textMain, marginBottom: 16 }}
      >
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
      </Text>

      {/* KYC status + profile completion */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <KYCStatusBadge status={kycStatus ?? 'not_started'} />
        <View
          testID="profile-completion"
          style={{
            backgroundColor: '#f3f4f6',
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '600' }}>
            Profile: {profileCompletion}%
          </Text>
        </View>
      </View>

      {activeRental?.status === 'active' ? (
        <>
          {/* Renewal reminder */}
          {showRenewalReminder && (
            <TouchableOpacity
              testID="renewal-reminder"
              onPress={() => navigation.navigate('Plans')}
              style={{
                backgroundColor: '#fef3c7',
                borderColor: '#f59e0b',
                borderWidth: 1,
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: '#92400e', fontWeight: '600', fontSize: 14 }}>
                ⚠️ Your rental expires in {remaining} day{remaining === 1 ? '' : 's'}. Renew now!
              </Text>
            </TouchableOpacity>
          )}

          {/* Active rental card */}
          <View
            testID="active-rental-card"
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain, marginBottom: 8 }}>
              Active Rental
            </Text>
            <Text testID="rental-plan-name" style={{ fontSize: 15, fontWeight: '600', color: colors.primary, marginBottom: 4 }}>
              {planName}
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 2 }}>
              Start: {formatDate(activeRental.start_date)}
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 2 }}>
              End: {formatDate(activeRental.end_date)}
            </Text>
            <Text testID="days-remaining" style={{ fontSize: 13, fontWeight: '600', color: remaining <= 3 ? '#f59e0b' : colors.green }}>
              {remaining} day{remaining === 1 ? '' : 's'} remaining
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>
              Paid: {formatCurrency(activeRental.amount_paid)}
            </Text>
          </View>

          {/* Vehicle details card */}
          <View
            testID="vehicle-details-card"
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain, marginBottom: 8 }}>
              Assigned Vehicle
            </Text>
            {currentVehicle ? (
              <>
                <Text testID="vehicle-model" style={{ fontSize: 13, color: colors.muted, marginBottom: 2 }}>
                  Model: {currentVehicle.model}
                </Text>
                <Text testID="vehicle-registration" style={{ fontSize: 13, color: colors.muted, marginBottom: 2 }}>
                  Registration: {currentVehicle.registration_number}
                </Text>
                <Text testID="vehicle-id" style={{ fontSize: 13, color: colors.muted }}>
                  Vehicle ID: {currentVehicle.vehicle_id}
                </Text>
              </>
            ) : (
              <Text testID="vehicle-id" style={{ fontSize: 13, color: colors.muted }}>
                Vehicle ID: {activeRental.vehicle_id}
              </Text>
            )}
          </View>

          {/* Battery info card */}
          <View
            testID="battery-info-card"
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain, marginBottom: 8 }}>
              Battery Status
            </Text>
            {currentVehicle?.last_battery_percentage != null ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text testID="battery-percentage" style={{ fontSize: 28, fontWeight: '700', color: currentVehicle.last_battery_percentage <= 20 ? '#ef4444' : colors.green }}>
                  {currentVehicle.last_battery_percentage}%
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted, marginLeft: 8 }}>
                  Battery Level
                </Text>
              </View>
            ) : (
              <Text testID="battery-unavailable" style={{ fontSize: 13, color: colors.mutedLight, marginBottom: 8 }}>
                Battery data unavailable — connect via Bluetooth app
              </Text>
            )}
            <TouchableOpacity
              testID="check-battery-button"
              onPress={() => void openBatteryMonitor(activeRental.vehicle_id)}
              style={{
                backgroundColor: colors.green,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Check Battery</Text>
            </TouchableOpacity>
          </View>

          {/* Track vehicle button */}
          <TouchableOpacity
            testID="track-vehicle-button"
            onPress={() => void openGPSTracker(activeRental.vehicle_id)}
            style={{
              backgroundColor: colors.secondary,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Track My Vehicle</Text>
          </TouchableOpacity>
        </>
      ) : (
        /* No active rental — prompt to select a plan */
        <View
          testID="no-rental-prompt"
          style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textMain, marginBottom: 8, textAlign: 'center' }}>
            No active rental
          </Text>
          <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 16, textAlign: 'center' }}>
            Select a plan to get started with your EV rental.
          </Text>
          <TouchableOpacity
            testID="select-plan-button"
            onPress={() => navigation.navigate('Plans')}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Browse Plans</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick action buttons */}
      <View testID="quick-actions" style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        <TouchableOpacity
          testID="renew-plan-button"
          onPress={() => navigation.navigate('Plans')}
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Renew Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="contact-support-button"
          onPress={() => navigation.navigate('Support')}
          style={{
            flex: 1,
            backgroundColor: colors.teal,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Contact Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="payment-history-button"
          onPress={() => navigation.navigate('PaymentHistory')}
          style={{
            flex: 1,
            backgroundColor: colors.dark,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Payment History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
