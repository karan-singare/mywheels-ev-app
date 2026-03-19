import { useAppSelector, useAppDispatch } from '../store';
import { updateProfile } from '../store/thunks/rider.thunk';
import type { RiderProfileInput } from '../types/rider.type';

export function useRider() {
  const dispatch = useAppDispatch();
  const { profile, loading, error, onboardingStep } = useAppSelector((s) => s.rider);
  const user = useAppSelector((s) => s.auth.user);

  return {
    profile,
    loading,
    error,
    onboardingStep,
    updateProfile: (data: Partial<RiderProfileInput>) => {
      const userId = user?.id as string | undefined;
      if (userId) {
        dispatch(updateProfile({ userId, data }));
      }
    },
  };
}
