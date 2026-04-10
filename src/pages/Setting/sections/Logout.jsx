import { useAuth } from "../../../auth/useAuth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { refreshAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    refreshAuth();
    navigate("/login");
  };

  return (
    <div>
      <h2>Çıxış</h2>
      <button onClick={handleLogout}>Hesabdan çıx</button>
    </div>
  );
};

export default Logout;
