import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";


export const fetchPremiumListings = createAsyncThunk(
  "listings/fetchPremium",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/listings/search", {
        premium: true,
        status: "ACTIVE",
        limit: 8,
        sortBy: "createdAt",
        direction: "DESC",
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Premium listings fetch failed"
      );
    }
  }
);

export const fetchLatestListings = createAsyncThunk(
  "listings/fetchLatest",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/listings/search", {
        status: "ACTIVE",
        limit: 8,
        sortBy: "createdAt",
        direction: "DESC",
      });
      return res.data;
    } catch (err) {
      return rejectWithValue("Son elanlar yüklənmədi");
    }
  }
);

/* =========================
   CREATE LISTING
========================= */
export const createListing = createAsyncThunk(
  "listings/create",
  async (payload, { rejectWithValue }) => {
    try {
      const isFormData = payload instanceof FormData;
      const res = await api.post("/listings", payload, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      console.error("API Error Response:", err.response?.data);

      const serverError = err.response?.data;
      let errorMsg = "Elan yaradılmadı";

      if (serverError?.errors && typeof serverError.errors === "object") {
        errorMsg = Object.entries(serverError.errors)
          .map(([key, val]) => `${key}: ${val}`)
          .join(", ");
      } else if (typeof serverError === "string") {
        errorMsg = serverError;
      } else if (serverError?.message) {
        errorMsg = serverError.message;
      } else if (Array.isArray(serverError)) {
        errorMsg = serverError.join(", ");
      }

      return rejectWithValue(errorMsg);
    }
  }
);


export const uploadListingImages = createAsyncThunk(
  "listings/uploadImages",
  async ({ listingId, images }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      images.forEach((img) => {
        formData.append("images", img.file);
      });

      await api.patch(
        `/listings/${listingId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      return rejectWithValue("Şəkillər yüklənmədi");
    }
  }
);

/* =========================
   GET LISTING BY ID (DETAIL PAGE)
========================= */
export const fetchListingById = createAsyncThunk(
  "listings/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/listings/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Elan tapılmadı");
    }
  }
);

/* =========================
   USER LISTINGS (MY ADS)
========================= */
export const fetchUserListings = createAsyncThunk(
  "listings/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/listings/user/${userId}`);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || "İstifadəçinin elanları yüklənmədi";
      return rejectWithValue(typeof errorMsg === "string" ? errorMsg : "İstifadəçinin elanları yüklənmədi");
    }
  }
);


export const searchListings = createAsyncThunk(
  "listings/search",
  async (filters, { rejectWithValue }) => {
    try {
      console.log("DEBUG: Client-side searching with filters:", filters);

      const res = await api.post("/listings/search", {
        status: "ACTIVE",
        sortBy: "createdAt",
        direction: "DESC",
      });

      let results = res.data;

      if (filters.title) {
        const query = filters.title.toLowerCase();
        results = results.filter(item =>
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
        );
      }

      if (filters.city) {
        results = results.filter(item =>
          item.city?.toLowerCase() === filters.city.toLowerCase()
        );
      }

      console.log("DEBUG: Filtered Results:", results);
      return results;
    } catch (err) {
      console.error("Search API Error:", err);
      return rejectWithValue("Axtarış nəticə vermədi");
    }
  }
);


export const toggleFavorite = createAsyncThunk(
  "listings/toggleFavorite",
  async ({ listingId, userId, isFavorite }, { rejectWithValue }) => {
    try {
      console.log(`DEBUG: toggleFavorite API CALL - listingId: ${listingId}, userId: ${userId}, current isFavorite: ${isFavorite}`);

      if (isFavorite) {
        const res = await api.delete(`/listings/${listingId}/favorite`, {
          params: { userId }
        });
        console.log("DEBUG: Favorite DELETE response:", res.data);
      } else {
        const res = await api.post(`/listings/${listingId}/favorite`, null, {
          params: { userId }
        });
        console.log("DEBUG: Favorite POST response:", res.data);
      }
      return { listingId, isFavorite: !isFavorite };
    } catch (err) {
      console.error("DEBUG: toggleFavorite Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || "Favorit əməliyyatı uğursuz oldu");
    }
  }
);


export const fetchFavorites = createAsyncThunk(
  "listings/fetchFavorites",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/me/favorites`, {
        params: { userId }
      });
      return res.data;
    } catch (err) {
      console.error("DEBUG: fetchFavorites Error:", err.response?.status, err.response?.data);
      return rejectWithValue(err.response?.data?.message || "Favoritlər yüklənmədi");
    }
  }
);


export const updateListing = createAsyncThunk(
  "listings/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const isFormData = payload instanceof FormData;
      const res = await api.put(`/listings/${id}`, payload, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Yenilənmə alınmadı");
    }
  }
);


export const deleteListing = createAsyncThunk(
  "listings/delete",
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      await api.delete(`/listings/${id}`, {
        params: { userId }
      });
      return id;
    } catch (err) {
      console.error("DEBUG ERROR: deleteListing API FAILED!", {
        url: err.config?.url,
        method: err.config?.method,
        status: err.response?.status,
        data: err.response?.data
      });
      return rejectWithValue(err.response?.data?.message || err.response?.data || "Silinmə alınmadı");
    }
  }
);

export const fetchSimilarListings = createAsyncThunk(
  "listings/fetchSimilar",
  async ({ categoryId, excludeId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/listings/category/${categoryId}`);
      const all = Array.isArray(res.data) ? res.data : [];
      return all
        .filter(
          (item) => String(item.id) !== String(excludeId)
        )
        .slice(0, 8);
    } catch (err) {
      return rejectWithValue("Oxşar elanlar yüklənmədi");
    }
  }
);
