import { createSlice } from '@reduxjs/toolkit';
import { KYCStatus } from '../../enums/kyc-status.enum';
import { KYCDocument, KYCReviewItem } from '../../types/kyc.type';

export interface KYCState {
  status: KYCStatus;
  documents: KYCDocument[];
  pendingReviews: KYCReviewItem[];
  pendingCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: KYCState = {
  status: 'not_started',
  documents: [],
  pendingReviews: [],
  pendingCount: 0,
  loading: false,
  error: null,
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchDocuments lifecycle
    builder.addMatcher(
      (action) => action.type === 'kyc/fetchDocuments/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'kyc/fetchDocuments/fulfilled',
      (state, action) => {
        state.loading = false;
        state.documents = action.payload?.documents ?? [];
        state.status = action.payload?.status ?? state.status;
      },
    );
    builder.addMatcher(
      (action) => action.type === 'kyc/fetchDocuments/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to fetch documents';
      },
    );

    // uploadDocument lifecycle
    builder.addMatcher(
      (action) => action.type === 'kyc/uploadDocument/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'kyc/uploadDocument/fulfilled',
      (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.documents.push(action.payload);
          if (state.status === 'not_started') {
            state.status = 'in_progress';
          }
        }
      },
    );
    builder.addMatcher(
      (action) => action.type === 'kyc/uploadDocument/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to upload document';
      },
    );

    // submitForReview lifecycle
    builder.addMatcher(
      (action) => action.type === 'kyc/submitForReview/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'kyc/submitForReview/fulfilled',
      (state) => {
        state.loading = false;
        state.status = 'under_review';
      },
    );
    builder.addMatcher(
      (action) => action.type === 'kyc/submitForReview/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to submit for review';
      },
    );

    // approveKYC lifecycle (admin)
    builder.addMatcher(
      (action) => action.type === 'kyc/approveKYC/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'kyc/approveKYC/fulfilled',
      (state, action) => {
        state.loading = false;
        const riderId = action.payload?.riderId;
        if (riderId) {
          state.pendingReviews = state.pendingReviews.filter(
            (r) => r.rider_id !== riderId,
          );
          state.pendingCount = state.pendingReviews.length;
        }
      },
    );
    builder.addMatcher(
      (action) => action.type === 'kyc/approveKYC/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to approve KYC';
      },
    );

    // rejectKYC lifecycle (admin)
    builder.addMatcher(
      (action) => action.type === 'kyc/rejectKYC/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'kyc/rejectKYC/fulfilled',
      (state, action) => {
        state.loading = false;
        const riderId = action.payload?.riderId;
        if (riderId) {
          state.pendingReviews = state.pendingReviews.filter(
            (r) => r.rider_id !== riderId,
          );
          state.pendingCount = state.pendingReviews.length;
        }
      },
    );
    builder.addMatcher(
      (action) => action.type === 'kyc/rejectKYC/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to reject KYC';
      },
    );

    // fetchPendingReviews lifecycle (admin)
    builder.addMatcher(
      (action) => action.type === 'kyc/fetchPendingReviews/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'kyc/fetchPendingReviews/fulfilled',
      (state, action) => {
        state.loading = false;
        state.pendingReviews = action.payload ?? [];
        state.pendingCount = state.pendingReviews.length;
      },
    );
    builder.addMatcher(
      (action) => action.type === 'kyc/fetchPendingReviews/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to fetch pending reviews';
      },
    );
  },
});

export default kycSlice.reducer;
