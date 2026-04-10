import { api } from "../api/axios";

export const authService = {
  login: async (data) => {
    const response = await api.post("/users/authentication", data);
    return response.data;
  },
  register: async (data) => {
    const response = await api.post("/users/registration", data);
    return response.data;
  },
  forgotPassword: async (username) => {
    const response = await api.post("/users/forgot-password", { username });
    return response.data;
  },
  verifyOtp: async (data) => {
    const response = await api.post("/users/reset-password/verify-otp", data);
    return response.data;
  },
  resetPassword: async (data) => {
    const response = await api.post("/users/reset-password", data);
    return response.data;
  },
};
