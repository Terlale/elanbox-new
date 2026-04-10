import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";
import { decodeJWT } from "../../utils/decodeJWT";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/authentication", {
        username,
        password,
      });

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/registration", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (username, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/forgot-password", { username });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "User not found");
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async ({ username, otp }, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/reset-password/verify-otp", {
        username,
        otp: parseInt(otp),
      });
      return res.data; // Should return { resetToken }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid OTP");
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, updatePassword, repeatPassword }, { rejectWithValue }) => {
    try {
      const res = await api.post("/users/reset-password", {
        token,
        passwordRequest: {
          updatePassword,
          repeatPassword,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password reset failed");
    }
  }
);

export const getProfileThunk = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      let userId = "";
      if (token) {
        const decoded = decodeJWT(token);
        userId = decoded?.jti || decoded?.id || decoded?.userId || decoded?.sub || "";
      }

      const url = userId ? `/users/profile/${userId}` : "/users/profile";
      const res = await api.get(url);

      console.log("getProfileThunk success res.data:", res.data);
      return res.data;
    } catch (err) {
      console.log("getProfileThunk error:", err.response || err);
      return rejectWithValue(err.response?.data?.message || "Profile fetch failed");
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      let userId = "";
      if (token) {
        const decoded = decodeJWT(token);
        userId = decoded?.jti || decoded?.id || decoded?.userId || decoded?.sub || "";
      }

      const url = userId ? `/users/profile/${userId}` : "/users/profile";

      const playload = { ...data };
      delete playload.avatarFile;

      const res = await api.put(url, playload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Profile update failed");
    }
  }
);

export const updateProfileImageThunk = createAsyncThunk(
  "auth/updateProfileImage",
  async (avatarFile, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      let userId = "";
      if (token) {
        const decoded = decodeJWT(token);
        userId = decoded?.jti || decoded?.id || decoded?.userId || decoded?.sub || "";
      }

      const formData = new FormData();
      formData.append("image", avatarFile);

      const res = await api.put("/users/profile/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Avatar update failed");
    }
  }
);
