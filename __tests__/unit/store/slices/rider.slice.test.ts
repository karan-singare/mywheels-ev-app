import riderReducer, { RiderState } from '../../../../src/store/slices/rider.slice';
import { RiderProfile } from '../../../../src/types/rider.type';

const initialState: RiderState = {
  profile: null,
  onboardingStep: 'personal_info',
  loading: false,
  error: null,
};

const mockProfile: RiderProfile = {
  id: 'r1',
  user_id: 'u1',
  full_name: 'Test Rider',
  phone: '9876543210',
  date_of_birth: '1995-01-01',
  gender: 'male',
  address: '123 Main St',
  city: 'Hyderabad',
  emergency_contact: '9876543211',
  kyc_status: 'not_started',
  onboarding_step: 'completed',
  profile_completion: 100,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('rider.slice', () => {
  it('returns initial state', () => {
    expect(riderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('fetchProfile/pending sets loading', () => {
    const state = riderReducer(initialState, { type: 'rider/fetchProfile/pending' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchProfile/fulfilled sets profile and onboardingStep', () => {
    const state = riderReducer(
      { ...initialState, loading: true },
      { type: 'rider/fetchProfile/fulfilled', payload: mockProfile },
    );
    expect(state.loading).toBe(false);
    expect(state.profile).toEqual(mockProfile);
    expect(state.onboardingStep).toBe('completed');
  });

  it('fetchProfile/rejected sets error', () => {
    const state = riderReducer(
      { ...initialState, loading: true },
      { type: 'rider/fetchProfile/rejected', payload: 'Not found' },
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Not found');
  });

  it('createProfile/fulfilled sets profile', () => {
    const state = riderReducer(
      { ...initialState, loading: true },
      { type: 'rider/createProfile/fulfilled', payload: mockProfile },
    );
    expect(state.profile).toEqual(mockProfile);
    expect(state.loading).toBe(false);
  });

  it('updateProfile/fulfilled updates profile', () => {
    const updated = { ...mockProfile, full_name: 'Updated Name' };
    const state = riderReducer(
      { ...initialState, profile: mockProfile, loading: true },
      { type: 'rider/updateProfile/fulfilled', payload: updated },
    );
    expect(state.profile?.full_name).toBe('Updated Name');
  });
});
