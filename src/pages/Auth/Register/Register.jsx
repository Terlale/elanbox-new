import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../../../redux/thunks/authThunks";
import styles from "./register.module.scss";
import Logo from "../../../assets/images/logo-elanbox.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error: backendGeneralError } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });

  const [frontendErrors, setFrontendErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [errorField, setErrorField] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyMessage, setShowVerifyMessage] = useState(false);

  const isPasswordValid = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()?]).{8,128}$/.test(password);

  const isEmailValid = (email) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

  const isPhoneValid = (phone) => /^\+994\d{9}$/.test(phone);

  const handlePhoneFocus = () => {
    if (!form.phone) setForm({ ...form, phone: "+994" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFrontendErrors({ ...frontendErrors, [e.target.name]: "" });
    setBackendError("");
    setErrorField("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    if (!form.fullName.trim()) errors.fullName = "Ad və Soyad daxil edilməlidir!";
    if (!isEmailValid(form.email)) errors.email = "E-mail formatı düzgün deyil!";
    if (!isPhoneValid(form.phone)) errors.phone = "Telefon formatı düzgün deyil (+994...)!";
    if (!isPasswordValid(form.password))
      errors.password =
        "Şifrədə böyük, kiçik hərf, rəqəm və simvol olmalıdır!";
    if (!form.city.trim()) errors.city = "Şəhər daxil edilməlidir!";

    setFrontendErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const result = await dispatch(registerThunk(form));

      if (result.meta.requestStatus === "fulfilled") {
        setShowVerifyMessage(true);
      } else {
        const msg = result.payload || "Qeydiyyat alınmadı. Yenidən cəhd edin!";
        setBackendError(msg);
        
        // Map backend message to field
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes("email")) setErrorField("email");
        else if (lowerMsg.includes("phone")) setErrorField("phone");
        else if (lowerMsg.includes("name")) setErrorField("fullName");
        else if (lowerMsg.includes("city")) setErrorField("city");
        else if (lowerMsg.includes("password")) setErrorField("password");
      }
    } catch {
      setBackendError("Xəta baş verdi. Yenidən cəhd edin!");
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.left}>
        <img src={Logo} alt="logo" />
        <h1>
          Join Us,
          <br />
          <span className={styles.bold}>Create Account</span>
        </h1>
        <p>Elan yerləşdirin, profilinizi idarə edin və daha çox insana çatın.</p>
      </div>

      <div className={styles.right}>
        <img src={Logo} alt="logo" />
        <h2>Qeydiyyat</h2>

        {backendError && (
          <div className={styles.errorBox} style={{ textAlign: "center", border: "1px solid #e53935", background: "#fff5f5" }}>
            {backendError}
          </div>
        )}

        {showVerifyMessage && (
          <div className={styles.successBox}>
            Qeydiyyat <b>uğurla tamamlandı!</b>
            <br />
            Lütfən e-mail ünvanınızı yoxlayın və hesabınızı təsdiqləyin.
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputRow}>
            <div>
              <label>Ad Soyad</label>
              <input
                name="fullName"
                placeholder="Ad Soyad"
                value={form.fullName}
                onChange={handleChange}
                disabled={showVerifyMessage}
                className={
                  frontendErrors.fullName || errorField === "fullName"
                    ? styles.errorInput
                    : ""
                }
              />
              {(frontendErrors.fullName || errorField === "fullName") && (
                <small className={styles.inputError}>
                  {frontendErrors.fullName || backendError}
                </small>
              )}
            </div>

            <div>
              <label>E-mail</label>
              <input
                name="email"
                placeholder="nümunə@elanbox.az"
                value={form.email}
                onChange={handleChange}
                disabled={showVerifyMessage}
                className={
                  frontendErrors.email || errorField === "email"
                    ? styles.errorInput
                    : ""
                }
              />
              {(frontendErrors.email || errorField === "email") && (
                <small className={styles.inputError}>
                  {frontendErrors.email || (errorField === "email" ? backendError : "")}
                </small>
              )}
            </div>
          </div>

          <div className={styles.inputRow}>
            <div>
              <label>Telefon</label>
              <input
                name="phone"
                placeholder="+994 -- --- -- --"
                value={form.phone}
                onFocus={handlePhoneFocus}
                onChange={handleChange}
                disabled={showVerifyMessage}
                className={
                  frontendErrors.phone || errorField === "phone"
                    ? styles.errorInput
                    : ""
                }
              />
              {(frontendErrors.phone || errorField === "phone") && (
                <small className={styles.inputError}>
                  {frontendErrors.phone || (errorField === "phone" ? backendError : "")}
                </small>
              )}
            </div>

            <div>
              <label>Şəhər</label>
              <input
                name="city"
                placeholder="Məs: Bakı"
                value={form.city}
                onChange={handleChange}
                disabled={showVerifyMessage}
                className={
                  frontendErrors.city || errorField === "city"
                    ? styles.errorInput
                    : ""
                }
              />
              {(frontendErrors.city || errorField === "city") && (
                <small className={styles.inputError}>
                  {frontendErrors.city || (errorField === "city" ? backendError : "")}
                </small>
              )}
            </div>
          </div>

          <div className={styles.passwordBox}>
            <label>Şifrə</label>
            <div className={styles.passwordInput}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                disabled={showVerifyMessage}
                className={
                  frontendErrors.password || errorField === "password"
                    ? styles.errorInput
                    : ""
                }
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {(frontendErrors.password || errorField === "password") && (
              <small className={styles.inputError}>
                {frontendErrors.password || (errorField === "password" ? backendError : "")}
              </small>
            )}
          </div>

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={isLoading || showVerifyMessage}
          >
            {isLoading ? "Gözləyin..." : "Hesab Yarat"}
          </button>

          <p className={styles.footerText}>
            Artıq hesabınız var?
            <span onClick={() => navigate("/login")}> Daxil olun</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
