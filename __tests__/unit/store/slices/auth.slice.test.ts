import authReducer, { AuthState, setSession, setUser, setRole, clearAuth } from '../../../../src/store/slices/auth.slice';

const initialState: AuthState = {
  session: null,
  user: null,
  role: null,
  loading: false,
  error: null,
};

describe('auth.slice', () => {
  it('returns initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('setSession updates session', () => {
    const session = { access_token: 'abc' };
    const state = authReducer(initialState, setSession(session));
    expect(state.session).toEqual(session);
  });

  it('setUser updates user', () => {
    const user = { id: '123', email: 'test@test.com' };
    const state = authReducer(initialState, setUser(user));
    expect(state.user).toEqual(user);
  });

  it('setRole updates role', () => {
    const state = authReducer(initialState, setRole('admin'));
    expect(state.role).toBe('admin');
  });

  it('clearAuth resets auth state', () => {
    const populated: AuthState = {
      session: { token: 'x' },
      user: { id: '1' },
      role: 'rider',
      loading: false,
      error: 'some error',
    };
    const state = authReducer(populated, clearAuth());
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.role).toBeNull();
    expect(state.error).toBeNull();
  });

  // signIn thunk lifecycle
  it('signIn/pending sets loading', () => {
    const state = authReducer(initialState, { type: 'auth/signIn/pending' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('signIn/fulfilled sets session, user, and role', () => {
    const payload = { session: { token: 'abc' }, user: { id: '1' } };
    const state = authReducer(
      { ...initialState, loading: true },
      { type: 'auth/signIn/fulfilled', payload },
    );
    expect(state.loading).toBe(false);
    expect(state.session).toEqual(payload.session);
    expect(state.user).toEqual(payload.user);
    expect(state.role).toBe('rider');
  });

  it('signIn/rejected sets error', () => {
    const state = authReducer(
      { ...initialState, loading: true },
      { type: 'auth/signIn/rejected', payload: 'Invalid credentials' },
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Invalid credentials');
  });

  // signOut thunk lifecycle
  it('signOut/fulfilled clears all auth state', () => {
    const populated: AuthState = {
      session: { token: 'x' },
      user: { id: '1' },
      role: 'rider',
      loading: true,
      error: null,
    };
    const state = authReducer(populated, { type: 'auth/signOut/fulfilled' });
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.role).toBeNull();
    expect(state.loading).toBe(false);
  });

  // restoreSession thunk lifecycle
  it('restoreSession/fulfilled restores session, user, and role', () => {
    const payload = { session: { token: 'restored' }, user: { id: '2' }, role: 'admin' as const };
    const state = authReducer(
      { ...initialState, loading: true },
      { type: 'auth/restoreSession/fulfilled', payload },
    );
    expect(state.loading).toBe(false);
    expect(state.session).toEqual(payload.session);
    expect(state.role).toBe('admin');
  });

  it('restoreSession/rejected clears session', () => {
    const state = authReducer(
      { ...initialState, loading: true },
      { type: 'auth/restoreSession/rejected', payload: 'No session' },
    );
    expect(state.loading).toBe(false);
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.role).toBeNull();
  });

  // refreshSession thunk lifecycle
  it('refreshSession/fulfilled updates session and user', () => {
    const payload = { session: { token: 'refreshed' }, user: { id: '3' } };
    const state = authReducer(
      { ...initialState, session: { token: 'old' }, user: { id: '3' }, role: 'rider' },
      { type: 'auth/refreshSession/fulfilled', payload },
    );
    expect(state.session).toEqual(payload.session);
    expect(state.user).toEqual(payload.user);
    expect(state.role).toBe('rider'); // role preserved
  });

  it('refreshSession/rejected clears all auth state', () => {
    const populated: AuthState = {
      session: { token: 'x' },
      user: { id: '1' },
      role: 'rider',
      loading: false,
      error: null,
    };
    const state = authReducer(populated, { type: 'auth/refreshSession/rejected' });
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.role).toBeNull();
    expect(state.error).toBeNull();
  });
});
