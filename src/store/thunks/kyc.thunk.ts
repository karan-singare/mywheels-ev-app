import { createAsyncThunk } from '@reduxjs/toolkit';
import * as kycService from '../../services/kyc.service';
import type { KYCDocumentType } from '../../enums/kyc-document-type.enum';

export const fetchDocuments = createAsyncThunk(
  'kyc/fetchDocuments',
  async (riderId: string, { rejectWithValue }) => {
    try {
      const documents = await kycService.getDocuments(riderId);
      const status = await kycService.getKYCStatus(riderId);
      return { documents, status };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const uploadDocument = createAsyncThunk(
  'kyc/uploadDocument',
  async (
    { riderId, type, base64, mimeType }: { riderId: string; type: KYCDocumentType; base64: string; mimeType: string },
    { rejectWithValue },
  ) => {
    try {
      console.log('[kyc/uploadDocument] start', { riderId, type, base64Length: base64.length, mimeType });
      const document = await kycService.uploadDocument(riderId, type, base64, mimeType);
      console.log('[kyc/uploadDocument] success', document);
      return document;
    } catch (error) {
      console.error('[kyc/uploadDocument] error', error);
      return rejectWithValue((error as Error).message);
    }
  },
);

export const submitForReview = createAsyncThunk(
  'kyc/submitForReview',
  async (riderId: string, { rejectWithValue }) => {
    try {
      console.log('[kyc/submitForReview] start', { riderId });
      await kycService.submitForReview(riderId);
      console.log('[kyc/submitForReview] success');
    } catch (error) {
      console.error('[kyc/submitForReview] error', error);
      return rejectWithValue((error as Error).message);
    }
  },
);

export const approveKYC = createAsyncThunk(
  'kyc/approveKYC',
  async (
    { riderId, adminId }: { riderId: string; adminId: string },
    { rejectWithValue },
  ) => {
    try {
      await kycService.approveKYC(riderId, adminId);
      return { riderId };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const rejectKYC = createAsyncThunk(
  'kyc/rejectKYC',
  async (
    { riderId, adminId, reason }: { riderId: string; adminId: string; reason: string },
    { rejectWithValue },
  ) => {
    try {
      await kycService.rejectKYC(riderId, adminId, reason);
      return { riderId };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const fetchPendingReviews = createAsyncThunk(
  'kyc/fetchPendingReviews',
  async (_, { rejectWithValue }) => {
    try {
      const reviews = await kycService.getPendingReviews();
      return reviews;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);
