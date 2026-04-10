import React from "react";
import { FaEnvelope, FaSearch } from "react-icons/fa";
import styles from "../messages.module.scss";
import ChatItem from "./ChatItem";

const ChatSidebar = ({ 
    chatList, 
    displayChats, 
    loading, 
    searchTerm, 
    setSearchTerm, 
    activeFilter, 
    setActiveFilter, 
    selectedChatId, 
    selectedListingId, 
    handleSelectChat, 
    formatTime, 
    mobileView 
}) => {
    const unreadTotal = chatList.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

    return (
        <aside className={`${styles.sidebar} ${mobileView === "chat" ? styles.hiddenMobile : ""}`}>
            <div className={styles.sidebarHeader}>
                <div className={styles.sidebarTitle}>
                    <FaEnvelope className={styles.titleIcon} />
                    <h2>Mesajlar</h2>
                </div>
                {unreadTotal > 0 && (
                    <div className={styles.totalBadge}>
                        {unreadTotal}
                    </div>
                )}
            </div>

            <div className={styles.searchWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Söhbət axtar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {}
            <div className={styles.filterBar}>
                {['all', 'buy', 'sell', 'unread'].map((f) => (
                    <button 
                        key={f}
                        className={`${styles.filterBtn} ${activeFilter === f ? styles.activeFilter : ''}`}
                        onClick={() => setActiveFilter(f)}
                    >
                        {f === 'all' ? 'Hamısı' : f === 'buy' ? 'Alış' : f === 'sell' ? 'Satış' : 'Oxunmamış'}
                    </button>
                ))}
            </div>

            <div className={styles.chatList}>
                {loading && chatList.length === 0 ? (
                    <div className={styles.stateBox}>
                        <div className={styles.spinner} />
                        <p>Yüklənir...</p>
                    </div>
                ) : displayChats.length === 0 ? (
                    <div className={styles.stateBox}>
                        <FaEnvelope size={36} className={styles.emptyIcon} />
                        <p>
                            {searchTerm || activeFilter !== 'all' ? "Nəticə tapılmadı" : "Hələ söhbət yoxdur"}
                        </p>
                    </div>
                ) : (
                    displayChats.map((chat) => (
                        <ChatItem
                            key={`${chat.otherUserId}_${chat.listingId || chat.listing?.id || 0}`}
                            chat={chat}
                            isSelected={selectedChatId === chat.otherUserId && String(selectedListingId) === String(chat.listingId || chat.listing?.id || 0)}
                            onClick={handleSelectChat}
                            formatTime={formatTime}
                        />
                    ))
                )}
            </div>
        </aside>
    );
};

export default ChatSidebar;
