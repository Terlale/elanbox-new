import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchMessages,
    sendMessage,
    sendDirectMessage,
    fetchConversations,
    markMessageAsRead,
    deleteMessage,
} from "../../redux/thunks/messageThunks";
import { clearMessages } from "../../redux/slices/messageSlice";

import ChatLayout from "./components/ChatLayout";
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";

const TZ = "Asia/Baku";

const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("az-AZ", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: TZ,
    });
};

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const opts = { timeZone: TZ };

    const todayStr = new Date().toLocaleDateString("az-AZ", opts);
    const dStr = d.toLocaleDateString("az-AZ", opts);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("az-AZ", opts);

    if (dStr === todayStr) return "Bugün";
    if (dStr === yesterdayStr) return "Dünən";
    return d.toLocaleDateString("az-AZ", { day: "2-digit", month: "long", timeZone: TZ });
};

const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach((msg) => {
        const msgDate = msg.createdAt ? new Date(msg.createdAt).toDateString() : "Unknown";
        if (msgDate !== currentDate) {
            if (currentGroup.length > 0) {
                groups.push({ date: currentDate, messages: currentGroup });
            }
            currentDate = msgDate;
            currentGroup = [msg];
        } else {
            currentGroup.push(msg);
        }
    });

    if (currentGroup.length > 0) {
        groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
};

const Messages = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const { chatList, conversations, loading, messagesLoading, sending } = useSelector((s) => s.messages);

    const [selectedChatId, setSelectedChatId] = useState(null);
    const [selectedListingId, setSelectedListingId] = useState(null);
    const [activeChat, setActiveChat] = useState(null);

    const [activeFilter, setActiveFilter] = useState("all"); 
    const [text, setText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileView, setMobileView] = useState("list"); 
    const [deletingId, setDeletingId] = useState(null);
    const [showActionMenu, setShowActionMenu] = useState(false);

    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const menuRef = useRef(null);

    const filterChats = useCallback((chats) => {
        let filtered = chats.filter((chat) =>
            chat.otherUserName?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (activeFilter === "buy") {
            filtered = filtered.filter(c => (c.listing?.user?.id || c.listing?.userId) !== user?.id);
        } else if (activeFilter === "sell") {
            filtered = filtered.filter(c => (c.listing?.user?.id || c.listing?.userId) === user?.id);
        } else if (activeFilter === "unread") {
            filtered = filtered.filter(c => c.unreadCount > 0);
        }

        filtered.sort((a, b) => {
            const ta = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
            const tb = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
            return tb - ta;
        });

        return filtered;
    }, [searchTerm, activeFilter, user?.id]);

    const displayChats = filterChats(chatList);

    const groupedMessages = groupMessagesByDate(conversations);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowActionMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (user?.id) dispatch(fetchConversations(user.id));
    }, [user?.id, dispatch]);

    useEffect(() => {
        if (selectedChatId && user?.id) {
            dispatch(clearMessages());
            dispatch(fetchMessages({ 
                userId: user.id, 
                otherUserId: selectedChatId,
                listingId: selectedListingId
            }));
        }
    }, [selectedChatId, selectedListingId, user?.id, dispatch]);

    useEffect(() => {
        if (selectedChatId && conversations.length > 0) {
            const unread = conversations.filter(
                (msg) => !msg.isRead && msg.receiver?.id === user?.id
            );
            if (unread.length > 0) {
                unread.forEach((msg) => dispatch(markMessageAsRead(msg.id)));
            }
        }
    }, [conversations, selectedChatId, user?.id, dispatch]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversations]);

    const handleSelectChat = useCallback((chat) => {
        setSelectedChatId(chat.otherUserId);
        setSelectedListingId(chat.listingId || chat.listing?.id || 0);
        setActiveChat(chat);
        setMobileView("chat");
        setTimeout(() => inputRef.current?.focus(), 300);
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() || !selectedChatId || sending || !user?.id) return;

        const payload = {
            senderId: Number(user.id),
            receiverId: Number(selectedChatId),
            content: text.trim(),
        };

        try {
            await dispatch(sendDirectMessage(payload)).unwrap();
            setText("");
            inputRef.current?.focus();
        } catch (err) {
            alert("Mesaj göndərilmədi: " + (err?.message || JSON.stringify(err)));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const handleDelete = async (msgId) => {
        setDeletingId(msgId);
        if (window.confirm("Bu mesajı silmək istədiyinizə əminsiniz?")) {
            await dispatch(deleteMessage(msgId));
        }
        setDeletingId(null);
    };

    const handleBackToList = () => {
        setMobileView("list");
        setSelectedChatId(null);
        setSelectedListingId(null);
        dispatch(clearMessages());
    };

    return (
        <ChatLayout mobileView={mobileView}>
            <ChatSidebar 
                chatList={chatList}
                displayChats={displayChats}
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                selectedChatId={selectedChatId}
                selectedListingId={selectedListingId}
                handleSelectChat={handleSelectChat}
                formatTime={formatTime}
                mobileView={mobileView}
            />

            <ChatWindow 
                selectedChatId={selectedChatId}
                activeChat={activeChat}
                conversations={conversations}
                messagesLoading={messagesLoading}
                text={text}
                setText={setText}
                onSend={handleSend}
                onKeyDown={handleKeyDown}
                onDelete={handleDelete}
                onBackToList={handleBackToList}
                deletingId={deletingId}
                sending={sending}
                scrollRef={scrollRef}
                inputRef={inputRef}
                menuRef={menuRef}
                showActionMenu={showActionMenu}
                setShowActionMenu={setShowActionMenu}
                user={user}
                formatTime={formatTime}
                formatDate={formatDate}
                groupedMessages={groupedMessages}
                mobileView={mobileView}
            />
        </ChatLayout>
    );
};

export default Messages;
