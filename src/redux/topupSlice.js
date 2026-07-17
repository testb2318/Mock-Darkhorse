
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

export const addTopup = createAsyncThunk(
  "staff/addTopup",
  async ({ values }, thunkAPI) => {
    try {
      const res = await api.post("/topup/add", values);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to add topup"),
      });
    }
  }
);

export const entryPlanActivation = createAsyncThunk(
  "staff/entryPlanActivation",
  async ({ id, userby_id }, thunkAPI) => {
    try {
      const res = await api.post("/topup/entry", { id, userby_id });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to activate entry plan"),
      });
    }
  }
);

export const getAllTopup = createAsyncThunk(
  "staff/getAllTopup",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/topup/list");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to fetch topups"),
      });
    }
  }
);

export const getAllTopupByid = createAsyncThunk(
  "staff/getAllTopupByid",
  async (user_id, thunkAPI) => {
    try {
      const res = await api.get(`/topup/by/${user_id}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to fetch user topups"),
      });
    }
  }
);

export const deleteTopup = createAsyncThunk(
  "staff/deleteTopup",
  async (id, thunkAPI) => {
    try {
      const res = await api.delete(`/topup/${id}`);
      return { Id: id, message: res.data?.message };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to delete topup"),
      });
    }
  }
);

export const updateTopup = createAsyncThunk(
  "student/updateTopup",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      console.log(id, updatedData);

      const res = await api.put(`/topup/${id}`, updatedData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to update topup"),
      });
    }
  }
);

export const addReTopup = createAsyncThunk(
  "staff/addReTopup",
  async ({ values }, thunkAPI) => {
    try {
      const res = await api.post("/topup/addretopup", values);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to add re-topup"),
      });
    }
  }
);

// ========================================
// INITIAL STATE
// ========================================

const initialState = {
  alltopup: null,
  singletopup: null,
  loading: false,
  error: null,
  message: null,
};

// ========================================
// SLICE
// ========================================

const topupSlice = createSlice({
  name: "alltopup",
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
      // GET ALL
      .addCase(getAllTopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTopup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.alltopup = action.payload.alltopup;
      })
      .addCase(getAllTopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // GET BY ID
      .addCase(getAllTopupByid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTopupByid.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singletopup = action.payload.singletopup;
      })
      .addCase(getAllTopupByid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // DELETE
      .addCase(deleteTopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTopup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.alltopup = state.alltopup?.filter(
          (u) => u.id !== action.payload.Id
        );
      })
      .addCase(deleteTopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // UPDATE
      .addCase(updateTopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTopup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateTopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // ADD TOPUP
      .addCase(addTopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTopup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addTopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // ADD RE-TOPUP
      .addCase(addReTopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReTopup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addReTopup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      // ENTRY PLAN ACTIVATION
      .addCase(entryPlanActivation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(entryPlanActivation.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(entryPlanActivation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });
  },
});

export const { clearErrors, clearMessage } = topupSlice.actions;

export default topupSlice.reducer;