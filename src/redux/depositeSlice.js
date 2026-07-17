
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

export const addDeposite = createAsyncThunk(
  "user/addDeposite",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/deposite/add", formData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to add deposit"),
      });
    }
  }
);

export const getAllDeposite = createAsyncThunk(
  "staff/getAllDeposite",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/deposite/list");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to fetch deposits"),
      });
    }
  }
);

// ✅ FIXED: /deposite/by/${user_id} → /deposite/my (token se ID lega backend)
export const getAllDepositeByid = createAsyncThunk(
  "staff/getAllDepositeByid",
  async (_, thunkAPI) => {
    try {
      const res = await api.get(`/deposite/my`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to fetch user deposits"),
      });
    }
  }
);

export const deleteDeposite = createAsyncThunk(
  "staff/deleteDeposite",
  async (id, thunkAPI) => {
    try {
      const res = await api.delete(`/deposite/${id}`);
      return { Id: id, message: res.data?.message };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to delete deposit"),
      });
    }
  }
);

export const updateDeposite = createAsyncThunk(
  "student/updateDeposite",
  async ({ id, status, amount, user_id }, thunkAPI) => {
    try {
      const res = await api.put(`/deposite/${id}`, {
        status,
        amount,
        user_id,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to update deposit"),
      });
    }
  }
);

// ========================================
// INITIAL STATE
// ========================================

const initialState = {
  alldeposite: null,
  singleDeposite: null,
  loading: false,
  error: null,
  message: null,
};

// ========================================
// SLICE
// ========================================

const depositeSlice = createSlice({
  name: "alldeposite",
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
      // LIST ALL
      .addCase(getAllDeposite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDeposite.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.alldeposite = action.payload.alldeposite;
      })
      .addCase(getAllDeposite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // LIST BY USER
      .addCase(getAllDepositeByid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDepositeByid.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singleDeposite = action.payload.singleDeposite;
      })
      .addCase(getAllDepositeByid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // DELETE
      .addCase(deleteDeposite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeposite.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.alldeposite = state.alldeposite?.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deleteDeposite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // UPDATE
      .addCase(updateDeposite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeposite.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateDeposite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // ADD
      .addCase(addDeposite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDeposite.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addDeposite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });
  },
});

export const { clearErrors, clearMessage } = depositeSlice.actions;

export default depositeSlice.reducer;