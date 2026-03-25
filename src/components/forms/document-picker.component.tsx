import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { Camera, ImageIcon, X } from 'lucide-react-native';
import { colors } from '../../config/theme.constant';
import { isValidFileSize, isValidImageType } from '../../utils/validators.util';

export interface DocumentPickerResult {
  uri: string;
  base64: string;
  mimeType: string;
}

export interface DocumentPickerProps {
  label: string;
  documentType: 'aadhaar' | 'driving_license' | 'photo' | 'address_proof';
  imageUri?: string;
  onImageSelected: (results: DocumentPickerResult[]) => void;
  onRemove: () => void;
  uploading?: boolean;
  error?: string;
}

const MAX_FILE_SIZE_MB = 10;

function showAndroidActionSheet(
  onCamera: () => void,
  onGallery: () => void,
) {
  Alert.alert('Select Image', 'Choose a source', [
    { text: 'Camera', onPress: onCamera },
    { text: 'Gallery', onPress: onGallery },
    { text: 'Cancel', style: 'cancel' },
  ]);
}

export const DocumentPicker: React.FC<DocumentPickerProps> = ({
  label,
  documentType,
  imageUri,
  onImageSelected,
  onRemove,
  uploading = false,
  error,
}) => {
  const handlePickImage = useCallback(
    async (source: 'camera' | 'gallery') => {
      try {
        const ImagePicker = require('react-native-image-picker');
        const options = {
          mediaType: 'photo' as const,
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.8 as const,
          includeBase64: true,
          selectionLimit: source === 'gallery' ? 0 : 1,
        };

        const launcher =
          source === 'camera'
            ? ImagePicker.launchCamera
            : ImagePicker.launchImageLibrary;

        const result = await launcher(options);

        if (result.didCancel || !result.assets?.length) return;

        const validResults: DocumentPickerResult[] = [];

        for (const asset of result.assets) {
          const mimeType = asset.type ?? '';
          const fileSize = asset.fileSize ?? 0;

          if (!isValidImageType(mimeType)) {
            Alert.alert('Invalid Format', `${asset.fileName ?? 'A file'} is not a supported image type and was skipped.`);
            continue;
          }
          if (!isValidFileSize(fileSize, MAX_FILE_SIZE_MB)) {
            Alert.alert('File Too Large', `${asset.fileName ?? 'A file'} exceeds ${MAX_FILE_SIZE_MB} MB and was skipped.`);
            continue;
          }
          if (asset.uri && asset.base64) {
            validResults.push({ uri: asset.uri, base64: asset.base64, mimeType });
          }
        }

        if (validResults.length > 0) {
          onImageSelected(validResults);
        }
      } catch {
        Alert.alert('Error', 'Failed to pick image. Please try again.');
      }
    },
    [onImageSelected],
  );

  const showActionSheet = useCallback(() => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handlePickImage('camera');
          else if (buttonIndex === 2) handlePickImage('gallery');
        },
      );
    } else {
      showAndroidActionSheet(
        () => handlePickImage('camera'),
        () => handlePickImage('gallery'),
      );
    }
  }, [handlePickImage]);

  return (
    <View
      className="mb-4"
      testID={`document-picker-${documentType}`}
      accessibilityLabel={`${label} document picker`}
    >
      <Text className="text-sm font-medium text-[#141c6c] mb-1.5">{label}</Text>

      {imageUri ? (
        <View className="relative rounded-xl border border-gray-200 bg-white overflow-hidden">
          <Image
            source={{ uri: imageUri }}
            className="w-full h-40"
            resizeMode="cover"
            testID={`document-preview-${documentType}`}
            accessibilityLabel={`${label} preview`}
          />
          <TouchableOpacity
            className="absolute top-2 right-2 bg-red-500 rounded-full p-1.5"
            onPress={onRemove}
            testID={`document-remove-${documentType}`}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${label}`}
          >
            <X size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className={`h-40 rounded-xl border-2 border-dashed items-center justify-center ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}
          onPress={showActionSheet}
          disabled={uploading}
          testID={`document-add-${documentType}`}
          accessibilityRole="button"
          accessibilityLabel={`Add ${label}`}
        >
          <View className="items-center">
            <View className="flex-row gap-4 mb-2">
              <Camera size={24} color={colors.mutedLight} />
              <ImageIcon size={24} color={colors.mutedLight} />
            </View>
            <Text className="text-sm text-[#6b7280]">
              {uploading ? 'Uploading...' : 'Tap to capture or select'}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {error ? (
        <Text className="text-xs text-red-500 mt-1" testID={`document-error-${documentType}`}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default DocumentPicker;
