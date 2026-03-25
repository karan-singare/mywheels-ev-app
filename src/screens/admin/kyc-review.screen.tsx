import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchPendingReviews, approveKYC } from '../../store/thunks/kyc.thunk';
import * as kycService from '../../services/kyc.service';
import { useAuth } from '../../hooks/use-auth.hook';
import { colors } from '../../config/theme.constant';
import type { KYCReviewItem, KYCDocument } from '../../types/kyc.type';
import type { AdminStackParamList } from '../../types/navigation.type';

type Nav = NativeStackNavigationProp<AdminStackParamList>;
const CARD_PADDING = 14;
const CARD_MARGIN = 16;
const THUMB_WIDTH = Dimensions.get('window').width - (CARD_MARGIN * 2) - (CARD_PADDING * 2);

function DocCarousel({
  riderId,
  onImagePress,
}: Readonly<{
  riderId: string;
  onImagePress: (urls: string[], index: number) => void;
}>) {
  const [docs, setDocs] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    kycService.getDocuments(riderId).then((d) => {
      setDocs(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [riderId]);

  if (loading) {
    return (
      <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (docs.length === 0) {
    return (
      <View style={{ height: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 8 }}>
        <Text style={{ fontSize: 13, color: colors.mutedLight }}>No documents uploaded</Text>
      </View>
    );
  }

  const imageUrls = docs.map((d) => d.file_url);

  return (
    <View>
      <FlatList
        data={docs}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / THUMB_WIDTH));
        }}
        keyExtractor={(d) => d.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity activeOpacity={0.9} onPress={() => onImagePress(imageUrls, index)}>
            <Image
              source={{ uri: item.file_url }}
              style={{ width: THUMB_WIDTH, height: 180, borderRadius: 8 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />
      {docs.length > 1 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 8 }}>
          {docs.map((_, i) => (
            <View
              key={docs[i].id}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === activeIndex ? colors.primary : '#d1d5db',
              }}
            />
          ))}
        </View>
      )}
      <Text style={{ fontSize: 11, color: colors.mutedLight, marginTop: 4, textTransform: 'capitalize' }}>
        {docs[activeIndex]?.document_type.replace('_', ' ') ?? ''}
      </Text>
    </View>
  );
}

export function KYCReviewScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { pendingReviews, loading, error } = useAppSelector((s) => s.kyc);

  useEffect(() => {
    dispatch(fetchPendingReviews());
  }, [dispatch]);

  const handleApprove = useCallback(
    (item: KYCReviewItem) => {
      if (!user?.id) return;
      Alert.alert(
        'Approve KYC',
        `Approve ${item.rider_name}'s KYC verification?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Approve',
            onPress: () => { dispatch(approveKYC({ riderId: item.rider_id, adminId: user.id as string })); },
          },
        ],
      );
    },
    [dispatch, user?.id],
  );

  const handleImagePress = useCallback(
    (imageUrls: string[], initialIndex: number) => {
      navigation.navigate('ImageViewer', { imageUrls, initialIndex });
    },
    [navigation],
  );

  if (loading && pendingReviews.length === 0) {
    return (
      <View testID="kyc-review-loading" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View testID="kyc-review-screen" style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: CARD_MARGIN, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.textMain }}>KYC Review</Text>
        <Text style={{ fontSize: 13, color: colors.mutedLight, marginTop: 2 }}>
          {pendingReviews.length} pending review{pendingReviews.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {error && (
        <View style={{ paddingHorizontal: CARD_MARGIN, marginBottom: 8 }}>
          <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingHorizontal: CARD_MARGIN, paddingBottom: 24 }}>
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
                padding: CARD_PADDING,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }}
            >
              <DocCarousel riderId={item.rider_id} onImagePress={handleImagePress} />

              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain }}>
                  {item.rider_name || 'Unknown Rider'}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                  {item.rider_phone} · Submitted {new Date(item.submitted_at).toLocaleDateString()}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <TouchableOpacity
                  testID={`approve-btn-${item.rider_id}`}
                  onPress={() => handleApprove(item)}
                  style={{ flex: 1, backgroundColor: '#22c55e', paddingVertical: 10, borderRadius: 8, alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID={`reject-btn-${item.rider_id}`}
                  onPress={() => navigation.navigate('RejectKYC', { riderId: item.rider_id, riderName: item.rider_name })}
                  style={{ flex: 1, backgroundColor: '#ef4444', paddingVertical: 10, borderRadius: 8, alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
