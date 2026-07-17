// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from '../api/axiosInstance';

// // Async thunk to create a new notification
// export const createNotification = createAsyncThunk(
//   'notifications/createNotification',
//   async (notificationData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(` /notifications`, notificationData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
// export const addBanner= createAsyncThunk(
//   'notifications/addBanner',
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(` /notifications/banner`, formData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Async thunk to get all notifications
// export const getAllNotifications = createAsyncThunk(
//   'notifications/getAllNotifications',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(` /notifications`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
// export const getHomeNotifications = createAsyncThunk(
//   'notifications/getHomeNotifications',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(` /notifications/home`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Async thunk to get notifications for a specific user
// export const getUserNotifications = createAsyncThunk(
//   'notifications/getUserNotifications',
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(` /notifications/user/${userId}`);
//       return response.data.notifications;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
// export const getBanner = createAsyncThunk(
//   'notifications/getBanner',
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(` /notifications/banner`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Async thunk to mark a notification as seen
// export const markNotificationAsSeen = createAsyncThunk(
//   'notifications/markNotificationAsSeen',
//   async ({ userId, notificationId }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(` /notifications/${notificationId}/seen`, { userId });
//       return { notificationId, message: response.data.message };
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );


// export const deleteNotification = createAsyncThunk(
//   "notifications/deleteNotification",
//   async (id, thunkAPI) => {
//     try {
//       const response = await fetch(` /notifications/delete/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }
//       const data = await response.json();
//       return { Id: id, message: data.message };
//     } catch (error) {
//       // Handle error
//       return thunkAPI.rejectWithValue({ error: error.message });
//     }
//   }
// );
// // Create the notification slice
// const notificationSlice = createSlice({
//   name: 'notifications',
//   initialState: {
//     notifications: [],
//     homenotifications: [],
//     banner: false,
//     loading: false,
//     error: null,
//     message: null,
//   },
//   reducers: {
//     resetState: (state) => {
//       state.error = null;
//       state.message = null;
//       state.notifications = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Handle create notification
//       .addCase(createNotification.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createNotification.fulfilled, (state, action) => {
//         state.loading = false;
//         state.message = 'Notification created successfully!';
//          // Optionally, add the new notification to the state
//       })
//       .addCase(createNotification.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(addBanner.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(addBanner.fulfilled, (state, action) => {
//         state.loading = false;
//         state.message = 'Banner created successfully!';
//          // Optionally, add the new notification to the state
//       })
//       .addCase(addBanner.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Handle get all notifications
//       .addCase(getAllNotifications.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getAllNotifications.fulfilled, (state, action) => {
//         state.loading = false;
//         state.notifications = action.payload.notifications;
//       })
//       .addCase(getAllNotifications.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(getBanner.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getBanner.fulfilled, (state, action) => {
//         state.loading = false;
//         state.banner = action.payload.banner;
//       })
//       .addCase(getBanner.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload.banner;
//       })
//       .addCase(getHomeNotifications.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getHomeNotifications.fulfilled, (state, action) => {
//         state.loading = false;
//         state.homenotifications = action.payload.homenotifications;
//       })
//       .addCase(getHomeNotifications.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Handle get user notifications
//       .addCase(getUserNotifications.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getUserNotifications.fulfilled, (state, action) => {
//         state.loading = false;
//         state.notifications = action.payload;
//       })
//       .addCase(getUserNotifications.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(deleteNotification.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(deleteNotification.fulfilled, (state, action) => {
//         state.loading = false;
//         state.message = 'Notification deleted successfully!';
//       })
//       .addCase(deleteNotification.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Handle mark notification as seen
//       .addCase(markNotificationAsSeen.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(markNotificationAsSeen.fulfilled, (state, action) => {
//         state.loading = false;
//         const { notificationId } = action.payload;
//         const notification = state.notifications.find((n) => n.id === notificationId);
//         if (notification) {
//           notification.seen = true; // Update the notification's seen status
//           notification.seen_at = new Date(); // Optionally, set the seen_at timestamp
//         }
//       })
//       .addCase(markNotificationAsSeen.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // Export the actions and reducer
// export const { resetState } = notificationSlice.actions;
// export default notificationSlice.reducer;




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axiosInstance';

// Async thunk to create a new notification
export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/notifications`, notificationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const addBanner = createAsyncThunk(
//   'notifications/addBanner',
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`/notifications/banner`, formData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// Async thunk to get all notifications
export const addBanner = createAsyncThunk(
  'notifications/addBanner',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/notifications/banner`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // ✅ FormData ke liye
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const getAllNotifications = createAsyncThunk(
  'notifications/getAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/notifications`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getHomeNotifications = createAsyncThunk(
  'notifications/getHomeNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/notifications/home`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get notifications for a specific user
export const getUserNotifications = createAsyncThunk(
  'notifications/getUserNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/notifications/user/${userId}`);
      return response.data.notifications;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBanner = createAsyncThunk(
  'notifications/getBanner',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/notifications/banner`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to mark a notification as seen
export const markNotificationAsSeen = createAsyncThunk(
  'notifications/markNotificationAsSeen',
  async ({ userId, notificationId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/notifications/${notificationId}/seen`, { userId });
      return { notificationId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`/notifications/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      return { Id: id, message: data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

// Create the notification slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    homenotifications: [],
    banner: false,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.message = null;
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle create notification
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNotification.fulfilled, (state) => {
        state.loading = false;
        state.message = 'Notification created successfully!';
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle add banner
      .addCase(addBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBanner.fulfilled, (state) => {
        state.loading = false;
        state.message = 'Banner created successfully!';
      })
      .addCase(addBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle get all notifications
      .addCase(getAllNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle get banner
      .addCase(getBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banner = action.payload.banner;
      })
      .addCase(getBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle get home notifications
      .addCase(getHomeNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHomeNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.homenotifications = action.payload.homenotifications;
      })
      .addCase(getHomeNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle get user notifications
      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNotification.fulfilled, (state) => {
        state.loading = false;
        state.message = 'Notification deleted successfully!';
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle mark notification as seen
      .addCase(markNotificationAsSeen.pending, (state) => {
        state.loading = true;
      })
      .addCase(markNotificationAsSeen.fulfilled, (state, action) => {
        state.loading = false;
        const { notificationId } = action.payload;
        const notification = state.notifications.find((n) => n.id === notificationId);
        if (notification) {
          notification.seen = true;
          notification.seen_at = new Date();
        }
      })
      .addCase(markNotificationAsSeen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions and reducer
export const { resetState } = notificationSlice.actions;
export default notificationSlice.reducer;