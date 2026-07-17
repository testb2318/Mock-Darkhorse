// useAuth.js
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  loginAdmin,
  signupUser,
  signoutuser,
  signoutadmin,
  clearErrors,
  clearMessage,
} from "../redux/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { auth, admin, loading, error, message, expireAt, adminExpireAt } =
    useSelector((state) => state.auth);

  // actions
  const userLogin = (values) => dispatch(loginUser(values));
  const adminLogin = (values) => dispatch(loginAdmin(values));
  const userSignup = (values) => dispatch(signupUser(values));
  const userSignout = () => dispatch(signoutuser());
  const adminSignout = () => dispatch(signoutadmin());

  const resetError = () => dispatch(clearErrors());
  const resetMessage = () => dispatch(clearMessage());

  return {
    // state
    auth,
    admin,
    loading,
    error,
    message,
    expireAt,
    adminExpireAt,
    // actions
    userLogin,
    adminLogin,
    userSignup,
    userSignout,
    adminSignout,
    resetError,
    resetMessage,
  };
};
