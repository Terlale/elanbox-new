import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

export const fetchDynamicFieldsByCategory = createAsyncThunk(
  "dynamicFields/byCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const res = await api.get("/dynamic-fields");
      return res.data.filter((field) => {
        const fieldCatId = field.category?.id || field.categoryId;
        return Number(fieldCatId) === Number(categoryId);
      });
    } catch (err) {
      return rejectWithValue("Xüsusiyyətlər yüklənmədi");
    }
  }
);
