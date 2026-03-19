import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { mmkvPersistenceMiddleware } from './middleware/mmkv-persistence.middleware';
import authReducer from './slices/auth.slice';
import riderReducer from './slices/rider.slice';
import kycReducer from './slices/kyc.slice';
import rentalsReducer from './slices/rentals.slice';
import vehiclesReducer from './slices/vehicles.slice';
import paymentsReducer from './slices/payments.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rider: riderReducer,
    kyc: kycReducer,
    rentals: rentalsReducer,
    vehicles: vehiclesReducer,
    payments: paymentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      mmkvPersistenceMiddleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
