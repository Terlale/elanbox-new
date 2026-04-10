import { createSlice } from "@reduxjs/toolkit";
import { fetchBlockedUsers, blockUser, unblockUser } from "../thunks/blockThunks";

const blockSlice = createSlice({
    name: "blocks",
    initialState: {
        blockedUsers: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearBlockError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Blocked Users
            .addCase(fetchBlockedUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBlockedUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.blockedUsers = action.payload;
            })
            .addCase(fetchBlockedUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Block User
            .addCase(blockUser.fulfilled, (state, action) => {
                // If the backend returns the block object, we could add it.
                // For now, let's assume we re-fetch or find ways to update local state if needed.
                // Normally we'd fetch the list again or the backend returns the new block entity.
            })
            // Unblock User
            .addCase(unblockUser.fulfilled, (state, action) => {
                state.blockedUsers = state.blockedUsers.filter(
                    (b) => b.blocked?.id !== action.meta.arg && b.id !== action.meta.arg
                );
            });
    },
});

export const { clearBlockError } = blockSlice.actions;
export default blockSlice.reducer;
