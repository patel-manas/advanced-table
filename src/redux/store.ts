import { configureStore } from '@reduxjs/toolkit';
// import your reducers here
import counterReducer from './slices/counter-slice.ts';
import inventoryReducer from './slices/inventory-slice.ts';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    inventory: inventoryReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
