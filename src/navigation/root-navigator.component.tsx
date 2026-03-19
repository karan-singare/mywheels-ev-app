import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/use-auth.hook';
import { useAppDispatch } from '../store';
import { restoreSession, subscribeToAuthChanges } from '../store/thunks/auth.thunk';
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
  const { session, role, loading } = useAuth();

  useEffect(() => {
    dispatch(restoreSession());
    const unsubscribe = subscribeToAuthChanges(dispatch);
    return unsubscribe;
  }, [dispatch]);

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
