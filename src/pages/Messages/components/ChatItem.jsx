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

const ChatItem = ({ chat, isSelected, onClick, formatTime }) => {
    return (
        <button
            className={`${styles.chatItem} ${isSelected ? styles.active : ""}`}
            onClick={() => onClick(chat)}
        >
            <div className={styles.chatItemAvatar}>
                <Avatar
                    src={chat.otherUserAvatar}
                    name={chat.otherUserName}
                    size="md"
                />
                {chat.unreadCount > 0 && (
                    <span className={styles.onlineDot} />
                )}
            </div>
            <div className={styles.chatItemBody}>
                <div className={styles.chatItemTop}>
                    <span className={styles.chatItemName}>
                        {chat.otherUserName || "İstifadəçi"}
                    </span>
                    <span className={styles.chatItemTime}>
                        {formatTime(chat.lastMessageTime)}
                    </span>
                </div>
                {(chat.listingTitle || chat.listing?.title) && (
                    <div className={styles.chatItemListingLabel}>
                        {chat.listingTitle || chat.listing?.title}
                    </div>
                )}
                <div className={styles.chatItemBottom}>
                    <span className={styles.chatItemPreview}>
                        {chat.lastMessage || "Mesaj yoxdur"}
                    </span>
                    {chat.unreadCount > 0 && (
                        <span className={styles.unreadBadge}>
                            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ChatItem;
