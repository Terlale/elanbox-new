import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../../redux/thunks/authThunks";
import { getProfileThunk } from "../../../redux/thunks/authThunks";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.scss";
import { decodeJWT } from "../../../utils/decodeJWT";
import Logo from "../../../assets/images/logo-elanbox.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../../auth/useAuth";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error: backendError } = useSelector((state) => state.auth);
  const { refreshAuth } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [frontendError, setFrontendError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFrontendError("");

    if (!username.trim() || !password.trim()) {
      setFrontendError("İstifadəçi adı və şifrə daxil edilməlidir");
      return;
    }

    const result = await dispatch(loginThunk({ username, password }));

    if (result.meta.requestStatus !== "fulfilled") return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    refreshAuth();

    await dispatch(getProfileThunk());

    const decoded = decodeJWT(token);
    let isAdmin = false;

    if (decoded?.role === "ADMIN" ||
      (Array.isArray(decoded?.roles) && decoded?.roles.includes("ADMIN")) ||
      (Array.isArray(decoded?.role) && decoded?.role.some(r => r.authority === "ADMIN")) ||
      decoded?.role?.authority === "ADMIN" ||
      decoded?.authorities?.includes("ROLE_ADMIN")) {
      isAdmin = true;
    }

    navigate(isAdmin ? "/admin/dashboard" : "/home");
  };

  const isError = frontendError || backendError;

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.left}>
        <img src={Logo} alt="logo" />
        <div>
          <h1>
            Salam,
            <br />
            Xoş gəldiniz!
          </h1>
          <p>Daxil olun və saniyələr içində hesabınıza giriş edin.</p>
        </div>
      </div>

      <div className={styles.right}>
        <img src={Logo} alt="logo" />
        <h2>Giriş</h2>

        {isError && (
          <div className={styles.inputError} style={{ marginBottom: "15px", textAlign: "center", color: "#e53935", fontWeight: "500" }}>
            {frontendError || backendError}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>İstifadəçi adı və ya E-mail</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="example@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={isError ? styles.errorInput : ""}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Şifrə</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={isError ? styles.errorInput : ""}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className={styles.forgotPassword}>
            <span onClick={() => navigate("/forgot-password")}>
              Şifrəni unutmusunuz?
            </span>
          </div>

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={isLoading}
          >
            {isLoading ? "Giriş edilir..." : "Daxil ol"}
          </button>

          <p className={styles.footerText}>
            Hesabınız yoxdur?
            <span onClick={() => navigate("/register")}> Qeydiyyatdan keçin</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
