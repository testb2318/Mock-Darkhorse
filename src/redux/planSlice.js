import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// ✅ Create Thunks with Axios
export const addPlan = createAsyncThunk("plans/add", async (values, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post("/plans/add", values);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

export const addActiveLevel = createAsyncThunk("plans/addActiveLevel", async (values, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post("/plans/addactivelevel", values);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

export const addInvestLevel = createAsyncThunk("plans/addInvestLevel", async (values, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post("/plans/addinvestlevel", values);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

export const getAllPlans = createAsyncThunk("plans/getAll", async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get("/plans/list");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

export const getPlan = createAsyncThunk("plans/getOne", async (id, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get(`/plans/${id}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

export const deletePlan = createAsyncThunk("plans/delete", async (id, thunkAPI) => {
  try {
    const { data } = await axiosInstance.delete(`/plans/${id}`);
    return { Id: id, message: data.message };
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

export const updatePlan = createAsyncThunk("plans/update", async ({ id, updatedData }, thunkAPI) => {
  try {
    const { data } = await axiosInstance.put(`/plans/${id}`, updatedData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

// ✅ Slice
const planSlice = createSlice({
  name: "plans",
  initialState: {
    plans: null,
    singleplan: null,
    loading: false,
    error: null,
    message: null,
  },
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
      .addCase(getAllPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload.allplans;
      })
      .addCase(getAllPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.singleplan = action.payload.singleplan;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.allplans = state.allplans.filter((p) => p.id !== action.payload.Id);
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(addPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(addActiveLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(addInvestLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      });
  },
});

export const { clearErrors, clearMessage } = planSlice.actions;
export default planSlice.reducer;
