// store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import type { RegisterResponse, RegisterUser, UserRole } from "../types";
import toast from "react-hot-toast";
import { getErrorMessage } from "../getErrorMessage";

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface VerifyOtpResponse {
  message: string;
  user?: AuthUser;
}

export interface AuthUser {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  isVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isSendingForgotPassword: boolean;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isCheckingAuth: boolean;
  isVerifyingOtp: boolean;
  isSendingOtp: boolean;
  isResettingPassword: boolean;
  error: string | null;
  registrationSuccess: boolean;
  authChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  isSendingForgotPassword: false,
  isCheckingAuth: false,
  isLoggingIn: false,
  isRegistering: false,
  isVerifyingOtp: false,
  isSendingOtp: false,
  isResettingPassword: false,
  error: null,
  registrationSuccess: false,
  authChecked: false,
};

// Single-flight guard for checkAuth
let checkAuthPromise: Promise<{ user: AuthUser }> | null = null;

/**
 * checkAuth
 * - Uses /auth/has to detect a session (server reads HttpOnly cookies)
 * - If session exists, calls /auth/me to fetch the user object
 * - Uses a single-flight promise to avoid duplicate network traffic
 */
export const checkAuth = createAsyncThunk<
  { user: AuthUser },
  void,
  { rejectValue: string }
>("auth/checkAuth", async (_, { rejectWithValue }) => {
  // Avoid running in SSR
  if (typeof window === "undefined") {
    return rejectWithValue("SSR");
  }

  // Reuse ongoing check if present
  if (checkAuthPromise) {
    return checkAuthPromise;
  }

  checkAuthPromise = (async () => {
    try {
      const flagResp = await api.get<{ hasAuth: boolean }>("/auth/has");

      if (!flagResp.data?.hasAuth) {
        // No active session on server
        throw new Error("No session");
      }

      const meResp = await api.get<{ user: AuthUser }>("/auth/me");
      return { user: meResp.data.user };
    } finally {
      // ensure promise cleared in all code paths
      checkAuthPromise = null;
    }
  })();

  try {
    return await checkAuthPromise;
  } catch (err: unknown) {
    const msg = getErrorMessage(err) || String(err) || "Failed to check auth";
    if (typeof window !== "undefined") toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const login = createAsyncThunk<
  { user: AuthUser },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    // Login sets HttpOnly cookies on the server
    await api.post("/auth/login", credentials);

    // After login, /auth/me will return the user (backend reads cookies)
    const { data } = await api.get<{ user: AuthUser }>("/auth/me");

    return { user: data.user };
  } catch (err: unknown) {
    const msg = getErrorMessage(err) || "Login failed";
    if (typeof window !== "undefined") toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Server should clear HttpOnly cookies and invalidate session
      await api.post("/auth/logout");
    } catch (err: unknown) {
      const msg = getErrorMessage(err) || "Logout failed";
      if (typeof window !== "undefined") toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const register = createAsyncThunk<
  RegisterResponse,
  RegisterUser,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", userData);
    return {
      msg: data.message,
      userId: data.userId,
    };
  } catch (err: unknown) {
    const msg = getErrorMessage(err) || "Registration failed";
    if (typeof window !== "undefined") toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const verifyOtp = createAsyncThunk<
  VerifyOtpResponse,
  VerifyOtpPayload,
  { rejectValue: string }
>("auth/verifyOtp", async (payload, { rejectWithValue }) => {
  try {
    await api.post("/auth/verify-email", payload);
    const { data: me } = await api.get<{ user: AuthUser }>("/auth/me");
    return { message: "Email verified", user: me.user } as VerifyOtpResponse;
  } catch (err: unknown) {
    const msg = getErrorMessage(err) || "OTP verification failed";
    if (typeof window !== "undefined") toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const resendOtp = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>("auth/resendOtp", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await api.post<{ message: string }>("/mail/otp", {
      email,
    });
    return response.data;
  } catch (err: unknown) {
    const msg = getErrorMessage(err) || "Failed to resend OTP";
    if (typeof window !== "undefined") toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const forgotPassword = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>("auth/forgotPassword", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await api.post<{ message: string }>(
      "/auth/forgot-password",
      { email }
    );
    return response.data;
  } catch (err: unknown) {
    const msg = getErrorMessage(err) || "Failed to send password reset email";
    if (typeof window !== "undefined") toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const resetPassword = createAsyncThunk<
  { message: string },
  { email: string; otp: string; password: string },
  { rejectValue: string }
>("auth/resetPassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<{ message: string }>(
      "/auth/reset-password",
      payload
    );
    return response.data;
  } catch (err: unknown) {
    const msg = getErrorMessage(err) || "Failed to reset password";
    if (typeof window !== "undefined") toast.error(msg);
    return rejectWithValue(msg);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetRegistrationStatus: (state) => {
      state.registrationSuccess = false;
    },
    // local state reset only, server-side logout should be performed via logout thunk
    clearUserState: (state) => {
      state.user = null;
      state.authChecked = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoggingIn = false;
        state.user = payload.user;
        state.authChecked = true;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoggingIn = false;
        state.user = null;
        state.error = payload ?? "Login failed";
        state.authChecked = true;
      })

      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.isCheckingAuth = false;
        state.user = payload.user;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state, { payload }) => {
        state.isCheckingAuth = false;
        state.user = null;
        state.authChecked = true;
        // payload may be "No session" or an error message
        state.error = payload ?? null;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        Object.assign(state, initialState);
        state.authChecked = true;
      })
      .addCase(logout.rejected, (state, { payload }) => {
        // clear client state but surface error
        Object.assign(state, initialState);
        state.error = payload ?? "Logout failed";
        state.authChecked = true;
      })

      // register
      .addCase(register.pending, (state) => {
        state.isRegistering = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isRegistering = false;
        state.registrationSuccess = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.isRegistering = false;
        state.error = payload ?? "Registration failed";
        state.registrationSuccess = false;
      })

      // verifyOtp
      .addCase(verifyOtp.pending, (state) => {
        state.isVerifyingOtp = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, { payload }) => {
        state.isVerifyingOtp = false;
        if (payload?.user) state.user = payload.user;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, { payload }) => {
        state.isVerifyingOtp = false;
        state.error = payload ?? "OTP verification failed";
      })

      // resendOtp
      .addCase(resendOtp.pending, (state) => {
        state.isSendingOtp = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.isSendingOtp = false;
        state.error = null;
      })
      .addCase(resendOtp.rejected, (state, { payload }) => {
        state.isSendingOtp = false;
        state.error = payload ?? "Failed to resend OTP";
      })

      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.isSendingForgotPassword = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isSendingForgotPassword = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, { payload }) => {
        state.isSendingForgotPassword = false;
        state.error = payload ?? "Failed to send password reset email";
      })

      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isResettingPassword = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isResettingPassword = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, { payload }) => {
        state.isResettingPassword = false;
        state.error = payload ?? "Failed to reset password";
      });
  },
});

export const { resetRegistrationStatus, clearUserState } = authSlice.actions;
export default authSlice.reducer;
