// // useUsers.js
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import {
//   getAllUsers,
//   getAllNonUsers,
//   getAllRewards,
//   getUser,
//   getUserbyemail,
//   deleteUsers,
//   updateUsers,
//   rewardNotification,
//   defaulterNotification,
//   clearErrors,
//   clearMessage,
// } from "../redux/userSlice";

// export const useUsers = () => {
//   const dispatch = useDispatch();
//   const {
//     users,
//     allnonusers,
//     allrewards,
//     singleuser,
//     emailuser,
//     userrewardnotification,
//     loading,
//     error,
//     message,
//   } = useSelector((state) => state.users);

//   console.log("hook",users)
//   // Actions
//   const fetchAllUsers = (page = 1) => dispatch(getAllUsers(page));
//   const fetchNonUsers = () => dispatch(getAllNonUsers());
//   const fetchRewards = () => dispatch(getAllRewards());
//   const fetchUser = (id) => dispatch(getUser(id));
//   const fetchUserByEmail = (email) => dispatch(getUserbyemail(email));
//   const removeUser = (id) => dispatch(deleteUsers(id));
//   const editUser = (id, updatedData) =>
//     dispatch(updateUsers({ id, updatedData }));
//   const sendRewardNotification = (data) => dispatch(rewardNotification(data));
//   const fetchDefaulterNotification = (id) =>
//     dispatch(defaulterNotification(id));

//   const resetError = () => dispatch(clearErrors());
//   const resetMessage = () => dispatch(clearMessage());

//   return {
//     // state
//     users,
//     allnonusers,
//     allrewards,
//     singleuser,
//     emailuser,
//     userrewardnotification,
//     loading,
//     error,
//     message,
//     // actions
//     fetchAllUsers,
//     fetchNonUsers,
//     fetchRewards,
//     fetchUser,
//     fetchUserByEmail,
//     removeUser,
//     editUser,
//     sendRewardNotification,
//     fetchDefaulterNotification,
//     resetError,
//     resetMessage,
//   };
// };
// useUsers.js
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  getAllNonUsers,
  getAllRewards,
  getUser,
  getMyProfile,       // ✅ NEW
  getUserbyemail,
  deleteUsers,
  updateUsers,
  rewardNotification,
  defaulterNotification,
  clearErrors,
  clearMessage,
} from "../redux/userSlice";

export const useUsers = () => {
  const dispatch = useDispatch();
  const {
    users,
    allnonusers,
    allrewards,
    singleuser,
    myprofile,          // ✅ NEW
    emailuser,
    userrewardnotification,
    loading,
    error,
    message,
  } = useSelector((state) => state.users);

  // Actions
  const fetchAllUsers = (page = 1) => dispatch(getAllUsers(page));
  const fetchNonUsers = () => dispatch(getAllNonUsers());
  const fetchRewards = () => dispatch(getAllRewards());
  const fetchUser = (id) => dispatch(getUser(id));           // ✅ Admin only
  const fetchMyProfile = () => dispatch(getMyProfile());     // ✅ Logged-in user ke liye
  const fetchUserByEmail = (email) => dispatch(getUserbyemail(email));
  const removeUser = (id) => dispatch(deleteUsers(id));
  const editUser = (id, updatedData) =>
    dispatch(updateUsers({ id, updatedData }));
  const sendRewardNotification = (data) => dispatch(rewardNotification(data));
  const fetchDefaulterNotification = (id) =>
    dispatch(defaulterNotification(id));

  const resetError = () => dispatch(clearErrors());
  const resetMessage = () => dispatch(clearMessage());

  return {
    // state
    users,
    allnonusers,
    allrewards,
    singleuser,
    myprofile,          // ✅ NEW
    emailuser,
    userrewardnotification,
    loading,
    error,
    message,
    // actions
    fetchAllUsers,
    fetchNonUsers,
    fetchRewards,
    fetchUser,          // ✅ Admin pages ke liye
    fetchMyProfile,     // ✅ User pages ke liye
    fetchUserByEmail,
    removeUser,
    editUser,
    sendRewardNotification,
    fetchDefaulterNotification,
    resetError,
    resetMessage,
  };
};