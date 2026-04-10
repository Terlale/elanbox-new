import React from "react";
import { FaCheckDouble, FaCheck, FaTrash } from "react-icons/fa";
import styles from "../messages.module.scss";
import Avatar from "./Avatar";

const MessageBubble = ({ msg, isOwn, otherUserAvatar, otherUserName, formatTime, onDelete, deletingId }) => {
    return (
        <div className={`${styles.msgRow} ${isOwn ? styles.own : ""}`}>
            {!isOwn && (
                <div className={styles.msgAvatar}>
                    <Avatar
                        src={otherUserAvatar}
                        name={otherUserName}
                        size="xs"
                    />
                </div>
            )}

            <div className={styles.msgGroup}>
                <div className={styles.msgBubble}>
                    <p>{msg.content}</p>
                </div>
                <div className={styles.msgMeta}>
                    <span className={styles.msgTime}>
                        {formatTime(msg.createdAt)}
                    </span>
                    {isOwn && (
                        <span className={styles.msgStatus}>
                            {msg.isRead ? (
                                <FaCheckDouble
                                    size={11}
                                    style={{ color: "#60a5fa" }}
                                />
                            ) : (
                                <FaCheck
                                    size={11}
                                    style={{ color: "#94a3b8" }}
                                />
                            )}
                        </span>
                    )}
                    {isOwn && (
                        <button
                            className={styles.deleteBtn}
                            onClick={() => onDelete(msg.id)}
                            disabled={deletingId === msg.id}
                            title="Sil"
                        >
                            <FaTrash size={10} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
