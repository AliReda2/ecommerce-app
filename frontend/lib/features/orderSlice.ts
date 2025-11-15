import { api } from "@/api/axios";
import { Order, OrderResponse, UserOrder, UserOrderResponse } from "../types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface orderState {
  orders: Order[];
  userOrders: UserOrder[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}
const initialState: orderState = {
  orders: [],
  userOrders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};
export const fetchAllOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("order/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<OrderResponse>("/order");
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Fetching orders failed"
    );
  }
});
export const fetchMyOrders = createAsyncThunk<
  UserOrder[],
  void,
  { rejectValue: string }
>("order/fetchUsersAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<UserOrderResponse>("/order/me");
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Fetching orders failed"
    );
  }
});

export const updateOrderStatus = createAsyncThunk<
  void,
  { orderId: string; status: Order["status"] },
  { rejectValue: string }
>("order/updateStatus", async ({ orderId, status }, { rejectWithValue }) => {
  try {
    await api.patch(`/order/${orderId}/status`, { status });
    // nothing to return
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Updating order status failed"
    );
  }
});

export const createOrder = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("order/createOrder", async (_, { rejectWithValue }) => {
  try {
    const response = await api.post<OrderResponse>("/order/create");
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "creating orders failed"
    );
  }
});

export const cancelOrder = createAsyncThunk<
  void,
  { orderId: string },
  { rejectValue: string }
>("order/cancelOrder", async ({ orderId }, { rejectWithValue }) => {
  try {
    await api.patch(`/order/${orderId}/cancel`);
    // nothing to return
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Cancelling order failed"
    );
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch orders";
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { orderId, status } = action.meta.arg;
        const idx = state.orders.findIndex((o) => o.id === orderId);
        if (idx !== -1) {
          state.orders[idx] = { ...state.orders[idx], status };
        }
        if (state.currentOrder?.id === orderId) {
          state.currentOrder = { ...state.currentOrder, status };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update order status";
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch orders";
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create order";
      })
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const { orderId } = action.meta.arg;
        const idx = state.userOrders.findIndex((o) => o.id === orderId);
        if (idx !== -1) {
          state.userOrders[idx] = {
            ...state.userOrders[idx],
            status: "CANCELLED",
          };
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to cancel order";
      });
  },
});
export default orderSlice.reducer;
