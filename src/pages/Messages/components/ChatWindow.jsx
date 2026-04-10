import React from "react";
import { useNavigate } from "react-router-dom";
import { 
    FaArrowLeft, 
    FaEllipsisV, 
    FaBan, 
    FaExclamationTriangle, 
    FaTimesCircle, 
    FaSmile,
    FaEnvelope
} from "react-icons/fa";
import styles from "../messages.module.scss";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import Avatar from "./Avatar";

const ChatWindow = ({
    selectedChatId,
    activeChat,
    conversations,
    messagesLoading,
    text,
    setText,
    onSend,
    onKeyDown,
    onDelete,
    onBackToList,
    deletingId,
    sending,
    scrollRef,
    inputRef,
    menuRef,
    showActionMenu,
    setShowActionMenu,
    user,
    formatTime,
    formatDate,
    groupedMessages,
    mobileView
}) => {
    const navigate = useNavigate();

    return (
        <main className={`${styles.chatWindow} ${mobileView === "list" && !selectedChatId ? styles.hiddenMobileChat : ""}`}>
            {selectedChatId ? (
                <>
                    {}
                    <div className={styles.chatHeader}>
                        <button
                            className={styles.backBtn}
                            onClick={onBackToList}
                            title="Geri"
                        >
                            <FaArrowLeft />
                        </button>
                        
                            <div 
                                className={styles.headerContext}
                                onClick={() => activeChat?.otherUserId && navigate(`/users/${activeChat.otherUserId}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <Avatar
                                    src={activeChat?.otherUserAvatar}
                                    name={activeChat?.otherUserName || activeChat?.fullName || activeChat?.user?.fullName}
                                    size="sm"
                                />
                                <div className={styles.headerListingInfo}>
                                    <h3 className={styles.listingHeaderTitle}>
                                        {activeChat?.otherUserName || activeChat?.fullName || activeChat?.user?.fullName || "İstifadəçi"}
                                    </h3>
                                    <div className={styles.statusWrapper}>
                                        <span className={`${styles.statusIndicator} ${activeChat?.isOnline ? styles.online : styles.offline}`} />
                                        <span className={`${styles.statusText} ${activeChat?.isOnline ? styles.online : styles.offline}`}>
                                            {activeChat?.isOnline ? "Onlayn" : "Oflayn"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        <div className={styles.headerActions} ref={menuRef}>
                            <button 
                                className={styles.menuToggleBtn} 
                                onClick={() => setShowActionMenu(!showActionMenu)}
                                title="Əməliyyatlar"
                            >
                                <FaEllipsisV />
                            </button>

                            {showActionMenu && (
                                <div className={styles.actionDropdown}>
                                    <button 
                                        className={styles.dropdownItem} 
                                        onClick={() => {
                                            alert("İstifadəçi bloklandı");
                                            setShowActionMenu(false);
                                        }}
                                    >
                                        <FaBan className={styles.menuIcon} />
                                        Blokla
                                    </button>
                                    <button 
                                        className={styles.dropdownItem} 
                                        onClick={() => {
                                            alert("Şikayət göndərildi");
                                            setShowActionMenu(false);
                                        }}
                                    >
                                        <FaExclamationTriangle className={styles.menuIcon} />
                                        Şikayət et
                                    </button>
                                    <hr className={styles.menuDivider} />
                                    <button 
                                        className={`${styles.dropdownItem} ${styles.closeItem}`}
                                        onClick={() => {
                                            onBackToList();
                                            setShowActionMenu(false);
                                        }}
                                    >
                                        <FaTimesCircle className={styles.menuIcon} />
                                        Söhbəti bağla
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {}
                    <div className={styles.messagesArea} ref={scrollRef}>
                        {messagesLoading ? (
                            <div className={styles.chatStateBox}>
                                <div className={styles.spinner} />
                                <p>Mesajlar yüklənir...</p>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className={styles.chatStateBox}>
                                <FaSmile size={40} className={styles.emptyIcon} />
                                <p>Söhbətə başlayın! İlk mesajı siz göndərin.</p>
                            </div>
                        ) : (
                            groupedMessages.map((group) => (
                                <div key={group.date}>
                                    <div className={styles.dateSep}>
                                        <span>
                                            {formatDate(group.messages[0]?.createdAt)}
                                        </span>
                                    </div>
                                    {group.messages.map((msg) => (
                                        <MessageBubble
                                            key={msg.id}
                                            msg={msg}
                                            isOwn={msg.sender?.id === user?.id}
                                            otherUserAvatar={activeChat?.otherUserAvatar}
                                            otherUserName={activeChat?.otherUserName}
                                            formatTime={formatTime}
                                            onDelete={onDelete}
                                            deletingId={deletingId}
                                        />
                                    ))}
                                </div>
                            ))
                        )}
                    </div>

                    <MessageInput
                        text={text}
                        setText={setText}
                        onSend={onSend}
                        onKeyDown={onKeyDown}
                        sending={sending}
                        inputRef={inputRef}
                    />
                </>
            ) : (
                <div className={styles.placeholder}>
                    <div className={styles.placeholderArt}>
                        <div className={styles.placeholderCircle}>
                            <FaEnvelope size={48} />
                        </div>
                        <div className={styles.placeholderDot1} />
                        <div className={styles.placeholderDot2} />
                        <div className={styles.placeholderDot3} />
                    </div>
                    <h2>Mesajlarınız</h2>
                    <p style={{ maxWidth: "300px", margin: "10px auto" }}>
                        Maraqlandığınız elana daxil olaraq satıcı ilə əlaqə saxlaya bilərsiniz.
                    </p>
                    <a href="/" className={styles.homeLink}>Ana səhifəyə get</a>
                </div>
            )}
        </main>
    );
};

export default ChatWindow;
