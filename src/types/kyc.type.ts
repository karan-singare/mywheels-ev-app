import { KYCDocumentType } from '../enums/kyc-document-type.enum';
import { KYCStatus } from '../enums/kyc-status.enum';

export interface KYCDocument {
  id: string;
  rider_id: string;
  document_type: KYCDocumentType;
  file_path: string;
  file_url: string;
  uploaded_at: string;
}

export interface KYCReview {
  id: string;
  rider_id: string;
  reviewed_by: string | null;
  status: KYCStatus;
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface KYCReviewItem extends KYCReview {
  rider_name: string;
  rider_phone: string;
}
