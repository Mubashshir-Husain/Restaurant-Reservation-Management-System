import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import tableReducer from './slices/tableSlice.js';
import reservationReducer from './slices/reservationSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tables: tableReducer,
    reservations: reservationReducer,
  },
});

export default store;
