import { createSlice } from "@reduxjs/toolkit";
import {
    fetchMessages,
    sendMessage,
    sendDirectMessage,
    markMessageAsRead,
    fetchUnreadCount,
    fetchConversations,
    deleteMessage
} from "../thunks/messageThunks";

const initialState = {
    chatList: [],
    conversations: [],
    unreadCount: 0,
    loading: false,
    messagesLoading: false,
    sending: false,
    error: null,
};

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.conversations = [];
        },
    },
    extraReducers: (builder) => {
        builder
            
            .addCase(fetchMessages.pending, (state) => {
                state.messagesLoading = true;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messagesLoading = false;
                state.conversations = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.messagesLoading = false;
                state.error = action.payload;
            })

            .addCase(sendMessage.pending, (state) => {
                state.sending = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.sending = false;
                state.conversations.push(action.payload);
                const otherPartyId = action.payload.receiver?.id;
                const listingId = action.payload.listingId || action.payload.listing?.id;
                const chat = state.chatList.find(c => 
                    c.otherUserId === otherPartyId && 
                    (String(c.listingId) === String(listingId) || String(c.listing?.id) === String(listingId))
                );
                if (chat) {
                    chat.lastMessage = action.payload.content;
                    chat.lastMessageTime = action.payload.createdAt;
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload;
            })

            .addCase(sendDirectMessage.pending, (state) => {
                state.sending = true;
            })
            .addCase(sendDirectMessage.fulfilled, (state, action) => {
                state.sending = false;
                state.conversations.push(action.payload);
                const otherPartyId = action.payload.receiver?.id || action.payload.sender?.id;
                const chat = state.chatList.find(c => c.otherUserId === otherPartyId);
                if (chat) {
                    chat.lastMessage = action.payload.content;
                    chat.lastMessageTime = action.payload.createdAt;
                }
            })
            .addCase(sendDirectMessage.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload;
            })

            .addCase(fetchConversations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.loading = false;
                const map = new Map();
                (action.payload || []).forEach((conv) => {
                    const lId = conv.listingId || conv.listing?.id || 0;
                    const compositeKey = `${conv.otherUserId}_${lId}`;
                    const existing = map.get(compositeKey);
                    if (!existing) {
                        map.set(compositeKey, { ...conv });
                    } else {
                        const existingTime = existing.lastMessageTime ? new Date(existing.lastMessageTime).getTime() : 0;
                        const newTime = conv.lastMessageTime ? new Date(conv.lastMessageTime).getTime() : 0;
                        if (newTime > existingTime) {
                            map.set(compositeKey, { ...conv });
                        }
                        map.get(compositeKey).unreadCount = (existing.unreadCount || 0) + (conv.unreadCount || 0);
                    }
                });
                state.chatList = Array.from(map.values()).sort((a, b) => {
                    const ta = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
                    const tb = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
                    return tb - ta;
                });
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = Array.isArray(action.payload) ? action.payload.length : action.payload;
            })

            .addCase(markMessageAsRead.fulfilled, (state, action) => {
                const msgId = action.payload;
                const msg = state.conversations.find(m => m.id === msgId);
                if (msg) {
                    msg.isRead = true;
                    const otherPartyId = msg.sender?.id;
                    const listingId = msg.listingId || msg.listing?.id;
                    const chat = state.chatList.find(c => 
                        c.otherUserId === otherPartyId && 
                        (String(c.listingId) === String(listingId) || String(c.listing?.id) === String(listingId))
                    );
                    if (chat && chat.unreadCount > 0) chat.unreadCount -= 1;
                }
            })

            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.conversations = state.conversations.filter(m => m.id !== action.payload);
            });
    },
});

export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
