import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_URL from '../../config/api';
import axios from 'axios';
// Configure Axios globally for HTTP-Only Cookie tunneling
axios.defaults.withCredentials = true;

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data)); // JWT isn't here anymore!
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const register = createAsyncThunk('auth/register', async ({ name, email, password, role }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, role });
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/api/auth/logout`);
    localStorage.removeItem('userInfo');
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: userInfoFromStorage,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    });
    // Register actions
    builder.addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    });
    // Logout 
    builder.addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
    })
  },
});

export default authSlice.reducer;
