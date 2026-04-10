import { api } from "../../api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMessages = createAsyncThunk(
    "messages/fetchConversation",
    async ({ userId, otherUserId, listingId }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/messages/conversation/${otherUserId}`, {
                params: {
                    userId,
                    ...(listingId && { listingId })
                }
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Mesajlar yüklənmədi");
        }
    }
);

export const sendMessage = createAsyncThunk(
    "messages/send",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post("/messages", payload);
            return res.data;
        } catch (err) {
            console.error("sendMessage thunk error:", err.response?.data);
            return rejectWithValue(err.response?.data || { message: "Mesaj göndərilmədi" });
        }
    }
);

export const sendDirectMessage = createAsyncThunk(
    "messages/sendDirect",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post("/messages/direct", payload);
            return res.data;
        } catch (err) {
            console.error("sendDirectMessage thunk error:", err.response?.data);
            return rejectWithValue(err.response?.data || { message: "Mesaj göndərilmədi" });
        }
    }
);

export const markMessageAsRead = createAsyncThunk(
    "messages/markAsRead",
    async (id, { rejectWithValue }) => {
        try {
            await api.patch(`/messages/${id}/read`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
        }
    }
);

export const fetchUnreadCount = createAsyncThunk(
    "messages/fetchUnread",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await api.get("/messages/unread", { params: { userId } });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
        }
    }
);

export const fetchConversations = createAsyncThunk(
    "messages/fetchConversations",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await api.get("/messages/conversations", { params: { userId } });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Söhbətlər yüklənmədi");
        }
    }
);

export const deleteMessage = createAsyncThunk(
    "messages/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/messages/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Mesaj silinmədi");
        }
    }
);
