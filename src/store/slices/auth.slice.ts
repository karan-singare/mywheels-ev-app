import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '../../enums/user-role.enum';

export interface AuthState {
  session: Record<string, unknown> | null;
  user: Record<string, unknown> | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  user: null,
  role: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Record<string, unknown> | null>) {
      state.session = action.payload;
    },
    setUser(state, action: PayloadAction<Record<string, unknown> | null>) {
      state.user = action.payload;
    },
    setRole(state, action: PayloadAction<UserRole | null>) {
      state.role = action.payload;
    },
    clearAuth(state) {
      state.session = null;
      state.user = null;
      state.role = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // signUp lifecycle
    builder.addMatcher(
      (action) => action.type === 'auth/signUp/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'auth/signUp/fulfilled',
      (state, action) => {
        state.loading = false;
        state.session = action.payload?.session ?? null;
        state.user = action.payload?.user ?? null;
      },
    );
    builder.addMatcher(
      (action) => action.type === 'auth/signUp/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Sign up failed';
      },
    );

    // signIn lifecycle
    builder.addMatcher(
      (action) => action.type === 'auth/signIn/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'auth/signIn/fulfilled',
      (state, action) => {
        state.loading = false;
        state.session = action.payload?.session ?? null;
        state.user = action.payload?.user ?? null;
        state.role = 'rider';
      },
    );
    builder.addMatcher(
      (action) => action.type === 'auth/signIn/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Sign in failed';
      },
    );

    // adminSignIn lifecycle
    builder.addMatcher(
      (action) => action.type === 'auth/adminSignIn/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'auth/adminSignIn/fulfilled',
      (state, action) => {
        state.loading = false;
        state.session = action.payload?.session ?? null;
        state.user = action.payload?.user ?? null;
        state.role = 'admin';
      },
    );
    builder.addMatcher(
      (action) => action.type === 'auth/adminSignIn/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Admin sign in failed';
      },
    );

    // signOut lifecycle
    builder.addMatcher(
      (action) => action.type === 'auth/signOut/pending',
      (state) => { state.loading = true; },
    );
    builder.addMatcher(
      (action) => action.type === 'auth/signOut/fulfilled',
      (state) => {
        state.loading = false;
        state.session = null;
        state.user = null;
        state.role = null;
        state.error = null;
      },
    );
    builder.addMatcher(
      (action) => action.type === 'auth/signOut/rejected',
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Sign out failed';
      },
    );

    // restoreSession lifecycle
    builder.addMatcher(
      (action) => action.type === 'auth/restoreSession/pending',
      (state) => { state.loading = true; state.error = null; },
    );
    builder.addMatcher(
      (action) => action.type === 'auth/restoreSession/fulfilled',
      (state, action) => {
        state.loading = false;
        state.session = action.payload?.session ?? null;
        state.user = action.payload?.user ?? null;
        state.role = action.payload?.role ?? null;
      },
    );
    builder.addMatcher(
      (action) => action.type === 'auth/restoreSession/rejected',
      (state, action) => {
        state.loading = false;
        state.session = null;
        state.user = null;
        state.role = null;
        state.error = action.payload as string ?? 'Session restore failed';
      },
    );

    // refreshSession lifecycle
    builder.addMatcher(
      (action) => action.type === 'auth/refreshSession/fulfilled',
      (state, action) => {
        state.session = action.payload?.session ?? null;
        state.user = action.payload?.user ?? null;
      },
    );
    builder.addMatcher(
      (action) => action.type === 'auth/refreshSession/rejected',
      (state) => {
        state.session = null;
        state.user = null;
        state.role = null;
        state.error = null;
      },
    );
  },
});

export const { setSession, setUser, setRole, clearAuth } = authSlice.actions;
export default authSlice.reducer;
