import { clearPersistedState, getPersistedState } from '../../../../src/store/middleware/mmkv-persistence.middleware';

// The MMKV mock is set up in __mocks__/react-native-mmkv.js
// We access the mock storage to verify behavior
const mockMMKV = require('react-native-mmkv');

describe('mmkv-persistence.middleware', () => {
  beforeEach(() => {
    // Clear mock storage between tests
    if (mockMMKV._mockStorage) {
      mockMMKV._mockStorage.clear();
    }
  });

  describe('clearPersistedState', () => {
    it('removes all persisted slice keys from MMKV', () => {
      // Pre-populate mock storage
      const storage = new mockMMKV.MMKV();
      storage.set('redux_auth', JSON.stringify({ session: { token: 'abc' } }));
      storage.set('redux_rider', JSON.stringify({ profile: { name: 'Test' } }));
      storage.set('redux_kyc', JSON.stringify({ status: 'approved' }));
      storage.set('redux_rentals', JSON.stringify({ activeRental: null }));
      storage.set('redux_vehicles', JSON.stringify({ vehicles: [] }));

      clearPersistedState();

      // All persisted keys should be gone
      const state = getPersistedState();
      expect(state).toEqual({});
    });
  });

  describe('getPersistedState', () => {
    it('returns empty object when no data is persisted', () => {
      const state = getPersistedState();
      expect(state).toEqual({});
    });

    it('returns persisted data for available slices', () => {
      const storage = new mockMMKV.MMKV();
      const authData = { session: { token: 'test' }, user: null, role: null, loading: false, error: null };
      storage.set('redux_auth', JSON.stringify(authData));

      const state = getPersistedState();
      expect(state.auth).toEqual(authData);
    });
  });
});
