import { createSlice } from "@reduxjs/toolkit";
import { fetchDynamicFieldsByCategory } from "../thunks/dynamicFieldThunks";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const dynamicFieldSlice = createSlice({
  name: "dynamicFields",
  initialState,
  reducers: {
    clearDynamicFields: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDynamicFieldsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDynamicFieldsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDynamicFieldsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDynamicFields } = dynamicFieldSlice.actions;
export default dynamicFieldSlice.reducer;
