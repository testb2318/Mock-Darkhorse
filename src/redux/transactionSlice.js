
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
// ASYNC THUNKS (using api axiosInstance)
// ========================================

export const getTransaction = createAsyncThunk(
  "transaction/getTransaction",
  async ({ table_name }, thunkAPI) => {
    try {
      // Your fetch was: body: JSON.stringify(table_name)
      // So backend likely expects raw string/object same as you were sending.
      const res = await api.post("/tr/list", table_name);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to fetch transactions"),
      });
    }
  }
);

export const getTransactionById = createAsyncThunk(
  "staff/getTransactionById",
  async ({ table_name, user_id }, thunkAPI) => {
    try {
      console.log(table_name, user_id);

      const res = await api.post(`/tr/tr/${user_id}`, { table_name });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to fetch transaction by id"),
      });
    }
  }
);

export const fetchTransactionSummary = createAsyncThunk(
  "transactionSummary/fetch",
  async (month = null, thunkAPI) => {
    try {
      const url = month
        ? `/tr/matrix?month=${month}`
        : "/tr/matrix";

      const res = await api.get(url);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to fetch transaction summary")
      );
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (transactionData, thunkAPI) => {
    try {
      const res = await api.post("/tr/create", transactionData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: getErrorMessage(error, "Failed to create transaction") }
      );
    }
  }
);

export const getTransactions = createAsyncThunk(
  "transactions/getTransactions",
  async (params, thunkAPI) => {
    const {
      page = 1,
      limit = 10,
      transaction_type,
      source,
      status,
      search,
    } = params || {};

    try {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page);
      if (limit) queryParams.append("limit", limit);
      if (transaction_type)
        queryParams.append("transaction_type", transaction_type);
      if (source) queryParams.append("source", source);
      if (status) queryParams.append("status", status);
      if (search) queryParams.append("search", search);

      const res = await api.get(`/tr/all?${queryParams.toString()}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: getErrorMessage(error, "Failed to fetch transactions") }
      );
    }
  }
);

export const getUserTransactions = createAsyncThunk(
  "transactions/getUserTransactions",
  async (params, thunkAPI) => {
    const {
      user_id,
      page = 1,
      limit = 10,
      transaction_type,
      source,
      status,
      search,
    } = params || {};

    try {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page);
      if (limit) queryParams.append("limit", limit);
      if (transaction_type)
        queryParams.append("transaction_type", transaction_type);
      if (source) queryParams.append("source", source);
      if (status) queryParams.append("status", status);
      if (search) queryParams.append("search", search);

      const res = await api.get(
        `/tr/user/${user_id}?${queryParams.toString()}`
      );

      console.log(res.data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: getErrorMessage(error, "Failed to fetch user transactions") }
      );
    }
  }
);

export const getUserDetailsWithTransactions = createAsyncThunk(
  "transactions/getUserDetailsWithTransactions",
  async (user_id, thunkAPI) => {
    try {
      const res = await api.get(`/transactions/user/${user_id}/details`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: getErrorMessage(error, "Failed to fetch user details") }
      );
    }
  }
);

export const updateTransactionStatus = createAsyncThunk(
  "transactions/updateTransactionStatus",
  async ({ transaction_id, status }, thunkAPI) => {
    try {
      const res = await api.patch(`/transactions/${transaction_id}`, {
        status,
      });
      return { transaction_id, status, message: res.data?.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: getErrorMessage(error, "Failed to update transaction status") }
      );
    }
  }
);

// ========================================
// INITIAL STATE
// ========================================

const initialState = {
  transaction: null,
  alltransaction: null,
  transactions: [],
  userTransactions: [],
  summary: [],
  userDetails: null,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  success: false,
  message: null,
};

// ========================================
// SLICE
// ========================================

const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    resetTransactionState: (state) => {
      state.success = false;
      state.error = null;
      state.message = "";
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.userTransactions = [];
      state.totalPages = 0;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET TRANSACTION BY ID
      .addCase(getTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.transaction = action.payload.transaction;
      })
      .addCase(getTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // GET TRANSACTION LIST
      .addCase(getTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.alltransaction = action.payload.alltransaction;
      })
      .addCase(getTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // CREATE TRANSACTION
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create transaction";
      })

      // GET ALL TRANSACTIONS
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch transactions";
      })

      // GET USER TRANSACTIONS
      .addCase(getUserTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.userTransactions = action.payload.transactions;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch user transactions";
      })

      // GET USER DETAILS WITH TRANSACTIONS
      .addCase(getUserDetailsWithTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetailsWithTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload.user;
        state.userTransactions = action.payload.transactions;
      })
      .addCase(getUserDetailsWithTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user details";
      })

      // UPDATE TRANSACTION STATUS
      .addCase(updateTransactionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransactionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        const { transaction_id, status } = action.payload;

        if (state.transactions.length > 0) {
          const idx = state.transactions.findIndex(
            (t) => t.transaction_id === transaction_id
          );
          if (idx !== -1) state.transactions[idx].status = status;
        }

        if (state.userTransactions.length > 0) {
          const idx = state.userTransactions.findIndex(
            (t) => t.transaction_id === transaction_id
          );
          if (idx !== -1) state.userTransactions[idx].status = status;
        }
      })
      .addCase(updateTransactionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update transaction status";
      })

      // TRANSACTION SUMMARY
      .addCase(fetchTransactionSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data;
      })
      .addCase(fetchTransactionSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch transaction summary";
      });
  },
});

export const {
  clearErrors,
  clearMessage,
  resetTransactionState,
  clearTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;