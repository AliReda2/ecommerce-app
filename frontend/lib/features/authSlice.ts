// store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import type { RegisterUser, UserRole } from "../types";
import { showError } from "../alert";

interface AuthUser {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
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
export const checkAuth = createAsyncThunk<
  { user: AuthUser },
  void,
  { rejectValue: string }
>("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    // Use stored access token to verify authentication
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) throw new Error("No access token");
    const { data } = await api.get("/auth/me");
    return { user: data };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Not authenticated");
  }
});

export const login = createAsyncThunk<
  { user: AuthUser },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    console.log("[auth/login] posting credentials", {
      email: credentials.email,
    });
    const { data: tokens } = await api.post("/auth/login", credentials);
    // Save tokens and set Authorization header
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (api as any).tokenStore?.set?.(tokens);
    // Or use the exported helper directly
    try {
      // dynamic import to avoid circular
      const { tokenStore } = await import("@/api/axios");
      tokenStore.set(tokens as any);
    } catch {}
    // Now fetch user data
    const { data } = await api.get("/auth/me");
    return { user: data };
  } catch (err: any) {
    console.error("[auth/login] failed", err?.response?.data || err?.message);
    showError(err?.message || "Failed to login");
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Login failed"
    );
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (err: any) {
      // ignore API error for logout cleanup
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
      delete api.defaults.headers.common["Authorization"];
    }
  }
);

export const register = createAsyncThunk<
  { user: AuthUser },
  RegisterUser,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const { data: tokens } = await api.post("/auth/register", userData);
    // Save tokens and set Authorization header
    try {
      const { tokenStore } = await import("@/api/axios");
      tokenStore.set(tokens as any);
    } catch {}
    // Now fetch user data
    const { data } = await api.get("/auth/me");
    return { user: data };
  } catch (err: any) {
    showError(err?.message || "Failed to register");
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Registration failed"
    );
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
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleRejected = (state: AuthState, action: any) => {
      state.isLoading = false;
      state.error = action.payload as string;
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
      .addCase(register.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.registrationSuccess = true;
        state.authChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.registrationSuccess = false;
      });
  },
});

export const { resetRegistrationStatus } = authSlice.actions;
export default authSlice.reducer;
