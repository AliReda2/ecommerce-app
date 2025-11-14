// store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { api } from "@/api/axios";
import type { RegisterResponse, RegisterUser, UserRole } from "../types";
import toast from "react-hot-toast";

interface JwtPayload {
  sub: string;
  role: UserRole;
  fullName: string;
  iat: number;
  exp: number;
}

interface AuthUser {
  id: string;
  role: UserRole;
  fullName: string;
}

interface AuthState {
  access_token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  registrationSuccess: boolean;
  authChecked: boolean;
}

const initialState: AuthState = {
  access_token: null,
  user: null,
  isLoading: false,
  error: null,
  registrationSuccess: false,
  authChecked: false,
};

const getUserFromToken = (token: string): AuthUser => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded?.sub) throw new Error("Invalid token payload");

    return {
      id: decoded.sub,
      role: decoded.role,
      fullName: decoded.fullName,
    };
  } catch (err: any) {
    throw new Error(`Failed to decode token: ${err?.message || err}`);
  }
};

// Thunks
export const checkAuth = createAsyncThunk<
  { access_token: string; user: AuthUser },
  void,
  { rejectValue: string }
>("auth/checkAuth", async (_, { rejectWithValue }) => {
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  if (!access_token) return rejectWithValue("No token");

  try {
    const currentTime = Math.floor(Date.now() / 1000);
    let token = access_token;

    // Check token expiration
    if (jwtDecode<JwtPayload>(access_token).exp < currentTime) {
      if (!refresh_token) throw new Error("No refresh token");

      const { data } = await api.post(
        "/auth/refresh",
        {},
        { headers: { Authorization: `Bearer ${refresh_token}` } }
      );

      token = data.access_token;
      localStorage.setItem("access_token", token);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
    }

    return {
      access_token: token,
      user: getUserFromToken(token),
    };
  } catch (err: any) {
    toast.error(err?.message || "Failed to check authentication");
    // remove only auth keys
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return rejectWithValue(err?.message || "Token invalid");
  }
});

export const login = createAsyncThunk<
  { access_token: string; user: AuthUser },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    // If you must set a cookie, prefer server-set httpOnly cookie for refresh token.
    document.cookie = `access_token=${data.access_token}; path=/; max-age=3600; samesite=lax`;

    return {
      access_token: data.access_token,
      user: getUserFromToken(data.access_token),
    };
  } catch (err: any) {
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
      // remove only the auth keys
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Logout failed"
      );
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
      message: data.message,
      userId: data.userId,
    };
  } catch (err: any) {
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
        state.access_token = payload.access_token;
        state.user = payload.user;
        state.authChecked = true;
      })
      .addCase(login.rejected, handleRejected)

      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.access_token = payload.access_token;
        state.user = payload.user;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.access_token = null;
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
      });
  },
});

export const { resetRegistrationStatus } = authSlice.actions;
export default authSlice.reducer;
