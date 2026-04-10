import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

export const submitReport = createAsyncThunk(
    "reports/submit",
    async (payload, { rejectWithValue }) => {
        try {
            // payload: { userId, listingId, reason }
            const res = await api.post("/reports", payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Şikayət göndərilmədi");
        }
    }
);

export const fetchMyReports = createAsyncThunk(
    "reports/fetchMy",
    async (_, { rejectWithValue }) => {
        try {
            // Note: Backend might need a specific endpoint for this. 
            // Currently using a placeholder or global if appropriate.
            const res = await api.get("/reports"); 
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Şikayətləriniz yüklənmədi");
        }
    }
);
