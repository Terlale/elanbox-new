import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

export const fetchBlockedUsers = createAsyncThunk(
    "blocks/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/blocks");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Bloklanmış istifadəçilər yüklənmədi");
        }
    }
);

export const blockUser = createAsyncThunk(
    "blocks/block",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await api.post(`/blocks/${userId}`);
            return { userId, message: res.data };
        } catch (err) {
            return rejectWithValue(err.response?.data || "İstifadəçi bloklanmadı");
        }
    }
);

export const unblockUser = createAsyncThunk(
    "blocks/unblock",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/blocks/${userId}`);
            return { userId, message: res.data };
        } catch (err) {
            return rejectWithValue(err.response?.data || "İstifadəçi blokdan çıxarılmadı");
        }
    }
);
