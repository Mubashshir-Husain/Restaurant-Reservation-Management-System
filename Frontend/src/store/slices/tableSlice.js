import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

// Async Thunks
export const fetchTables = createAsyncThunk(
  'tables/fetchAll',
  async (activeOnly = false, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tables?activeOnly=${activeOnly}`);
      return response.data; // array of tables
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch tables');
    }
  }
);

export const createTable = createAsyncThunk(
  'tables/create',
  async (tableData, { rejectWithValue }) => {
    try {
      const response = await api.post('/tables', tableData);
      return response.data; // created table
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create table');
    }
  }
);

export const updateTable = createAsyncThunk(
  'tables/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/tables/${id}`, updates);
      return response.data; // updated table
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update table');
    }
  }
);

export const deleteTable = createAsyncThunk(
  'tables/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tables/${id}`);
      return id; // deleted table id
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete table');
    }
  }
);

const initialState = {
  tables: [],
  loading: false,
  error: null,
  success: false,
};

const tableSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    clearTableState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tables
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Table
      .addCase(createTable.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTable.fulfilled, (state, action) => {
        state.loading = false;
        state.tables.push(action.payload);
        state.success = true;
      })
      .addCase(createTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Table
      .addCase(updateTable.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTable.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tables.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Table
      .addCase(deleteTable.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = state.tables.filter((t) => t._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTableState } = tableSlice.actions;
export default tableSlice.reducer;
