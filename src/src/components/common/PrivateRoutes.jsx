import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectUser } from "../../redux/authSlice";
import UserLayout from "../user/layout/UserLayout";

export default function PrivateRoute() {
  const user = useSelector(selectUser);

  if (!user || !user.role) {
    return <Navigate to="/" replace />;
  }
  return <UserLayout />;
}
