import React, { useState } from "react";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./userButton.module.scss";
import Avatar from "../Avatar/Avatar";

const UserButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.userBtn}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Avatar size={44} />
      </div>

      {open && (
        <div className={styles.dropdown}>
          <button
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}
          >
            <FaCog /> Ayarlar
          </button>

          <button onClick={logout} className={styles.logout}>
            <FaSignOutAlt /> Çıxış
          </button>
        </div>
      )}
    </div>
  );
};

export default UserButton;
