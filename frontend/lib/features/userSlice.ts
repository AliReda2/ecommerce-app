import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SingleUserResponse, User, UserResponse } from "../types";
import { api } from "@/api/axios";

interface userState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}
const initialState: userState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
};

export const fetchAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("user/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<UserResponse>("/users");
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Fetching users failed"
    );
  }
});
export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("user/fetchCurrent", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<SingleUserResponse>("/users/me");
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Fetching current user failed"
    );
  }
});

export const banUser = createAsyncThunk<void, string, { rejectValue: string }>(
  "user/ban",
  async (userId, { rejectWithValue }) => {
    try {
      await api.get(`/users/ban/${userId}`);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Banning user failed"
      );
    }
  }
);

export const unbanUser = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("user/unban", async (userId, { rejectWithValue }) => {
  try {
    await api.get(`/users/unban/${userId}`);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Unbanning user failed"
    );
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch users";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch current user";
      })
      .addCase(banUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(banUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(banUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to ban user";
      })
      .addCase(unbanUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unbanUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(unbanUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to unban user";
      });
  },
});
export default userSlice.reducer;
