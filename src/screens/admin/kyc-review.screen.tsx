import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchPendingReviews, approveKYC, rejectKYC } from '../../store/thunks/kyc.thunk';
import { useAuth } from '../../hooks/use-auth.hook';
import { colors } from '../../config/theme.constant';
import type { KYCReviewItem } from '../../types/kyc.type';

export function KYCReviewScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { pendingReviews, loading, error } = useAppSelector((s) => s.kyc);
  const [rejectTarget, setRejectTarget] = useState<KYCReviewItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    dispatch(fetchPendingReviews());
  }, [dispatch]);

  const handleApprove = useCallback(
    (item: KYCReviewItem) => {
      if (!user?.id) return;
      dispatch(approveKYC({ riderId: item.rider_id, adminId: user.id }));
    },
    [dispatch, user?.id],
  );

  const handleReject = useCallback(() => {
    if (!rejectTarget || !user?.id || !rejectReason.trim()) return;
    dispatch(rejectKYC({ riderId: rejectTarget.rider_id, adminId: user.id, reason: rejectReason.trim() }));
    setRejectTarget(null);
    setRejectReason('');
  }, [dispatch, rejectTarget, user?.id, rejectReason]);

  if (loading) {
    return (
      <View testID="kyc-review-loading" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View testID="kyc-review-screen" style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.textMain, marginBottom: 4 }}>KYC Review</Text>
        <Text style={{ fontSize: 13, color: colors.mutedLight, marginBottom: 12 }}>
          {pendingReviews.length} pending review{pendingReviews.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {error && (
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0 }}>
        {pendingReviews.length === 0 ? (
          <Text style={{ textAlign: 'center', color: colors.mutedLight, marginTop: 32 }}>No pending reviews</Text>
        ) : (
          pendingReviews.map((item) => (
            <View
              key={item.id}
              testID={`review-card-${item.rider_id}`}
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 14,
                marginBottom: 10,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textMain, marginBottom: 4 }}>
                {item.rider_name}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 2 }}>Phone: {item.rider_phone}</Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
                Submitted: {new Date(item.submitted_at).toLocaleDateString()}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  testID={`approve-btn-${item.rider_id}`}
                  onPress={() => handleApprove(item)}
                  style={{ flex: 1, backgroundColor: '#22c55e', paddingVertical: 10, borderRadius: 8, alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID={`reject-btn-${item.rider_id}`}
                  onPress={() => { setRejectTarget(item); setRejectReason(''); }}
                  style={{ flex: 1, backgroundColor: '#ef4444', paddingVertical: 10, borderRadius: 8, alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Reject reason modal */}
      <Modal visible={rejectTarget != null} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 24 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textMain, marginBottom: 4 }}>Reject KYC</Text>
            <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 12 }}>
              Provide a reason for rejecting {rejectTarget?.rider_name}'s KYC
            </Text>
            <TextInput
              testID="reject-reason-input"
              placeholder="Rejection reason"
              placeholderTextColor={colors.mutedLight}
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
                fontSize: 14,
                color: colors.textMain,
                minHeight: 80,
                textAlignVertical: 'top',
              }}
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={() => setRejectTarget(null)} style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#e5e7eb', alignItems: 'center' }}>
                <Text style={{ color: colors.muted, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="confirm-reject" onPress={handleReject} style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#ef4444', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
