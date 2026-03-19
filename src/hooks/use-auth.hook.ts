import { useAppSelector, useAppDispatch } from '../store';
import { signIn, signUp, adminSignIn, signOut } from '../store/thunks/auth.thunk';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { session, user, role, loading, error } = useAppSelector((s) => s.auth);

  return {
    session,
    user,
    role,
    loading,
    error,
    signUp: (phone: string, password: string) => dispatch(signUp({ phone, password })),
    signIn: (phone: string, password: string) => dispatch(signIn({ phone, password })),
    adminSignIn: (email: string, password: string) => dispatch(adminSignIn({ email, password })),
    signOut: () => dispatch(signOut()),
  };
}
