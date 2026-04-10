import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { decodeJWT } from "../utils/decodeJWT";

const AdminRoute = () => {
  const { loading } = useAuth();

  if (loading) return null;

  const token = localStorage.getItem("access_token");
  let isAdmin = false;

  if (token) {
    const decoded = decodeJWT(token);
    if (decoded?.role === "ADMIN" || 
       (Array.isArray(decoded?.roles) && decoded?.roles.includes("ADMIN")) ||
       (Array.isArray(decoded?.role) && decoded?.role.some(r => r.authority === "ADMIN")) ||
       decoded?.role?.authority === "ADMIN") {
      isAdmin = true;
    }
    if (decoded?.sub === "admin@elanbox.az" || decoded?.email === "admin@elanbox.az") {
      isAdmin = true;
    }
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
