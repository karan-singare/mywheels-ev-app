import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { uploadDocument, submitForReview, fetchDocuments } from '../store/thunks/kyc.thunk';
import type { KYCDocumentType } from '../enums/kyc-document-type.enum';

export function useKYC() {
  const dispatch = useAppDispatch();
  const { status, documents, loading, error, pendingCount } = useAppSelector((s) => s.kyc);
  const riderProfile = useAppSelector((s) => s.rider.profile);

  return {
    status,
    documents,
    loading,
    error,
    pendingCount,
    riderId: riderProfile?.id ?? null,
    fetchDocuments: useCallback(() => {
      const riderId = riderProfile?.id;
      if (riderId) {
        dispatch(fetchDocuments(riderId));
      }
    }, [dispatch, riderProfile?.id]),
    uploadDocument: (type: KYCDocumentType, base64: string, mimeType: string) => {
      const riderId = riderProfile?.id;
      console.log('[useKYC] uploadDocument called', { riderId, type, hasProfile: !!riderProfile });
      if (riderId) {
        dispatch(uploadDocument({ riderId, type, base64, mimeType }));
      } else {
        console.warn('[useKYC] No rider profile ID — upload skipped');
      }
    },
    submitForReview: () => {
      const riderId = riderProfile?.id;
      if (riderId) {
        dispatch(submitForReview(riderId));
      }
    },
  };
}
