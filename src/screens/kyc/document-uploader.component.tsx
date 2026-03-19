import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { DocumentPicker } from '../../components/forms/document-picker.component';
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
  onUpload: (type: KYCDocumentType, uri: string) => void;
  onRemove: (type: KYCDocumentType) => void;
}

function getDocumentUri(
  documents: KYCDocument[],
  type: KYCDocumentType,
): string | undefined {
  const doc = documents.find((d) => d.document_type === type);
  return doc?.file_url || undefined;
}

function getUploadStatusLabel(
  documents: KYCDocument[],
  type: KYCDocumentType,
  uploadState: UploadState,
): { text: string; color: string } {
  if (uploadState.uploading === type) {
    return { text: 'Uploading...', color: colors.primary };
  }
  if (uploadState.errors[type]) {
    return { text: 'Upload failed', color: '#ef4444' };
  }
  const doc = documents.find((d) => d.document_type === type);
  if (doc) {
    return { text: 'Uploaded', color: colors.green };
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
        const uri = getDocumentUri(documents, slot.type);
        const status = getUploadStatusLabel(documents, slot.type, uploadState);
        const isUploading = uploadState.uploading === slot.type;
        const errorMsg = uploadState.errors[slot.type];

        return (
          <View
            key={slot.type}
            className="mb-2"
            testID={`document-slot-${slot.type}`}
          >
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center gap-2">
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

            <DocumentPicker
              label={slot.label}
              documentType={slot.type}
              imageUri={uri}
              onImageSelected={(selectedUri) => onUpload(slot.type, selectedUri)}
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
