import React from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { DocumentPicker, type DocumentPickerResult } from '../../components/forms/document-picker.component';
import { colors } from '../../config/theme.constant';
import type { KYCDocumentType } from '../../enums/kyc-document-type.enum';
import type { KYCDocument } from '../../types/kyc.type';

export interface DocumentSlot {
  type: KYCDocumentType;
  label: string;
}

const DOCUMENT_SLOTS: DocumentSlot[] = [
  { type: 'aadhaar', label: 'Aadhaar Card' },
  { type: 'driving_license', label: 'Driving License' },
  { type: 'photo', label: 'Photo' },
  { type: 'address_proof', label: 'Address Proof' },
];

export interface UploadState {
  uploading: KYCDocumentType | null;
  errors: Partial<Record<KYCDocumentType, string>>;
}

interface DocumentUploaderProps {
  documents: KYCDocument[];
  uploadState: UploadState;
  onUpload: (type: KYCDocumentType, results: DocumentPickerResult[]) => void;
  onRemove: (type: KYCDocumentType, docId?: string) => void;
}

function getDocsForType(documents: KYCDocument[], type: KYCDocumentType): KYCDocument[] {
  return documents.filter((d) => d.document_type === type);
}

function getUploadStatusLabel(
  docs: KYCDocument[],
  type: KYCDocumentType,
  uploadState: UploadState,
): { text: string; color: string } {
  if (uploadState.uploading === type) {
    return { text: 'Uploading...', color: colors.primary };
  }
  if (uploadState.errors[type]) {
    return { text: 'Upload failed', color: '#ef4444' };
  }
  if (docs.length > 0) {
    return { text: `${docs.length} uploaded`, color: colors.green };
  }
  return { text: 'Not uploaded', color: colors.mutedLight };
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  documents,
  uploadState,
  onUpload,
  onRemove,
}) => {
  return (
    <View testID="document-uploader">
      {DOCUMENT_SLOTS.map((slot) => {
        const docs = getDocsForType(documents, slot.type);
        const status = getUploadStatusLabel(docs, slot.type, uploadState);
        const isUploading = uploadState.uploading === slot.type;
        const errorMsg = uploadState.errors[slot.type];

        return (
          <View
            key={slot.type}
            className="mb-4"
            testID={`document-slot-${slot.type}`}
          >
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-medium text-[#141c6c]">{slot.label}</Text>
                {isUploading && (
                  <ActivityIndicator size="small" color={colors.primary} />
                )}
              </View>
              <Text
                className="text-xs font-medium"
                style={{ color: status.color }}
                testID={`upload-status-${slot.type}`}
              >
                {status.text}
              </Text>
            </View>

            {/* Show already uploaded thumbnails */}
            {docs.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mb-2">
                {docs.map((doc) => (
                  <View key={doc.id} className="relative">
                    <Image
                      source={{ uri: doc.file_url }}
                      className="w-20 h-20 rounded-lg"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
                      onPress={() => onRemove(slot.type, doc.id)}
                      accessibilityLabel={`Remove ${slot.label}`}
                    >
                      <X size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Add more button */}
            <DocumentPicker
              label={docs.length > 0 ? `Add more ${slot.label}` : slot.label}
              documentType={slot.type}
              onImageSelected={(results) => onUpload(slot.type, results)}
              onRemove={() => onRemove(slot.type)}
              uploading={isUploading}
              error={errorMsg}
            />
          </View>
        );
      })}
    </View>
  );
};

export default DocumentUploader;
