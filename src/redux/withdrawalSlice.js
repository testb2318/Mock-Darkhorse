import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const getErrorMessage = (error, fallback = "Request failed") => {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  return error?.message || fallback;
};

export const addWithdrawal = createAsyncThunk(
  "withdrawal/add",
  async ({ values }, thunkAPI) => {
    try {
      const res = await api.post("/withdrawalrequest/add", values);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Withdrawal request failed"));
    }
  }
);

export const addROIWithdrawal = createAsyncThunk(
  "withdrawal/addROI",
  async ({ values }, thunkAPI) => {
    try {
      const res = await api.post("/withdrawalrequest/add/roiwithdrawal", values);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "ROI withdrawal request failed"));
    }
  }
);

export const WithdrawalPrinciple = createAsyncThunk(
  "withdrawal/principle",
  async ({ values }, thunkAPI) => {
    try {
      const res = await api.post("/withdrawalrequest/add/principle", values);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Principle withdrawal request failed"));
    }
  }
);

export const getAllWithdrawal = createAsyncThunk(
  "withdrawal/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/withdrawalrequest/list");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to fetch withdrawals"));
    }
  }
);

export const getAllWithdrawalByid = createAsyncThunk(
  "withdrawal/getById",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/withdrawalrequest/by");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to fetch user withdrawals"));
    }
  }
);

export const deleteWithdrawal = createAsyncThunk(
  "withdrawal/delete",
  async (id, thunkAPI) => {
    try {
      const res = await api.delete(`/withdrawalrequest/${id}`);
      return { Id: id, message: res.data?.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to delete withdrawal"));
    }
  }
);

export const updateWithdrawal = createAsyncThunk(
  "withdrawal/update",
  async ({ id, status, amount, user_id }, thunkAPI) => {
    try {
      const res = await api.put(`/withdrawalrequest/${id}`, { status, amount, user_id });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to update withdrawal"));
    }
  }
);

export const updateROIWithdrawal = createAsyncThunk(
  "withdrawal/updateROI",
  async ({ id, status, amount, user_id }, thunkAPI) => {
    try {
      const res = await api.put(`/withdrawalrequest/update/roi/${id}`, { status, amount, user_id });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to update ROI withdrawal"));
    }
  }
);

export const updatePrincipleWithdrawal = createAsyncThunk(
  "withdrawal/updatePrinciple",
  async ({ id, status, amount, user_id }, thunkAPI) => {
    try {
      const res = await api.put(`/withdrawalrequest/update/principle/${id}`, { status, amount, user_id });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to update principle withdrawal"));
    }
  }
);

export const debitAmount = createAsyncThunk(
  "withdrawal/debit",
  async (values, thunkAPI) => {
    try {
      const res = await api.post("/withdrawalrequest/debit", values);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to debit amount"));
    }
  }
);

// ✅ Upline Transactions — User apni income dekhe
export const getUplineTransactions = createAsyncThunk(
  "withdrawal/getUplineTransactions",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/withdrawalrequest/upline-transactions");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to fetch upline transactions"));
    }
  }
);

// ✅ Upline Transactions — Admin sab dekhe
export const getAllUplineTransactions = createAsyncThunk(
  "withdrawal/getAllUplineTransactions",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/withdrawalrequest/upline-transactions/all");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to fetch all upline transactions"));
    }
  }
);

// ========================================
// INITIAL STATE
// ========================================

const initialState = {
  allwithdrawal: null,
  singleWithdrawal: null,
  uplineTransactions: null,       // ✅ User ki upline income
  allUplineTransactions: null,    // ✅ Admin — sab ki upline income
  loading: false,
  error: null,
  message: null,
  success: false,
};

// ========================================
// SLICE
// ========================================

const withdrawalSlice = createSlice({
  name: "withdrawal",
  initialState,
  reducers: {
    clearErrors: (state) => { state.error = null; },
    clearMessage: (state) => { state.message = null; },
    resetWithdrawalState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllWithdrawal.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.allwithdrawal = action.payload.allwithdrawal;
      })
      .addCase(getAllWithdrawal.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // GET BY ID
      .addCase(getAllWithdrawalByid.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllWithdrawalByid.fulfilled, (state, action) => {
        state.loading = false;
        state.singleWithdrawal = action.payload.singleWithdrawal;
      })
      .addCase(getAllWithdrawalByid.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // DELETE
      .addCase(deleteWithdrawal.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.allwithdrawal = state.allwithdrawal?.filter((u) => u.id !== action.payload.Id);
      })
      .addCase(deleteWithdrawal.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // UPDATE
      .addCase(updateWithdrawal.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateWithdrawal.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(updateWithdrawal.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // DEBIT
      .addCase(debitAmount.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(debitAmount.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(debitAmount.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // ADD WITHDRAWAL
      .addCase(addWithdrawal.pending, (state) => { state.loading = true; state.error = null; state.success = false; state.message = null; })
      .addCase(addWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Withdrawal request submitted successfully";
      })
      .addCase(addWithdrawal.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })

      // ADD ROI WITHDRAWAL
      .addCase(addROIWithdrawal.pending, (state) => { state.loading = true; state.error = null; state.success = false; state.message = null; })
      .addCase(addROIWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "ROI withdrawal request submitted successfully";
      })
      .addCase(addROIWithdrawal.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })

      // ADD PRINCIPLE WITHDRAWAL
      .addCase(WithdrawalPrinciple.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(WithdrawalPrinciple.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(WithdrawalPrinciple.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })

      // UPDATE ROI
      .addCase(updateROIWithdrawal.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateROIWithdrawal.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(updateROIWithdrawal.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // UPDATE PRINCIPLE
      .addCase(updatePrincipleWithdrawal.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updatePrincipleWithdrawal.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(updatePrincipleWithdrawal.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // ✅ GET UPLINE TRANSACTIONS — User
      .addCase(getUplineTransactions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getUplineTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.uplineTransactions = action.payload.uplineTransactions;
      })
      .addCase(getUplineTransactions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // ✅ GET ALL UPLINE TRANSACTIONS — Admin
      .addCase(getAllUplineTransactions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllUplineTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.allUplineTransactions = action.payload.uplineTransactions;
      })
      .addCase(getAllUplineTransactions.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearErrors, clearMessage, resetWithdrawalState } = withdrawalSlice.actions;

export default withdrawalSlice.reducer;