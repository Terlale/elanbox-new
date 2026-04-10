import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./forgotPassword.module.scss";
import Logo from "../../../assets/images/logo-elanbox.png";
import {
  forgotPasswordThunk,
  verifyOtpThunk,
  resetPasswordThunk,
} from "../../../redux/thunks/authThunks";
import { resetForgotPasswordState } from "../../../redux/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading,
    forgotPasswordSuccess,
    forgotPasswordError,
    verifyOtpSuccess,
    resetPasswordSuccess,
    resetToken,
    error: generalError,
  } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [frontendErrors, setFrontendErrors] = useState({});
  
  const otpRefs = useRef([]);

  useEffect(() => {
    return () => {
      dispatch(resetForgotPasswordState());
    };
  }, [dispatch]);

  // Handle Step Transitions
  useEffect(() => {
    if (forgotPasswordSuccess && step === 1) {
      setStep(2);
    }
  }, [forgotPasswordSuccess, step]);

  useEffect(() => {
    if (verifyOtpSuccess && step === 2) {
      setStep(3);
    }
  }, [verifyOtpSuccess, step]);

  useEffect(() => {
    if (resetPasswordSuccess) {
      alert("Şifrəniz uğurla yeniləndi!");
      navigate("/login");
    }
  }, [resetPasswordSuccess, navigate]);

  const validateStep = () => {
    const errs = {};
    if (step === 1 && !username.trim()) errs.username = "Email daxil edilməlidir";
    if (step === 2 && otp.join("").length < 6) errs.otp = "6 rəqəmli kodu tam daxil edin";
    if (step === 3) {
      if (!passwordRegex.test(password)) {
        errs.password = "Şifrə min. 8 simvol, böyük/kiçik hərf, rəqəm və simvol içərməlidir";
      }
      if (password !== repeatPassword) {
        errs.repeatPassword = "Şifrələr uyğun gəlmir";
      }
    }
    setFrontendErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next
    if (element.value !== "" && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (step === 1) {
      dispatch(forgotPasswordThunk(username.trim()));
    } else if (step === 2) {
      dispatch(verifyOtpThunk({ username, otp: otp.join("") }));
    } else if (step === 3) {
      dispatch(
        resetPasswordThunk({
          token: resetToken,
          updatePassword: password,
          repeatPassword: repeatPassword,
        })
      );
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.left}>
        <img src={Logo} alt="logo" />
        <div>
          <h1>
            Password <br />
            <span className={styles.bold}>Recovery</span>
          </h1>
          <p>
            Hesabınızı bərpa etmək üçün e-mail ünvanınızı daxil edin və təhlükəsiz şifrə yeniləmə mərhələlərini izləyin.
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <img src={Logo} alt="logo" />
        <h2>Şifrənin Bərpası</h2>

        {(forgotPasswordError || generalError) && (
          <div className={styles.inputError} style={{ marginBottom: "15px", textAlign: "center", color: "#e53935", fontWeight: "500" }}>
            {forgotPasswordError || generalError}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          {step === 1 && (
            <div className={styles.inputRow}>
              <label>Email Ünvanı</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nümunə@elanbox.az"
                className={`${styles.mainInput} ${frontendErrors.username || forgotPasswordError ? styles.errorInput : ""}`}
              />
              {frontendErrors.username && <small className={styles.inputError}>{frontendErrors.username}</small>}
              <button className={styles.loginBtn} disabled={isLoading} type="submit" style={{ marginTop: "25px" }}>
                {isLoading ? "Göndərilir..." : "OTP kodu göndər"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className={styles.inputRow}>
              <div className={styles.infoBox}>
                OTP kodu <b>{username}</b> ünvanına göndərildi. Lütfən 6 rəqəmli kodu daxil edin.
              </div>
              <label>Təsdiq Kodu</label>
              <div className={styles.otpContainer}>
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    ref={(el) => (otpRefs.current[index] = el)}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className={`${styles.otpBox} ${frontendErrors.otp || generalError ? styles.errorInput : ""}`}
                  />
                ))}
              </div>
              {frontendErrors.otp && <small className={styles.inputError}>{frontendErrors.otp}</small>}
              <button className={styles.loginBtn} disabled={isLoading} type="submit" style={{ marginTop: "20px" }}>
                {isLoading ? "Yoxlanılır..." : "Kodu Təsdiqlə"}
              </button>
            </div>
          )}

          {step === 3 && (
            <>
              <div className={styles.successBox}>
                Kod təsdiqləndi. Yeni şifrənizi təyin edin.
              </div>

              <div className={styles.passwordBox}>
                <label>Yeni Şifrə</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={frontendErrors.password ? styles.errorInput : ""}
                    placeholder="••••••••"
                  />
                  <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {frontendErrors.password && <small className={styles.inputError}>{frontendErrors.password}</small>}
              </div>

              <div className={styles.passwordBox}>
                <label>Şifrənin Təkrarı</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showRepeatPassword ? "text" : "password"}
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className={frontendErrors.repeatPassword ? styles.errorInput : ""}
                    placeholder="••••••••"
                  />
                  <span className={styles.eyeIcon} onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                    {showRepeatPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {frontendErrors.repeatPassword && <small className={styles.inputError}>{frontendErrors.repeatPassword}</small>}
              </div>

              <button className={styles.loginBtn} disabled={isLoading} type="submit" style={{ marginTop: "10px" }}>
                {isLoading ? "Yadda saxlanılır..." : "Şifrəni Yenilə"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
