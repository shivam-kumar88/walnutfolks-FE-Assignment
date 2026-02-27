import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chartSlice from './chartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    charts: chartSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;