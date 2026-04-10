import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories, fetchMainCategories } from "../thunks/categoryThunks";

const initialState = {
  items: [],
  mainCategories: [],
  loading: false,
  mainLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMainCategories.pending, (state) => {
        state.mainLoading = true;
      })
      .addCase(fetchMainCategories.fulfilled, (state, action) => {
        state.mainLoading = false;
        state.mainCategories = action.payload;
      })
      .addCase(fetchMainCategories.rejected, (state, action) => {
        state.mainLoading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
