import React from "react";
import { useSelector } from "react-redux";
import styles from "./avatar.module.scss";

const Avatar = ({ size = 36 }) => {
  const user = useSelector((state) => state.auth.user);
  console.log("Avatar user object: ", user);

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt="User Avatar"
        className={styles.avatarImg}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
      />
    );
  }

  const nameSrc = user?.fullName || user?.firstName || user?.username || user?.email || "";
  const firstLetter = nameSrc ? nameSrc[0].toUpperCase() : "?";

  return (
    <div
      className={styles.avatar}
      style={{ width: size, height: size }}
    >
      {firstLetter}
    </div>
  );
};

export default Avatar;
