import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProfileThunk } from "../redux/thunks/authThunks";

const PrivateRoute = () => {
  const { isAuth, loading } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuth) {
      dispatch(getProfileThunk());
    }
  }, [isAuth, dispatch]);

  if (loading) {
    return <div style={{ padding: 40 }}>Yüklənir...</div>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
