import { createSlice } from '@reduxjs/toolkit';
import { RiderProfile } from '../../types/rider.type';
import { OnboardingStep } from '../../enums/onboarding-step.enum';

export interface RiderState {
  profile: RiderProfile | null;
  onboardingStep: OnboardingStep;
  loading: boolean;
  error: string | null;
}

const initialState: RiderState = {
  profile: null,
  onboardingStep: 'personal_info',
  loading: false,
  error: null,
};

const riderSlice = createSlice({
  name: 'rider',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchProfile lifecycle
    builder.addMatcher(
      (action) => action.type === 'rider/fetchProfile/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'rider/fetchProfile/fulfilled',
      (state, action) => {
        state.loading = false;
        state.profile = action.payload ?? null;
        if (action.payload?.onboarding_step) {
          state.onboardingStep = action.payload.onboarding_step;
        }
      },
    );
    builder.addMatcher(
      (action) => action.type === 'rider/fetchProfile/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to fetch profile';
      },
    );

    // createProfile lifecycle
    builder.addMatcher(
      (action) => action.type === 'rider/createProfile/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'rider/createProfile/fulfilled',
      (state, action) => {
        state.loading = false;
        state.profile = action.payload ?? null;
        if (action.payload?.onboarding_step) {
          state.onboardingStep = action.payload.onboarding_step;
        }
      },
    );
    builder.addMatcher(
      (action) => action.type === 'rider/createProfile/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to create profile';
      },
    );

    // updateProfile lifecycle
    builder.addMatcher(
      (action) => action.type === 'rider/updateProfile/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'rider/updateProfile/fulfilled',
      (state, action) => {
        state.loading = false;
        state.profile = action.payload ?? null;
        if (action.payload?.onboarding_step) {
          state.onboardingStep = action.payload.onboarding_step;
        }
      },
    );
    builder.addMatcher(
      (action) => action.type === 'rider/updateProfile/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Failed to update profile';
      },
    );
  },
});

export default riderSlice.reducer;
