

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../api/axiosInstance';

// -------- Thunks --------
export const getAllUsers = createAsyncThunk(
  "staff/getAllUsers",
  async (page, thunkAPI) => {
    try {
      const { data } = await api.get(`/users/list?page=${page}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response?.data?.message || error.message,
      });
    }
  }
);

export const getAllNonUsers = createAsyncThunk(
  "staff/getAllNonUsers",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(`/users/non/users`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response?.data?.message || error.message,
      });
    }
  }
);

export const getAllRewards = createAsyncThunk(
  "staff/getAllRewards",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(`/users/rewards`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response?.data?.message || error.message,
      });
    }
  }
);

// ✅ ADMIN — Kisi bhi user ki profile dekhe ID se
export const getUser = createAsyncThunk(
  "staff/getUser",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/users/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response?.data?.message || error.message,
      });
    }
  }
);

// ✅ NORMAL USER — Apni profile dekhe (token se ID, URL me nahi)
export const getMyProfile = createAsyncThunk(
  "staff/getMyProfile",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get(`/users/account`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response?.data?.message || error.message,
      });
    }
  }
);

export const getUserbyemail = createAsyncThunk(
  "staff/getUserbyemail",
  async (email, thunkAPI) => {
    try {
      const { data } = await api.get(`/users?email=${email}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response?.data?.message || error.message,
      });
    }
  }
);

export const deleteUsers = createAsyncThunk(
  "staff/deleteUsers",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.delete(`/users/${id}`);
      return { Id: id, message: data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response?.data?.message || error.message,
      });
    }
  }
);

// ✅ ADMIN — Kisi bhi user ko ID se update kare
export const updateUsers = createAsyncThunk(
  "users/updateUsers",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const { data } = await api.put(`/users/${id}`, updatedData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response?.data?.message || error.message,
      });
    }
  }
);

// ✅ NORMAL USER — Apni profile update kare (token se ID, URL me nahi)
export const updateMyProfile = createAsyncThunk(
  "users/updateMyProfile",
  async (updatedData, thunkAPI) => {
    try {
      const { data } = await api.put(`/users/account`, updatedData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response?.data?.message || error.message,
      });
    }
  }
);

export const rewardNotification = createAsyncThunk(
  "student/rewardNotification",
  async (updatedData, thunkAPI) => {
    try {
      const { data } = await api.post(`/users/send/reward`, updatedData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response?.data?.message || error.message,
      });
    }
  }
);

export const defaulterNotification = createAsyncThunk(
  "student/defaulterNotification",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/users/get/defaulterreward/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.response?.data?.message || error.message,
      });
    }
  }
);

// -------- Initial State --------
const initialState = {
  users: null,
  totalPages: null,
  userrewardnotification: null,
  allnonusers: null,
  allrewards: null,
  singleuser: null,   // Admin ke liye — kisi bhi user ki profile
  myprofile: null,    // Normal user ke liye — apni profile
  emailuser: null,
  loading: false,
  error: null,
  message: null,
};

// -------- Slice --------
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllUsers
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.allusers;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // getAllNonUsers
      .addCase(getAllNonUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNonUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allnonusers = action.payload.allnonusers;
      })
      .addCase(getAllNonUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // getAllRewards
      .addCase(getAllRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.allrewards = action.payload.allrewards;
      })
      .addCase(getAllRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // getUser — Admin only
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.singleuser = action.payload.singleuser;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // getMyProfile — Normal user
      .addCase(getMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ FIX — singleuser hai, user nahi
        state.myprofile = action.payload.singleuser;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // getUserbyemail
      .addCase(getUserbyemail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserbyemail.fulfilled, (state, action) => {
        state.loading = false;
        state.emailuser = action.payload.emailuser;
      })
      .addCase(getUserbyemail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // deleteUsers
      .addCase(deleteUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.allusers = state.allusers?.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deleteUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // updateUsers — Admin only
      .addCase(updateUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        if (action.payload.user) {
          state.singleuser = action.payload.user;
        }
      })
      .addCase(updateUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Update failed";
      })

      // updateMyProfile — Normal user
      .addCase(updateMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        if (action.payload.user) {
          state.myprofile = action.payload.user;
        }
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Update failed";
      })

      // rewardNotification
      .addCase(rewardNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rewardNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(rewardNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // defaulterNotification
      .addCase(defaulterNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(defaulterNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.userrewardnotification = action.payload.userrewardnotification;
      })
      .addCase(defaulterNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { clearErrors, clearMessage } = userSlice.actions;

export const selectSingleUser = (state) => state.users.singleuser;
export const selectMyProfile = (state) => state.users.myprofile;
export default userSlice.reducer;