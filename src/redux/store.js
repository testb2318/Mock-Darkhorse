// store.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./authSlice";
import usersReducer from "./userSlice";
import plansReducer from "./planSlice";
import actplanReducer from "./actplanSlice";
import supportReducer from "./supportSlice";
import withdrawalReducer from "./withdrawalSlice";
import referralReducer from "./referralSlice";
import depositeReducer from "./depositeSlice";
import newsReducer from "./newsSlice";
import topupReducer from "./topupSlice";
import settingsReducer from "./settingsSlice";
import qrReducer from "./qrSlice";
import transactionReducer from "./transactionSlice";
import leadershipReducer from "./leadershipSlice";
import transferReducer from "./transferSlice";
import notificationReducer from "./notificationSlice";
import otpReducer from "./otpSlice";
import achivesReducer from "./achiversSlice";
import forgotReducer from "./forgotSlice";
import ctoReducer from "./ctoSlice";
import codeReducer from "./codes";
import rewardReducer from "./rewardSlice";
import salaryReducer from "./salarySlice";
import tradeReducer from "./tradeSlice";
import ticketReducer from "./ticketSlice";
import rewardTransactionReducer from "./rewardTransaction";


// ✅ Persist config — the entire auth slice is persisted
// This includes: auth (user), admin, userToken, adminToken, expireAt, adminExpireAt
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["auth", "admin", "userToken", "adminToken", "expireAt", "adminExpireAt"], // ✅ Explicit fields
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer), // ✅ Persist only auth slice
  users: usersReducer,
  plans: plansReducer,
  allactplans: actplanReducer,
  allsupport: supportReducer,
  allwithdrawal: withdrawalReducer,
  referralTree: referralReducer,
  alldeposite: depositeReducer,
  allnews: newsReducer,
  alltopup: topupReducer,
  settings: settingsReducer,
  qr: qrReducer,
  transaction: transactionReducer,
  allleadership: leadershipReducer,
  transfer: transferReducer,
  notifications: notificationReducer,
  otp: otpReducer,
  achivers: achivesReducer,
  forgot: forgotReducer,
  cto: ctoReducer,
  codes: codeReducer,
  rewards: rewardReducer,
  salary: salaryReducer,
  trade: tradeReducer,
  tickets: ticketReducer,
  rewardTransaction: rewardTransactionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ Ignore redux-persist actions to avoid warnings
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/PURGE"],
      },
    }),
});

export const persistor = persistStore(store);