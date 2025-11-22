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

interface AuthUser {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  isVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  registrationSuccess: boolean;
  authChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  registrationSuccess: false,
  authChecked: false,
};

// Thunks
// Guard to prevent multiple checkAuth calls simultaneously
let checkAuthPromise: Promise<{ user: AuthUser }> | null = null;

// Helper: check for a non-HttpOnly flag cookie indicating tokens exist
function hasAuthFlagCookie(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("has_auth="));
  } catch {
    return false;
  }
}

export const checkAuth = createAsyncThunk<
  { user: AuthUser },
  void,
  { rejectValue: string }
>("auth/checkAuth", async (_, { rejectWithValue }) => {
  if (!hasAuthFlagCookie()) {
    console.log(
      "[checkAuth] No auth flag cookie present; skipping /auth/me request"
    );
    return rejectWithValue("No auth cookie");
  }
  // If a check is already in progress, return that promise
  if (checkAuthPromise) {
    console.log("[checkAuth] Guard: Reusing existing checkAuth promise");
    return checkAuthPromise;
  }

  // console.log("[checkAuth] Starting new auth check");
  checkAuthPromise = (async () => {
    try {
      // Try to get current user (access token is read from cookie by server)
      const { data } = await api.get<{ user: AuthUser }>("/auth/me");
      console.log("[checkAuth] Auth check successful, user:", data.user);
      checkAuthPromise = null;
      return { user: data.user };
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err) || "Failed to check authentication";
      console.error("[checkAuth] Auth check failed:", errMsg);
      checkAuthPromise = null;
      toast.error(errMsg);
      throw errMsg;
    }
  })();

  try {
    return await checkAuthPromise;
  } catch (errMsg: unknown) {
    return rejectWithValue(errMsg as string);
  }
});

export const login = createAsyncThunk<
  { user: AuthUser },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    // login sets HttpOnly cookies; request must include credentials (handled by axios)
    await api.post("/auth/login", credentials);
    const { data } = await api.get<{ user: AuthUser }>("/auth/me");
    return { user: data.user };
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err));
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
    return rejectWithValue(getErrorMessage(err));
  }
});

export const verifyOtp = createAsyncThunk<
  VerifyOtpResponse,
  VerifyOtpPayload,
  { rejectValue: string }
>("auth/verifyOtp", async (data, { rejectWithValue }) => {
  try {
    await api.post("/auth/verify-email", data);
    const { data: me } = await api.get<{ user: AuthUser }>("/auth/me");
    return { message: "Email verified", user: me.user } as VerifyOtpResponse;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
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
    return rejectWithValue(getErrorMessage(err));
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
      {
        email,
      }
    );
    return response.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const resetPassword = createAsyncThunk<
  { message: string },
  { email: string; otp: string; password: string },
  { rejectValue: string }
>("auth/resetPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post<{ message: string }>(
      "/auth/reset-password",
      data
    );
    return response.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetRegistrationStatus: (state) => {
      state.registrationSuccess = false;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleRejected = (state: AuthState, action: { payload?: string }) => {
      state.isLoading = false;
      state.error = action.payload || null;
    };

    builder
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.authChecked = true;
      })
      .addCase(login.rejected, handleRejected)

      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.authChecked = true;
      })

      .addCase(logout.fulfilled, (state) => {
        Object.assign(state, initialState);
        state.authChecked = true;
      })
      .addCase(logout.rejected, (state, { payload }) => {
        // preserve error after resetting state
        Object.assign(state, initialState);
        state.error = payload as string;
        state.authChecked = true;
      })

      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationSuccess = true;
        state.error = null;
      })

      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.registrationSuccess = false;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        // set user from payload if available
        if (action.payload?.user) state.user = action.payload.user;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "OTP verification failed";
      })
      .addCase(resendOtp.pending, handlePending)
      .addCase(resendOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendOtp.rejected, handleRejected)
      .addCase(forgotPassword.pending, handlePending)
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, handleRejected)
      .addCase(resetPassword.pending, handlePending)
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, handleRejected);
  },
});

export const { resetRegistrationStatus } = authSlice.actions;
export default authSlice.reducer;
