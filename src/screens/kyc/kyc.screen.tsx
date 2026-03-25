import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  FileCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';
import { useKYC } from '../../hooks/use-kyc.hook';
import { DocumentUploader, type UploadState } from './document-uploader.component';
import { colors } from '../../config/theme.constant';
import type { KYCDocumentType } from '../../enums/kyc-document-type.enum';
import type { KYCStatus } from '../../enums/kyc-status.enum';

const REQUIRED_DOCUMENT_TYPES: KYCDocumentType[] = [
  'aadhaar',
  'driving_license',
  'photo',
  'address_proof',
];

const STATUS_LABELS: Record<KYCStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

function getStatusIcon(status: KYCStatus) {
  switch (status) {
    case 'not_started':
      return <AlertCircle size={20} color={colors.mutedLight} />;
    case 'in_progress':
      return <Clock size={20} color={colors.primary} />;
    case 'under_review':
      return <FileCheck size={20} color="#f59e0b" />;
    case 'approved':
      return <CheckCircle2 size={20} color={colors.green} />;
    case 'rejected':
      return <XCircle size={20} color="#ef4444" />;
  }
}

function getStatusBgClass(status: KYCStatus): string {
  switch (status) {
    case 'not_started':
      return 'bg-gray-100';
    case 'in_progress':
      return 'bg-blue-50';
    case 'under_review':
      return 'bg-amber-50';
    case 'approved':
      return 'bg-green-50';
    case 'rejected':
      return 'bg-red-50';
  }
}

