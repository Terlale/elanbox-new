import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, fetchMessages } from "../../../redux/thunks/messageThunks";
import { clearMessages } from "../../../redux/slices/messageSlice";
import styles from "./quickMessagesModal.module.scss";
import { FaPaperPlane, FaTimes, FaUser } from "react-icons/fa";

const QuickMessagesModal = ({ isOpen, onClose, listing, seller }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const { conversations, sending, loading } = useSelector((s) => s.messages);
    const [text, setText] = useState("");
    const scrollRef = useRef(null);

    useEffect(() => {
        if (isOpen && user?.id && seller?.id) {
            dispatch(fetchMessages({
                userId: user.id,
                otherUserId: seller.id,
                listingId: listing?.id
            }));
        }
        if (!isOpen) {
            dispatch(clearMessages());
            setText("");
        }
    }, [isOpen, dispatch, user?.id, seller?.id, listing?.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversations]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() || sending || !user?.id || !seller?.id) return;

        const payload = {
            senderId: user.id,
            receiverId: seller.id,
            ...(listing?.id && { listingId: Number(listing.id) }),
            content: text.trim(),
        };

        try {
            await dispatch(sendMessage(payload)).unwrap();
            setText("");
        } catch (err) {
            console.error("Mesaj göndərilmədi:", err);
        }
    };

    const canSend = !!(user?.id && seller?.id);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.sellerInfo}>
                        <div className={styles.avatar}>
                            {seller?.avatarUrl ? <img src={seller.avatarUrl} alt="" /> : <FaUser />}
                        </div>
                        <div>
                            <h3>{seller?.fullName || "Satıcı"}</h3>
                            <span>{listing?.title}</span>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.chatArea} ref={scrollRef}>
                    {loading ? (
                        <div className={styles.loading}>Yüklənir...</div>
                    ) : conversations.length === 0 ? (
                        <div className={styles.empty}>Hələ mesaj yoxdur. Söhbətə başlayın!</div>
                    ) : (
                        conversations.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${styles.messageWrap} ${msg.sender?.id === user?.id ? styles.own : ""}`}
                            >
                                <div className={styles.message}>
                                    <p>{msg.content}</p>
                                    <span className={styles.time}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {}
                <div className={styles.quickReplies}>
                    {[
                        "Salam, hələ də aktualdır?",
                        "Salam, mənə maraqlıdır!",
                        "Salam, qiymətdə razılaşa bilərik?"
                    ].map((msg, i) => (
                        <button
                            key={i}
                            className={styles.quickBtn}
                            onClick={() => setText(msg)}
                            type="button"
                        >
                            {msg}
                        </button>
                    ))}
                </div>

                <form className={styles.inputArea} onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="Mesajınızı yazın..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={sending || !canSend}
                    />
                    <button type="submit" disabled={!text.trim() || sending || !canSend}>
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuickMessagesModal;
