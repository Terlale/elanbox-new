import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./authButton.module.scss";

const AuthButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className={styles.authBtn}
      onClick={() => navigate("/login")}
    >
      Daxil ol
    </button>
  );
};

export default AuthButton;
