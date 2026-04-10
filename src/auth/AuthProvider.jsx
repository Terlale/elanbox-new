import { useEffect, useState } from "react";
import { decodeJWT } from "../utils/decodeJWT";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromToken = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setUser(decodeJWT(token));
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth: !!user,
        isAdmin: user?.authorities?.includes("ROLE_ADMIN"),
        refreshAuth: loadUserFromToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
