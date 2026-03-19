import { useAppSelector, useAppDispatch } from '../store';
import { uploadDocument, submitForReview } from '../store/thunks/kyc.thunk';
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
    uploadDocument: (type: KYCDocumentType, uri: string) => {
      const riderId = riderProfile?.id;
      if (riderId) {
        dispatch(uploadDocument({ riderId, type, fileUri: uri }));
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
