import React, { useState } from 'react';
import { View, Image, Dimensions, FlatList, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { X } from 'lucide-react-native';
import type { AdminStackParamList } from '../../types/navigation.type';

type Props = NativeStackScreenProps<AdminStackParamList, 'ImageViewer'>;

const { width } = Dimensions.get('window');

export function ImageViewerScreen({ route }: Readonly<Props>) {
  const navigation = useNavigation();
  const { imageUrls, initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Close button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 56,
          right: 16,
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 20,
          width: 36,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={20} color="#fff" />
      </TouchableOpacity>

      <FlatList
        data={imageUrls}
        horizontal
        pagingEnabled
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height: '100%' }}
            resizeMode="contain"
          />
        )}
      />

      {/* Page indicator */}
      {imageUrls.length > 1 && (
        <View style={{ position: 'absolute', bottom: 50, alignSelf: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' }}>
            {currentIndex + 1} / {imageUrls.length}
          </Text>
        </View>
      )}
    </View>
  );
}
