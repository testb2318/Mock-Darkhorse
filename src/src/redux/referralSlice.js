// // usersSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



// export const getReferralTree = createAsyncThunk(
//   "staff/getReferralTree",
//   async (referral_code, thunkAPI) => {
//     try {
//       const response = await fetch(`https://api.Mock.ceo/api/v1/referral/list/${referral_code}`);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue({ error: error.message });
//     }
//   }
// );
// export const getTreeData = createAsyncThunk(
//   "staff/getTreeData",
//   async (referral_code, thunkAPI) => {
//     try {
//       const response = await fetch(`https://api.Mock.ceo/api/v1/referral/full/${referral_code}`);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue({ error: error.message });
//     }
//   }
// );

// const initialState = {
//   referralTree:null,
//   treeData:null,
//   loading: false,
//   error: null,
//   message: null,
// };

// const referralSlice = createSlice({
//   name: "allreferral",
//   initialState,
//   reducers: {
//     clearErrors: (state) => {
//       state.error = null;
//     },
//     clearMessage: (state) => {
//       state.message = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getReferralTree.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getReferralTree.fulfilled, (state, action) => {
//         state.loading = false;
//         state.error = null;
//         state.referralTree = action.payload.referralTree;
//       })
//       .addCase(getReferralTree.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload.error;
//       })
//       .addCase(getTreeData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getTreeData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.error = null;
//         state.treeData = action.payload.treeData;
//       })
//       .addCase(getTreeData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload.error;
//       })
//   },
// });

// export const { clearErrors, clearMessage } = referralSlice.actions;

// export default referralSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

const getErrorMessage = (error, fallback = "Request failed") => {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  return error?.message || fallback;
};

export const getReferralTree = createAsyncThunk(
  "staff/getReferralTree",
  async (referral_code, thunkAPI) => {
    try {
      const res = await api.get(`/referral/list/${referral_code}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to fetch referral tree"),
      });
    }
  }
);

export const getTreeData = createAsyncThunk(
  "staff/getTreeData",
  async (referral_code, thunkAPI) => {
    try {
      const res = await api.get(`/referral/full/${referral_code}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        error: getErrorMessage(error, "Failed to fetch tree data"),
      });
    }
  }
);

const initialState = {
  referralTree: null,
  treeData: null,
  loading: false,
  error: null,
  message: null,
};

const referralSlice = createSlice({
  name: "allreferral",
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
      .addCase(getReferralTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReferralTree.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.referralTree = action.payload.referralTree;
      })
      .addCase(getReferralTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      .addCase(getTreeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTreeData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.treeData = action.payload.treeData;
      })
      .addCase(getTreeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });
  },
});

export const { clearErrors, clearMessage } = referralSlice.actions;
export default referralSlice.reducer;