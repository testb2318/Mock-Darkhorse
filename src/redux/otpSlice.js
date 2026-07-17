

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../baseurl";

const getAuthHeaders = () => {
  const token = localStorage.getItem("userToken") || localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const sendOTP = createAsyncThunk(
    "staff/sendOTP",
    async ({ userId, email }, thunkAPI) => {
      try {
        const response = await fetch(`${BASE_URL}/otp/send`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ userId, email }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
);

export const verifyOTP = createAsyncThunk(
    "staff/verifyOTP",
    async ({ userId, otp }, thunkAPI) => {
      try {
        console.log("Sending OTP verification:", { userId, otp });
        
        const response = await fetch(`${BASE_URL}/otp/verify`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ userId, otp }),
        });
  
        const data = await response.json();
        console.log("Server response:", data);
        
        if (!response.ok) {
          throw new Error(data.message || "OTP verification failed");
        }
  
        return data;
      } catch (error) {
        console.log("OTP Error:", error);
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
);

const otpSlice = createSlice({
  name: "otp",
  initialState: { 
    loading: false, 
    error: null, 
    success: false, 
    message: null 
  },
  reducers: {
    clearOtpErrors: (state) => {
      state.error = null;
    },
    clearOtpMessage: (state) => {
      state.message = null;
    },
    resetOtpState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to send OTP";
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "OTP verification failed";
        state.success = false;
      });
  },
});

export const { clearOtpErrors, clearOtpMessage, resetOtpState } = otpSlice.actions;

export default otpSlice.reducer;