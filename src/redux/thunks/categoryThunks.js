import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/categories");
      return res.data;
    } catch (err) {
      return rejectWithValue("Kateqoriyalar yüklənmədi");
    }
  }
);

export const fetchMainCategories = createAsyncThunk(
  "categories/fetchMain",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/categories/main");
      return res.data;
    } catch (err) {
      return rejectWithValue("Əsas kateqoriyalar yüklənmədi");
    }
  }
);
