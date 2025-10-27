import { configureStore } from '@reduxjs/toolkit';
import roofReducer from './roofSlice';

export const store = configureStore({
  reducer: {
    roof: roofReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
