import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  registerThunk,
  forgotPasswordThunk,
  getProfileThunk,
  updateProfileThunk,
  updateProfileImageThunk,
  verifyOtpThunk,
  resetPasswordThunk,
} from "../thunks/authThunks";

const initialState = {
  user: null,
  tokens: null,
  isAuth: false,
  isLoading: false,
  error: null,

  registrationSuccess: false,
  forgotPasswordSuccess: false,
  forgotPasswordError: "",
  resetToken: null,
  verifyOtpSuccess: false,
  resetPasswordSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuth = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },

    setAuthFromStorage: (state) => {
      state.isAuth = true;
    },

    resetForgotPasswordState: (state) => {
      state.forgotPasswordSuccess = false;
      state.forgotPasswordError = "";
      state.error = null;
      state.isLoading = false;
      state.resetToken = null;
      state.verifyOtpSuccess = false;
      state.resetPasswordSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tokens = {
          access: action.payload.access_token,
          refresh: action.payload.refresh_token,
        };
        state.isAuth = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateProfileImageThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.forgotPasswordSuccess = false;
        state.forgotPasswordError = "";
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.forgotPasswordError = action.payload;
      })
      .addCase(verifyOtpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.verifyOtpSuccess = false;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verifyOtpSuccess = true;
        state.resetToken = action.payload.resetToken;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.resetPasswordSuccess = true;
        state.resetToken = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  setAuthFromStorage,
  resetForgotPasswordState,
} = authSlice.actions;

export default authSlice.reducer;
