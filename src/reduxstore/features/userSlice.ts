import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'reduxstore/store';
import axiosInstance from 'services/AxiosInstance';

interface UserList {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface User {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: UserList[];
}

interface UserState {
  userdata: User;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userdata: {
    page: 0,
    per_page: 0,
    total: 0,
    total_pages: 0,
    data: []
  },
  loading: false,
  error: null,
};
type page = number;
export const fetchUserList = createAsyncThunk(
  'api/users',
  async (page: page, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token || localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }
    try {
      const response = await axiosInstance.get(`api/users?page=${page}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createUserData = createAsyncThunk(
  'users/createUser',
  async (data: UserList, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`api/users`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error deleting user");
    }
  }
);

export const updateUserData = createAsyncThunk(
  'users/updateUser',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`api/users/${data.id}`, data.data);
      let responseData = response.data
      delete responseData.updatedAt
      return { ...responseData, id: data.id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error deleting user");
    }
  }
);

export const deleteUserData = createAsyncThunk(
  'users/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`api/users/${userId}`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error deleting user");
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.userdata = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userdata.data.push(action.payload);
      })
      .addCase(createUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.userdata.data.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.userdata.data[index] = { ...state.userdata.data[index], ...action.payload };
        }
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUserData.fulfilled, (state, action) => {
        state.userdata.data = state.userdata.data.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUserData.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const userReducer = userSlice.reducer;
export default userReducer
