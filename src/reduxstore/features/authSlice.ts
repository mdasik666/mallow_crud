import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Toast from 'components/custom/Toast';
import { LoginProps } from 'pages/User/Login/LoginInterface';
import axiosInstance from 'services/AxiosInstance';

interface AuthState {
  token: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  username: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'api/login',
  async (credentials: LoginProps, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('api/login', credentials);
      const token = response.data.token;
      if (credentials.remember) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', credentials.email);
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('username', credentials.email);
      }
      return { token, email: credentials.email };
    } catch (error: any) {
      Toast("error",error.response.data.message)
      return rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.username = action.payload.email;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authReducer