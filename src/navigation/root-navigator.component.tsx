import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/use-auth.hook';
import { useAppDispatch, useAppSelector } from '../store';
import { restoreSession, subscribeToAuthChanges } from '../store/thunks/auth.thunk';
import { fetchProfile } from '../store/thunks/rider.thunk';
import { fetchDocuments } from '../store/thunks/kyc.thunk';
import { AuthStack } from './auth-stack.component';
import { RiderTabs } from './rider-tabs.component';
import { AdminTabs } from './admin-tabs.component';
import { colors } from '../config/theme.constant';

type AuthState = 'loading' | 'unauthenticated' | 'rider' | 'admin';

function getAuthState(
  loading: boolean,
  session: unknown,
  role: string | null,
): AuthState {
  if (loading) return 'loading';
  if (!session) return 'unauthenticated';
  if (role === 'admin') return 'admin';
  return 'rider';
}

export function RootNavigator() {
  const dispatch = useAppDispatch();
  const { session, user, role, loading } = useAuth();
  const riderProfileId = useAppSelector((s) => s.rider.profile?.id);

  useEffect(() => {
    dispatch(restoreSession());
    const unsubscribe = subscribeToAuthChanges(dispatch);
    return unsubscribe;
  }, [dispatch]);

  // Fetch rider profile once authenticated
  useEffect(() => {
    if (session && user?.id && role === 'rider') {
      console.log('[RootNavigator] Authenticated user:', { id: user.id, role, session: !!session });
      dispatch(fetchProfile(user.id as string));
    }
  }, [dispatch, session, user?.id, role]);

  // Fetch KYC status + documents once rider profile is loaded
  useEffect(() => {
    if (riderProfileId) {
      dispatch(fetchDocuments(riderProfileId));
    }
  }, [dispatch, riderProfileId]);

  const authState = getAuthState(loading, session, role);

  switch (authState) {
    case 'loading':
      return (
        <View style={styles.splash}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    case 'unauthenticated':
      return <AuthStack />;
    case 'rider':
      return <RiderTabs />;
    case 'admin':
      return <AdminTabs />;
  }
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
});
