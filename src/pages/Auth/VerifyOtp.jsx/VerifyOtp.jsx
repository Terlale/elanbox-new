import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./verifyOtp.module.scss";
import Logo from "../../../assets/images/logo-elanbox.png";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const username = state?.username;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);
    try {
      await axios.post("/api/v1/users/reset-password", null, {
        params: { username, otp },
      });

      navigate("/login");
    } catch (err) {
      setError("Invalid OTP code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <img src={Logo} alt="logo" />
        <div>
          <h1>Verify<br />OTP</h1>
          <p>Enter the OTP code sent to your email.</p>
        </div>
      </div>

      <div className={styles.right}>
        <img src={Logo} alt="logo" />
        <h2>OTP Verification</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>OTP Code</label>
            <input
              type="number"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button disabled={isLoading}>
            {isLoading ? "Verifying..." : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
