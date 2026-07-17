import { useSelector } from "react-redux";
import { Navigate} from "react-router-dom";
import { Layout } from "../admin/layout/Layout";
import { selectAdmin } from "../../redux/authSlice";

export default function AdminPrivateRoute() {
  const admin = useSelector(selectAdmin);
  if (!admin || !admin.role) {
    return <Navigate to="/" replace />;
  }
  return <Layout />;
}
