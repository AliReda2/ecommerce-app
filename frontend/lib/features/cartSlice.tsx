import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import { CartItem, CartResponse } from "../types";

interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartItems: [],
  isLoading: false,
  error: null,
};

// ✅ Fetch all cart items
export const getCartItems = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>("cart/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<CartResponse>("/cart");
    return data.data;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Fetching cart items failed";
    return rejectWithValue(errorMsg);
  }
});

// ✅ Add item to cart
export const addToCart = createAsyncThunk<
  CartItem,
  { productId: string; quantity: number },
  { rejectValue: string }
>("cart/addItem", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.post<{ data: CartItem; msg: string }>(
      "/cart/add",
      {
        productId,
        quantity,
      }
    );
    return response.data.data; // unwrap here
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Adding to cart failed";
    return rejectWithValue(errorMsg);
  }
});

// ✅ Remove item from cart
export const removeFromCart = createAsyncThunk<
  string,
  { cartItemId: string },
  { rejectValue: string }
>("cart/removeItem", async ({ cartItemId }, { rejectWithValue }) => {
  try {
    await api.delete("/cart/remove", {
      data: { cartItemId },
    });
    return cartItemId;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Removing from cart failed";
    return rejectWithValue(errorMsg);
  }
});

// ✅ Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk<
  CartItem,
  { cartItemId: string; quantity: number },
  { rejectValue: string }
>("cart/updateItem", async ({ cartItemId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch<CartItem>("/cart/update", {
      cartItemId,
      quantity,
    });
    return data;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Updating cart item failed";
    return rejectWithValue(errorMsg);
  }
});

// ✅ Clear cart
export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/cart/clear");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Clearing cart failed";
      return rejectWithValue(errorMsg);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch cart items";
      })

      // ADD
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;

        const index = state.cartItems.findIndex(
          (item) => item.productId === action.payload.productId
        );

        if (index >= 0) {
          state.cartItems[index] = action.payload; // update quantity
        } else {
          state.cartItems.push(action.payload);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to add item to cart";
      })

      // REMOVE
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to remove item from cart";
      })

      // UPDATE
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.cartItems.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.cartItems[index] = action.payload;
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update cart item";
      })

      // CLEAR
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to clear cart";
      });
  },
});

export default cartSlice.reducer;
