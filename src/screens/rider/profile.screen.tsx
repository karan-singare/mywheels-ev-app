import React, { useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRider } from '../../hooks/use-rider.hook';
import { useKYC } from '../../hooks/use-kyc.hook';
import { colors } from '../../config/theme.constant';
import { formatDate } from '../../utils/formatters.util';
import type { RiderStackParamList } from '../../types/navigation.type';
import type { RiderProfile as RiderProfileType } from '../../types/rider.type';

type ProfileNav = NativeStackNavigationProp<RiderStackParamList, 'Profile'>;

const PROFILE_FIELDS: (keyof RiderProfileType)[] = [
  'full_name',
  'phone',
  'date_of_birth',
  'gender',
  'address',
  'city',
  'emergency_contact',
];

function computeProfileCompletion(profile: RiderProfileType | null): number {
  if (!profile) return 0;
  const filled = PROFILE_FIELDS.filter((f) => {
    const val = profile[f];
    return val !== undefined && val !== null && val !== '';
  }).length;
  return Math.round((filled / PROFILE_FIELDS.length) * 100);
}

const KYC_LABEL_MAP: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

const KYC_COLOR_MAP: Record<string, string> = {
  not_started: '#6b7280',
  in_progress: '#f59e0b',
  under_review: '#3b82f6',
  approved: '#22c55e',
  rejected: '#ef4444',
};

const KYC_BG_MAP: Record<string, string> = {
  not_started: '#f3f4f6',
  in_progress: '#fef3c7',
  under_review: '#dbeafe',
  approved: '#dcfce7',
  rejected: '#fee2e2',
};

function KYCStatusBadge({ status }: Readonly<{ status: string }>) {
  return (
    <View
      testID="kyc-status-badge"
      style={{
        backgroundColor: KYC_BG_MAP[status] ?? '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: KYC_COLOR_MAP[status] ?? '#6b7280', fontSize: 13, fontWeight: '600' }}>
        KYC: {KYC_LABEL_MAP[status] ?? status}
      </Text>
    </View>
  );
}

function ProfileField({
  label,
  value,
  testID,
}: Readonly<{ label: string; value: string; testID: string }>) {
  return (
    <View testID={testID} style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 12, color: colors.mutedLight, marginBottom: 2 }}>{label}</Text>
      <Text style={{ fontSize: 15, color: colors.textMain, fontWeight: '500' }}>
        {value || '—'}
      </Text>
    </View>
  );
}

function formatGender(gender: string | undefined | null): string {
  if (!gender) return '—';
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export function ProfileScreen() {
  const navigation = useNavigation<ProfileNav>();
  const { profile } = useRider();
  const { status: kycStatus } = useKYC();

  const profileCompletion = useMemo(() => computeProfileCompletion(profile), [profile]);

  return (
    <ScrollView
      testID="profile-screen"
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      {/* Header */}
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
            {profileCompletion}% Complete
          </Text>
        </View>
      </View>

      {/* Profile info card */}
      <View
        testID="profile-info-card"
        style={{
          backgroundColor: colors.card,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <ProfileField label="Full Name" value={profile?.full_name ?? ''} testID="profile-full-name" />
        <ProfileField label="Phone" value={profile?.phone ?? ''} testID="profile-phone" />
        <ProfileField
          label="Date of Birth"
          value={profile?.date_of_birth ? formatDate(profile.date_of_birth) : ''}
          testID="profile-dob"
        />
        <ProfileField label="Gender" value={formatGender(profile?.gender)} testID="profile-gender" />
        <ProfileField label="Address" value={profile?.address ?? ''} testID="profile-address" />
        <ProfileField label="City" value={profile?.city ?? ''} testID="profile-city" />
        <ProfileField
          label="Emergency Contact"
          value={profile?.emergency_contact ?? ''}
          testID="profile-emergency-contact"
        />
      </View>

      {/* Action buttons */}
      <TouchableOpacity
        testID="edit-profile-button"
        onPress={() => navigation.navigate('Onboarding')}
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Edit Profile</Text>
      </TouchableOpacity>

      {/* KYC status message */}
      {kycStatus === 'under_review' && (
        <View style={{ backgroundColor: '#dbeafe', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <Text style={{ color: '#1e40af', fontSize: 13, fontWeight: '500' }}>
            KYC approval is pending. We'll notify you once the review is complete.
          </Text>
        </View>
      )}
      {kycStatus === 'rejected' && (
        <View style={{ backgroundColor: '#fee2e2', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <Text style={{ color: '#991b1b', fontSize: 13, fontWeight: '500' }}>
            Your KYC was rejected. Please update your documents and resubmit.
          </Text>
        </View>
      )}
      {kycStatus === 'approved' && (
        <View style={{ backgroundColor: '#dcfce7', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <Text style={{ color: '#166534', fontSize: 13, fontWeight: '500' }}>
            Your KYC is approved. You can now browse rental plans.
          </Text>
        </View>
      )}

      <TouchableOpacity
        testID="kyc-verification-button"
        onPress={() => navigation.navigate('KYC')}
        style={{
          backgroundColor: colors.teal,
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>
          {kycStatus === 'not_started' ? 'Start KYC Verification' :
           kycStatus === 'approved' ? 'View KYC Documents' :
           'Update KYC Documents'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