export const KYCScreen: React.FC = () => {
  const {
    status,
    documents,
    loading,
    error,
    uploadDocument,
    submitForReview,
  } = useKYC();

  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: null,
    errors: {},
  });

  const uploadedTypes = new Set(documents.map((d) => d.document_type));
  const allUploaded = REQUIRED_DOCUMENT_TYPES.every((t) =>
    uploadedTypes.has(t),
  );
  const canSubmit =
    allUploaded &&
    !loading &&
    !uploadState.uploading &&
    status !== 'under_review' &&
    status !== 'approved';

  // Clear global error when it changes
  useEffect(() => {
    if (error && uploadState.uploading) {
      setUploadState((prev) => ({
        uploading: null,
        errors: {
          ...prev.errors,
          ...(prev.uploading ? { [prev.uploading]: error } : {}),
        },
      }));
    }
  }, [error, uploadState.uploading]);

  const handleUpload = useCallback(
    (type: KYCDocumentType, uris: string[]) => {
      setUploadState((prev) => ({
        uploading: type,
        errors: { ...prev.errors, [type]: undefined },
      }));
      for (const uri of uris) {
        uploadDocument(type, uri);
      }
    },
    [uploadDocument],
  );

  const handleRemove = useCallback((_type: KYCDocumentType) => {
    // In a full implementation this would call a delete service.
    // For now, we just clear any error for this type.
    setUploadState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [_type]: undefined },
    }));
  }, []);

  const handleRetry = useCallback(
    (type: KYCDocumentType) => {
      const doc = documents.find((d) => d.document_type === type);
      if (doc?.file_url) {
        handleUpload(type, doc.file_url);
      }
    },
    [documents, handleUpload],
  );

  const handleSubmit = useCallback(() => {
    Alert.alert(
      'Submit for Review',
      'Are you sure you want to submit your documents for KYC review? You won\'t be able to modify them until the review is complete.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => submitForReview(),
        },
      ],
    );
  }, [submitForReview]);

  // When upload completes successfully, clear uploading state
  useEffect(() => {
    if (!loading && uploadState.uploading && !error) {
      const justUploaded = uploadState.uploading;
      const isNowUploaded = documents.some(
        (d) => d.document_type === justUploaded,
      );
      if (isNowUploaded) {
        setUploadState((prev) => ({ ...prev, uploading: null }));
      }
    }
  }, [loading, documents, uploadState.uploading, error]);

  return (
    <ScrollView
      className="flex-1 bg-[#f8fafc]"
      contentContainerStyle={{ paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="px-6 py-6">
        {/* Subtitle */}
        <Text className="text-sm text-[#6b7280] mb-6">
          Upload your documents to get verified
        </Text>

        {/* KYC Status Card */}
        <View
          className={`rounded-xl p-4 mb-6 ${getStatusBgClass(status)}`}
          testID="kyc-status-card"
          accessibilityLabel={`KYC status: ${STATUS_LABELS[status]}`}
        >
          <View className="flex-row items-center gap-3">
            {getStatusIcon(status)}
            <View>
              <Text className="text-xs font-medium text-[#6b7280]">
                KYC Status
              </Text>
              <Text
                className="text-base font-semibold text-[#141c6c]"
                testID="kyc-status-label"
              >
                {STATUS_LABELS[status]}
              </Text>
            </View>
          </View>
          {status === 'rejected' && (
            <Text className="text-sm text-red-600 mt-2">
              Your documents were rejected. Please re-upload and submit again.
            </Text>
          )}
        </View>

        {/* Document Checklist */}
        <View className="mb-4">
          <Text className="text-base font-semibold text-[#141c6c] mb-3">
            Document Checklist
          </Text>
          <View className="bg-white rounded-xl p-4 border border-gray-100">
            {REQUIRED_DOCUMENT_TYPES.map((type) => {
              const isUploaded = uploadedTypes.has(type);
              const hasError = !!uploadState.errors[type];
              const docLabelMap: Record<KYCDocumentType, string> = {
                aadhaar: 'Aadhaar Card',
                driving_license: 'Driving License',
                photo: 'Photo',
                address_proof: 'Address Proof',
              };
              const docLabel = docLabelMap[type];

              return (
                <View
                  key={type}
                  className="flex-row items-center justify-between py-2"
                  testID={`checklist-item-${type}`}
                >
                  <View className="flex-row items-center gap-2">
                    {isUploaded && (
                      <CheckCircle2 size={16} color={colors.green} />
                    )}
                    {!isUploaded && hasError && (
                      <XCircle size={16} color="#ef4444" />
                    )}
                    {!isUploaded && !hasError && (
                      <View className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                    <Text
                      className={`text-sm ${
                        isUploaded
                          ? 'text-[#141c6c] font-medium'
                          : 'text-[#6b7280]'
                      }`}
                    >
                      {docLabel}
                    </Text>
                  </View>
                  {hasError && (
                    <TouchableOpacity
                      onPress={() => handleRetry(type)}
                      testID={`retry-${type}`}
                      accessibilityRole="button"
                      accessibilityLabel={`Retry ${docLabel} upload`}
                    >
                      <Text className="text-xs font-medium text-[#184cba]">
                        Retry
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Upload Section */}
        {status !== 'approved' && status !== 'under_review' && (
          <View className="mb-6">
            <Text className="text-base font-semibold text-[#141c6c] mb-3">
              Upload Documents
            </Text>
            <DocumentUploader
              documents={documents}
              uploadState={uploadState}
              onUpload={handleUpload}
              onRemove={handleRemove}
            />
          </View>
        )}

        {/* Global Error */}
        {error && !uploadState.uploading && (
          <View className="bg-red-50 rounded-xl p-3 mb-4">
            <Text className="text-sm text-red-600" testID="kyc-error">
              {error}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          className={`h-12 rounded-xl items-center justify-center ${
            canSubmit ? 'bg-[#184cba]' : 'bg-gray-300'
          }`}
          onPress={handleSubmit}
          disabled={!canSubmit}
          testID="submit-kyc-button"
          accessibilityRole="button"
          accessibilityLabel="Submit for Review"
          accessibilityState={{ disabled: !canSubmit }}
        >
          {loading && !uploadState.uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              className={`text-base font-semibold ${
                canSubmit ? 'text-white' : 'text-gray-500'
              }`}
            >
              Submit for Review
            </Text>
          )}
        </TouchableOpacity>

        {!allUploaded && status !== 'approved' && status !== 'under_review' && (
          <Text className="text-xs text-[#6b7280] text-center mt-2">
            Upload all 4 documents to enable submission
          </Text>
        )}

        {status === 'under_review' && (
          <Text className="text-sm text-[#6b7280] text-center mt-4">
            Your documents are being reviewed. We'll notify you once the review
            is complete.
          </Text>
        )}

        {status === 'approved' && (
          <View className="items-center mt-4">
            <CheckCircle2 size={32} color={colors.green} />
            <Text className="text-sm font-medium text-[#141c6c] mt-2">
              Your KYC is approved! You can now browse rental plans.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default KYCScreen;
