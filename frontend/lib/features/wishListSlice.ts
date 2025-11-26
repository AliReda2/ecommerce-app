// wishlist slice - fix the exports and add missing optimistic actions
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import { WishList, WishListResponse } from "../types";
import { getErrorMessage } from "../getErrorMessage";

interface WishListState {
  wishListItems: WishList[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishListState = {
  wishListItems: [],
  isLoading: false,
  error: null,
};

// Fetch all wishlist items
export const fetchWishlist = createAsyncThunk<
  WishList[],
  void,
  { rejectValue: string }
>("wishlist/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<WishListResponse>("/wishlist");
    return response.data.data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// In your wishlist slice - fix the toggleWishlist thunk
export const toggleWishlist = createAsyncThunk<
  { status: "added" | "removed"; item?: WishList },
  { productId: string },
  { rejectValue: string }
>("wishlist/toggle", async ({ productId }, { rejectWithValue }) => {
  try {
    // FIX: Send productId in the body as an object that matches ToggleWishlistDto
    const response = await api.post("/wishlist/toggle", { productId });
    return response.data;
  } catch (err) {
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
    await api.delete("/wishlist");
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const wishListSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Optimistic update for toggle
    toggleWishlistOptimistic: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      const { productId } = action.payload;
      const exists = state.wishListItems.some((w) => w.productId === productId);
      if (exists) {
        state.wishListItems = state.wishListItems.filter(
          (w) => w.productId !== productId
        );
      } else {
        // add temporary placeholder item
        state.wishListItems.push({
          id: `temp-${productId}-${Date.now()}`,
          userId: "temp-user",
          productId,
          createdAt: new Date().toISOString(),
          product: {
            id: productId,
            name: "Loading...",
            description: null,
            price: 0,
            imageUrl: null,
            categoryId: "temp-category",
            category: null,
          },
        });
      }
    },
    // Add specific optimistic actions for better clarity
    addToWishlistOptimistic: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      const { productId } = action.payload;
      state.wishListItems.push({
        id: `temp-${productId}-${Date.now()}`,
        userId: "temp-user",
        productId,
        createdAt: new Date().toISOString(),
        product: {
          id: productId,
          name: "Loading...",
          description: null,
          price: 0,
          imageUrl: null,
          categoryId: "temp-category",
          category: null,
        },
      });
    },
    removeFromWishlistOptimistic: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      const { productId } = action.payload;
      state.wishListItems = state.wishListItems.filter(
        (w) => w.productId !== productId
      );
    },
    // Rollback on error
    rollbackWishlistUpdate: (
      state,
      action: PayloadAction<{ previousItems: WishList[] }>
    ) => {
      state.wishListItems = action.payload.previousItems;
    },
  },
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

      // TOGGLE
      .addCase(toggleWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { status, item } = action.payload;
        if (status === "added" && item) {
          // replace temp item if exists
          const index = state.wishListItems.findIndex((w) =>
            w.id.startsWith(`temp-${item.productId}-`)
          );
          if (index !== -1) state.wishListItems[index] = item;
          else state.wishListItems.push(item);
        } else if (status === "removed" && item) {
          state.wishListItems = state.wishListItems.filter(
            (w) => w.productId !== item.productId
          );
        }
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.error = action.payload || "Failed to update wishlist";
      })

      // CLEAR
      .addCase(clearWishlist.fulfilled, (state) => {
        state.wishListItems = [];
      });
  },
});

// Export all actions
export const {
  toggleWishlistOptimistic,
  addToWishlistOptimistic,
  removeFromWishlistOptimistic,
  rollbackWishlistUpdate,
} = wishListSlice.actions;

export default wishListSlice.reducer;
