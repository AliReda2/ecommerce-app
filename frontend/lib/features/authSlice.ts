// store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { api } from "@/api/axios";
import type { RegisterUser, UserRole } from "../types";
import { showError } from "../alert";

interface JwtPayload {
  sub: string;
  role: UserRole;
  fullName: string;
  iat: number;
  exp: number;
}

interface AuthState {
  access_token: string | null;
  user: { id: string; role: UserRole; fullName: string } | null;
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

// Helper function to extract user data from token
const getUserFromToken = (
  token: string
): { id: string; role: UserRole; fullName: string } => {
  const decoded: JwtPayload = jwtDecode(token);
  return {
    id: decoded.sub,
    role: decoded.role,
    fullName: decoded.fullName,
  };
};

// Thunks
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
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
      showError(err || "Failed to check authentication");

      localStorage.clear();
      return rejectWithValue("Token invalid");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      // After successful login
      document.cookie = `access_token=${data.access_token}; path=/; max-age=3600`;

      return {
        access_token: data.access_token,
        user: getUserFromToken(data.access_token),
      };
    } catch (err: any) {
      showError(err || "Failed to login");
      return rejectWithValue(err?.response?.data?.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      localStorage.clear();
    } catch (err: any) {
      showError(err || "Failed to logout");
      return rejectWithValue(err?.response?.data?.message || "Logout failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: RegisterUser, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      // After successful login
      document.cookie = `access_token=${data.access_token}; path=/; max-age=3600`;

      return {
        access_token: data.access_token,
        user: getUserFromToken(data.access_token),
      };
    } catch (err: any) {
      showError(err || "Failed to register");
      return rejectWithValue(
        err.response?.data?.message || err.message || "Registration failed"
      );
    }
  }
);

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
        Object.assign(state, initialState, { authChecked: true });
      })
      .addCase(logout.rejected, (state, { payload }) => {
        state.error = payload as string;
        Object.assign(state, initialState, { authChecked: true });
      })

      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload;
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
