
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// ================================
// Helpers
// ================================
const getErrorMessage = (error, fallback = "Request failed") => {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  return error?.message || fallback;
};

// ========================================
// ASYNC THUNKS (Axios instance)
// ========================================

export const transfertouser = createAsyncThunk(
  "tra/transfertouser",
  async ({ values }, thunkAPI) => {
    try {
      console.log(values);

      // NOTE: earlier you were sending { values } (nested)
      // Keep same payload to avoid backend breaking:
      const res = await api.post("/transfer/touser", { values });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Transfer to user failed"),
      });
    }
  }
);

export const FriendTopup = createAsyncThunk(
  "tra/FriendTopup",
  async ({ values }, thunkAPI) => {
    try {
      console.log(values);

      // Keep same payload shape: { values }
      const res = await api.post("/transfer/friend", { values });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Friend topup failed"),
      });
    }
  }
);

export const getTransfer = createAsyncThunk(
  "tran/getTransfer",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/transfer/list");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to fetch transfers"),
      });
    }
  }
);

export const getTransferById = createAsyncThunk(
  "tran/getTransferById",
  async (user_id, thunkAPI) => {
    try {
      const res = await api.get(` /transfer/byid/${user_id}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to fetch user transfers"),
      });
    }
  }
);

// ========================================
// INITIAL STATE
// ========================================

const initialState = {
  alltransfer: null,
  transfer: null,
  loading: false,
  error: null,
  message: null,
};

// ========================================
// SLICE
// ========================================

const transferSlice = createSlice({
  name: "transferSlice",
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
      // TRANSFER TO USER
      .addCase(transfertouser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transfertouser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message;
      })
      .addCase(transfertouser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Transfer failed";
      })

      // GET TRANSFERS
      .addCase(getTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.alltransfer = action.payload?.alltransfer;
      })
      .addCase(getTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch transfers";
      })

      // GET TRANSFER BY ID
      .addCase(getTransferById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransferById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.transfer = action.payload?.transfer;
      })
      .addCase(getTransferById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch transfer";
      })

      // FRIEND TOPUP
      .addCase(FriendTopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FriendTopup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message;
      })
      .addCase(FriendTopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Friend topup failed";
      });
  },
});

export const { clearErrors, clearMessage } = transferSlice.actions;

export default transferSlice.reducer;