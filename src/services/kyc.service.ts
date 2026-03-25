import { supabase } from '../config/supabase.constant';
import type { KYCDocument, KYCReviewItem } from '../types/kyc.type';
import type { KYCDocumentType } from '../enums/kyc-document-type.enum';
import type { KYCStatus } from '../enums/kyc-status.enum';
import { uploadImageBase64, getSignedUrl } from './storage.service';

const KYC_BUCKET = 'kyc-documents';

export async function uploadDocument(
  riderId: string,
  type: KYCDocumentType,
  base64: string,
  mimeType: string,
): Promise<KYCDocument> {
  const filePath = `${riderId}/${type}_${Date.now()}`;
  await uploadImageBase64(KYC_BUCKET, filePath, base64, mimeType);
  const fileUrl = await getSignedUrl(KYC_BUCKET, filePath);

  const { data, error } = await supabase
    .from('kyc_documents')
    .insert({ rider_id: riderId, document_type: type, file_path: filePath })
    .select()
    .single();
  if (error) throw new Error(`Failed to save KYC document record: ${error.message}`);

  return { ...data, file_url: fileUrl } as KYCDocument;
}

export async function getDocuments(
  riderId: string,
): Promise<KYCDocument[]> {
  const { data, error } = await supabase
    .from('kyc_documents')
    .select('*')
    .eq('rider_id', riderId);
  if (error) throw new Error(`Failed to fetch KYC documents: ${error.message}`);

  const docs = await Promise.all(
    (data as KYCDocument[]).map(async (doc) => {
      try {
        const fileUrl = await getSignedUrl(KYC_BUCKET, doc.file_path);
        return { ...doc, file_url: fileUrl };
      } catch {
        // File missing from storage — return doc without URL
        console.warn('[kyc] signed URL failed for', doc.file_path, '— skipping');
        return { ...doc, file_url: '' };
      }
    }),
  );
  // Filter out docs with no URL (orphaned DB records)
  return docs.filter((d) => d.file_url !== '');
}

export async function getKYCStatus(
  riderId: string,
): Promise<KYCStatus> {
  const { data, error } = await supabase
    .from('riders')
    .select('kyc_status')
    .eq('id', riderId)
    .single();
  if (error) throw new Error(`Failed to fetch KYC status: ${error.message}`);
  return data.kyc_status as KYCStatus;
}

export async function submitForReview(
  riderId: string,
): Promise<void> {
  const { error: statusError } = await supabase
    .from('riders')
    .update({ kyc_status: 'under_review' })
    .eq('id', riderId);
  if (statusError) throw new Error(`Failed to update KYC status: ${statusError.message}`);

  const { error: reviewError } = await supabase
    .from('kyc_reviews')
    .insert({ rider_id: riderId, status: 'under_review' });
  if (reviewError) throw new Error(`Failed to create KYC review record: ${reviewError.message}`);
}

export async function approveKYC(
  riderId: string,
  adminId: string,
): Promise<void> {
  const { error: riderError } = await supabase
    .from('riders')
    .update({ kyc_status: 'approved' })
    .eq('id', riderId);
  if (riderError) throw new Error(`Failed to approve KYC: ${riderError.message}`);

  const { error: reviewError } = await supabase
    .from('kyc_reviews')
    .update({
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('rider_id', riderId)
    .eq('status', 'under_review');
  if (reviewError) throw new Error(`Failed to update KYC review: ${reviewError.message}`);
}

export async function rejectKYC(
  riderId: string,
  adminId: string,
  reason: string,
): Promise<void> {
  const { error: riderError } = await supabase
    .from('riders')
    .update({ kyc_status: 'rejected' })
    .eq('id', riderId);
  if (riderError) throw new Error(`Failed to reject KYC: ${riderError.message}`);

  const { error: reviewError } = await supabase
    .from('kyc_reviews')
    .update({
      status: 'rejected',
      reviewed_by: adminId,
      rejection_reason: reason,
      reviewed_at: new Date().toISOString(),
    })
    .eq('rider_id', riderId)
    .eq('status', 'under_review');
  if (reviewError) throw new Error(`Failed to update KYC review: ${reviewError.message}`);
}

export async function getPendingReviews(): Promise<KYCReviewItem[]> {
  const { data, error } = await supabase
    .from('kyc_reviews')
    .select(`
      *,
      riders!inner(full_name, phone)
    `)
    .eq('status', 'under_review')
    .order('submitted_at', { ascending: true });
  if (error) throw new Error(`Failed to fetch pending KYC reviews: ${error.message}`);

  return (data ?? []).map((row: Record<string, unknown>) => {
    const rider = row.riders as { full_name: string; phone: string };
    return {
      id: row.id as string,
      rider_id: row.rider_id as string,
      reviewed_by: row.reviewed_by as string | null,
      status: row.status as KYCStatus,
      rejection_reason: row.rejection_reason as string | null,
      submitted_at: row.submitted_at as string,
      reviewed_at: row.reviewed_at as string | null,
      rider_name: rider.full_name,
      rider_phone: rider.phone,
    };
  });
}
