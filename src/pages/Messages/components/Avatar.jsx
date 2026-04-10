import React from "react";
import styles from "../messages.module.scss";

const Avatar = ({ src, name, size = "md" }) => {
    const initials = name
        ? name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0]?.toUpperCase())
            .join("")
        : "?";

    if (src) {
        return (
            <div className={`${styles.avatarWrap} ${styles[`avatar_${size}`]}`}>
                <img src={src} alt={name || "Avatar"} />
            </div>
        );
    }

    return (
        <div className={`${styles.avatarWrap} ${styles[`avatar_${size}`]} ${styles.avatarInitials}`}>
            <span>{initials}</span>
        </div>
    );
};

export default Avatar;
