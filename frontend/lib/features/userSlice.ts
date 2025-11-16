import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SingleUserResponse, UpdateUser, User, UserResponse } from "../types";
import { api } from "@/api/axios";
import toast from "react-hot-toast";
import { getErrorMessage } from "../getErrorMessage";

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
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
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
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});
export const updateCurrentUser = createAsyncThunk<
  User,
  UpdateUser,
  { rejectValue: string }
>("user/updateCurrent", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.patch<SingleUserResponse>("/users/me", userData);
    toast.success("Profile updated successfully");
    return response.data.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const banUser = createAsyncThunk<User, string, { rejectValue: string }>(
  "user/ban",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get<SingleUserResponse>(
        `/users/ban/${userId}`
      );
      toast.success(response.data.msg);
      return response.data.data;
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const unbanUser = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("user/unban", async (userId, { rejectWithValue }) => {
  try {
    const response = await api.get<SingleUserResponse>(
      `/users/unban/${userId}`
    );
    toast.success(response.data.msg);
    return response.data.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const deleteUser = createAsyncThunk<
  string, // return userId
  string,
  { rejectValue: string }
>("user/delete", async (userId, { rejectWithValue }) => {
  try {
    await api.delete(`/users/${userId}`);
    toast.success("User deleted successfully");
    return userId; // return deleted id
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
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
      .addCase(banUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        if (updated) {
          // update users list
          const idx = state.users.findIndex((u) => u.id === updated.id);
          if (idx !== -1) {
            state.users[idx] = { ...state.users[idx], ...updated };
          } else {
            // If not found, optionally push
            state.users.push(updated);
          }
          // update currentUser if matches
          if (state.currentUser?.id === updated.id) {
            state.currentUser = { ...state.currentUser, ...updated };
          }
        }
      })
      .addCase(banUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to ban user";
      })
      .addCase(unbanUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unbanUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        if (updated) {
          const idx = state.users.findIndex((u) => u.id === updated.id);
          if (idx !== -1) {
            state.users[idx] = { ...state.users[idx], ...updated };
          } else {
            state.users.push(updated);
          }
          if (state.currentUser?.id === updated.id) {
            state.currentUser = { ...state.currentUser, ...updated };
          }
        }
      })
      .addCase(unbanUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to unban user";
      })
      .addCase(updateCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update current user";
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete user";
      });
  },
});
export default userSlice.reducer;
