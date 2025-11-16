import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import { AddWishListResponse, WishList, WishListResponse } from "../types";
import { getErrorMessage } from "../getErrorMessage";

interface wishListState {
  wishListItems: WishList[];
  isLoading: boolean;
  error: string | null;
}

const initialState: wishListState = {
  wishListItems: [],
  isLoading: false,
  error: null,
};

// Fetch wishlist
export const fetchWishlist = createAsyncThunk<
  WishList[],
  void,
  { rejectValue: string }
>("wishlist/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<WishListResponse>("/wishlist");
    return response.data.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// Remove from wishlist by wishlistId
export const removeFromWishlist = createAsyncThunk<
  string,
  { wishlistId: string },
  { rejectValue: string }
>("wishlist/remove", async ({ wishlistId }, { rejectWithValue }) => {
  try {
    await api.delete(`/wishlist/${wishlistId}`);
    return wishlistId;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// Clear wishlist
export const clearWishlist = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("wishlist/clear", async (_, { rejectWithValue }) => {
  try {
    await api.delete(`/wishlist/clear`);
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// Add to wishlist
export const addToWishlist = createAsyncThunk<
  WishList,
  { productId: string },
  { rejectValue: string }
>("wishlist/add", async ({ productId }, { rejectWithValue }) => {
  try {
    const response = await api.post<AddWishListResponse>(
      `/wishlist/${productId}`
    );
    return response.data.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const wishListSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishListItems = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch wishlist";
      })

      // REMOVE
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishListItems = state.wishListItems.filter(
          (item) => item.id !== action.payload // ✅ filter by wishlistId
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to remove from wishlist";
      })

      // CLEAR
      .addCase(clearWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.isLoading = false;
        state.wishListItems = [];
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to clear wishlist";
      })

      // ADD
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishListItems.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to add to wishlist";
      });
  },
});

export default wishListSlice.reducer;
