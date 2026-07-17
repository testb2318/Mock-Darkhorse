import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../api/axiosInstance'; // ✅ Use axiosInstance everywhere

// -------- Thunks --------
// ── MOCK CREDENTIALS ──────────────────────────────────────────────────────────
const MOCK_USER = {
  email: "mock@gmail.com",
  password: "123456",
  payload: {
    token: "mock-jwt-token-Mock-user-2024",
    expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    auth: {
      _id: "mock_user_001",
      name: "Mock User",
      email: "Mock@gmail.com",
      username: "mockuser",
      role: "user",
      balance: 5000,
      isVerified: true,
      avatar: null,
      referralCode: "MOCK2024",
      createdAt: new Date().toISOString(),
    },
  },
};
// ─────────────────────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values, thunkAPI) => {
    try {
      // ── Mock authorization bypass ──────────────────────────────────────────
      if (
        values.email?.trim().toLowerCase() === MOCK_USER.email &&
        values.password === MOCK_USER.password
      ) {
        localStorage.setItem("userToken", MOCK_USER.payload.token);
        return MOCK_USER.payload;
      }
      // ──────────────────────────────────────────────────────────────────────

      const { data } = await axiosInstance.post("/auth/signin", values);

      if (data.token) {
        localStorage.setItem("userToken", data.token);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.message || "Login failed",
      });
    }
  }
);

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (values, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/auth/adminsignin", values);

      if (data.token) {
        localStorage.setItem("adminToken", data.token);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.message || "Admin login failed",
      });
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (values, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/auth/register", values);

      if (data.token) {
        localStorage.setItem("userToken", data.token);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.error || error.message || "Signup failed",
      });
    }
  }
);

export const signoutuser = createAsyncThunk(
  "auth/signoutuser",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/auth/signout");
      localStorage.removeItem("userToken");
      return data;
    } catch (error) {
      localStorage.removeItem("userToken");
      return thunkAPI.rejectWithValue({
        error: error.message || "Signout failed",
      });
    }
  }
);

export const signoutadmin = createAsyncThunk(
  "auth/signoutadmin",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/auth/signoutadmin");
      localStorage.removeItem("adminToken");
      return data;
    } catch (error) {
      localStorage.removeItem("adminToken");
      return thunkAPI.rejectWithValue({
        error: error.message || "Admin signout failed",
      });
    }
  }
);

export const sendVerificationEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (values, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(
        "/auth/email-verification",
        values
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.error || error.message || "Failed to send email",
      });
    }
  }
);

export const sendUserVerificationEmail = createAsyncThunk(
  "auth/sendUserVerificationEmail",
  async (values, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/auth/verify-user", values);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.error || error.message || "Failed to send email",
      });
    }
  }
);

export const verifyEmailCode = createAsyncThunk(
  "auth/verifyEmailCode",
  async (values, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/auth/otp-code", values);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: error.error || error.message || "Verification failed",
      });
    }
  }
);

// -------- Initial State --------
const initialState = {
  auth: null,
  admin: null,
  userToken: null,
  adminToken: null,
  loading: false,
  error: null,
  message: null,
  expireAt: null,
  adminExpireAt: null,
};

// -------- Slice --------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    logout: (state) => {
      state.auth = null;
      state.admin = null;
      state.userToken = null;
      state.adminToken = null;
      localStorage.removeItem("userToken");
      localStorage.removeItem("adminToken");
    },
    logoutUser: (state) => {
      state.auth = null;
      state.userToken = null;
      state.expireAt = null;
      localStorage.removeItem("userToken");
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.adminToken = null;
      state.adminExpireAt = null;
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // -------- loginUser --------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("User login successful:", action.payload);
        state.loading = false;
        state.auth = action.payload.auth;
        state.userToken = action.payload.token;
        state.expireAt = action.payload.expireAt;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // -------- loginAdmin --------
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        console.log("Admin login successful:", action.payload);
        state.loading = false;
        state.admin = action.payload.admin;
        state.adminToken = action.payload.token;
        state.adminExpireAt = action.payload.expireAt;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // -------- signupUser --------
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.auth = action.payload.auth;
        state.userToken = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // -------- signoutuser --------
      .addCase(signoutuser.fulfilled, (state) => {
        state.loading = false;
        state.auth = null;
        state.userToken = null;
        state.expireAt = null;
      })
      .addCase(signoutuser.rejected, (state, action) => {
        state.loading = false;
        state.auth = null;
        state.userToken = null;
        state.error = action.payload.error;
      })

      // -------- signoutadmin --------
      .addCase(signoutadmin.fulfilled, (state) => {
        state.loading = false;
        state.admin = null;
        state.adminToken = null;
        state.adminExpireAt = null;
      })
      .addCase(signoutadmin.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.adminToken = null;
        state.error = action.payload.error;
      })

      // -------- sendUserVerificationEmail --------
      .addCase(sendUserVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendUserVerificationEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.message = "Verification email sent!";
      })
      .addCase(sendUserVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // -------- sendVerificationEmail --------
      .addCase(sendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendVerificationEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.message = "Verification email sent!";
      })
      .addCase(sendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // -------- verifyEmailCode --------
      .addCase(verifyEmailCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailCode.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.message = "Email Verified Successfully!";
      })
      .addCase(verifyEmailCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { clearErrors, clearMessage, logout, logoutUser, logoutAdmin } =
  authSlice.actions;

// -------- Selectors --------
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.auth;
export const selectAdmin = (state) => state.auth.admin;
export const selectUserToken = (state) => state.auth.userToken;
export const selectAdminToken = (state) => state.auth.adminToken;
export const selectIsUserLoggedIn = (state) => !!state.auth.auth;
export const selectIsAdminLoggedIn = (state) => !!state.auth.admin;

export default authSlice.reducer;