import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

// Async Thunks - Customer Operations
export const fetchOwnReservations = createAsyncThunk(
  'reservations/fetchOwn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reservations/my');
      return response.data; // array of user's reservations
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch your reservations');
    }
  }
);

export const fetchTimeSlots = createAsyncThunk(
  'reservations/fetchTimeSlots',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reservations/time-slots');
      return response.data; // array of time slot strings
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch time slots');
    }
  }
);

export const checkTableAvailability = createAsyncThunk(
  'reservations/checkAvailability',
  async ({ date, timeSlot, guests }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/reservations/availability?date=${date}&timeSlot=${timeSlot}&guests=${guests}`
      );
      return response.data; // array of available tables
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to check table availability');
    }
  }
);

export const createReservation = createAsyncThunk(
  'reservations/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reservations', bookingData);
      return response.data; // created reservation
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create reservation');
    }
  }
);

export const cancelOwnReservation = createAsyncThunk(
  'reservations/cancelOwn',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/reservations/${id}`);
      return response.data; // updated reservation
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to cancel reservation');
    }
  }
);

// Async Thunks - Admin Operations
export const fetchAllReservations = createAsyncThunk(
  'reservations/fetchAll',
  async (date = '', { rejectWithValue }) => {
    try {
      const url = date ? `/admin/reservations?date=${date}` : '/admin/reservations';
      const response = await api.get(url);
      return response.data; // array of all reservations
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch system reservations');
    }
  }
);

export const adminUpdateReservation = createAsyncThunk(
  'reservations/adminUpdate',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/reservations/${id}`, updates);
      return response.data; // updated reservation
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update reservation');
    }
  }
);

export const adminCancelReservation = createAsyncThunk(
  'reservations/adminCancel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/reservations/${id}`);
      return response.data; // updated reservation with cancelled status
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to cancel reservation');
    }
  }
);

const initialState = {
  reservations: [],
  timeSlots: [],
  availableTables: [],
  loading: false,
  checkingAvailability: false,
  error: null,
  success: false,
};

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    clearReservationState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearAvailableTables: (state) => {
      state.availableTables = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Own
      .addCase(fetchOwnReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchOwnReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Time Slots
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.timeSlots = action.payload;
      })
      // Check Availability
      .addCase(checkTableAvailability.pending, (state) => {
        state.checkingAvailability = true;
        state.error = null;
      })
      .addCase(checkTableAvailability.fulfilled, (state, action) => {
        state.checkingAvailability = false;
        state.availableTables = action.payload;
      })
      .addCase(checkTableAvailability.rejected, (state, action) => {
        state.checkingAvailability = false;
        state.error = action.payload;
      })
      // Create Reservation
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations.unshift(action.payload);
        state.success = true;
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Own
      .addCase(cancelOwnReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(cancelOwnReservation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservations.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(cancelOwnReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin Fetch All
      .addCase(fetchAllReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchAllReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin Update
      .addCase(adminUpdateReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(adminUpdateReservation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservations.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(adminUpdateReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin Cancel
      .addCase(adminCancelReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(adminCancelReservation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservations.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(adminCancelReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReservationState, clearAvailableTables } = reservationSlice.actions;
export default reservationSlice.reducer;
