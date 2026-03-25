import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../store';
import { useAuth } from '../../hooks/use-auth.hook';
import { rejectKYC } from '../../store/thunks/kyc.thunk';
import { colors } from '../../config/theme.constant';
import type { AdminStackParamList } from '../../types/navigation.type';

type Props = NativeStackScreenProps<AdminStackParamList, 'RejectKYC'>;

export function RejectKYCScreen({ route }: Props) {
  const { riderId, riderName } = route.params;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [reason, setReason] = useState('');

  const handleReject = useCallback(() => {
    if (!user?.id || !reason.trim()) return;
    dispatch(rejectKYC({ riderId, adminId: user.id as string, reason: reason.trim() }));
    navigation.goBack();
  }, [dispatch, riderId, user?.id, reason, navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textMain, marginBottom: 4 }}>
        Reject KYC
      </Text>
      <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 16 }}>
        Provide a reason for rejecting {riderName}'s KYC
      </Text>
      <TextInput
        testID="reject-reason-input"
        placeholder="Rejection reason"
        placeholderTextColor={colors.mutedLight}
        value={reason}
        onChangeText={setReason}
        multiline
        numberOfLines={4}
        style={{
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: 14,
          color: colors.textMain,
          minHeight: 100,
          textAlignVertical: 'top',
          backgroundColor: '#fff',
        }}
      />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#e5e7eb', alignItems: 'center' }}
        >
          <Text style={{ color: colors.muted, fontWeight: '600' }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="confirm-reject"
          onPress={handleReject}
          style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#ef4444', alignItems: 'center', opacity: reason.trim() ? 1 : 0.5 }}
          disabled={!reason.trim()}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
