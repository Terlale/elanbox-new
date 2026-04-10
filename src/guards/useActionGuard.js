import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export const useActionGuard = () => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  const guard = (callback) => {
    if (!isAuth) {
      alert("Siz qeydiyyatdan keçməmisiniz. Zəhmət olmasa login olun.");
      navigate("/login");
      return;
    }

    callback?.();
  };

  return guard;
};
