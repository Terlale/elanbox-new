import { createSlice } from "@reduxjs/toolkit";
import { submitReport, fetchMyReports } from "../thunks/reportThunks";

const reportSlice = createSlice({
    name: "reports",
    initialState: {
        myReports: [],
        loading: false,
        submitting: false,
        error: null,
        success: false,
    },
    reducers: {
        resetReportStatus: (state) => {
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Submit Report
            .addCase(submitReport.pending, (state) => {
                state.submitting = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitReport.fulfilled, (state, action) => {
                state.submitting = false;
                state.success = true;
                state.myReports.unshift(action.payload);
            })
            .addCase(submitReport.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Fetch My Reports
            .addCase(fetchMyReports.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyReports.fulfilled, (state, action) => {
                state.loading = false;
                // Currently backend returns Page object or List
                state.myReports = action.payload.content || action.payload || [];
            })
            .addCase(fetchMyReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetReportStatus } = reportSlice.actions;
export default reportSlice.reducer;
