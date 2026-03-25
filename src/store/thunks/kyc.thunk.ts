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
    { riderId, type, fileUri }: { riderId: string; type: KYCDocumentType; fileUri: string },
    { rejectWithValue },
  ) => {
    try {
      console.log('[kyc/uploadDocument] start', { riderId, type, fileUri: fileUri.substring(0, 80) });
      const document = await kycService.uploadDocument(riderId, type, fileUri);
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
      await kycService.submitForReview(riderId);
    } catch (error) {
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
