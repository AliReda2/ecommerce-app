import { api } from "@/api/axios";
import {
  CreateOrderResponse,
  Order,
  OrderResponse,
  SingleOrder,
  SingleOrderResponse,
  UserOrder,
  UserOrderResponse,
} from "../types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface orderState {
  orders: Order[];
  userOrders: UserOrder[];
  currentOrder: SingleOrder | null;
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
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Fetching orders failed";
    return rejectWithValue(errorMsg);
  }
});

export const fetchOrderById = createAsyncThunk<
  SingleOrder,
  { id: string },
  { rejectValue: string }
>("order/fetchById", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await api.get<SingleOrderResponse>(`/order/${id}`);
    return response.data.data;
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Fetching order failed";
    return rejectWithValue(errorMsg);
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
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Fetching orders failed";
    return rejectWithValue(errorMsg);
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
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Updating order status failed";
    return rejectWithValue(errorMsg);
  }
});

export const createOrder = createAsyncThunk<
  Order,
  void,
  { rejectValue: string }
>("order/createOrder", async (_, { rejectWithValue }) => {
  try {
    const response = await api.post<CreateOrderResponse>("/order/create");
    return response.data.data; // success
  } catch (err: unknown) {
    const axiosError = err as AxiosError<{ message: string }>;
    // return backend message if exists, otherwise generic
    return rejectWithValue(
      axiosError.response?.data?.message || "Creating order failed"
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
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Cancelling order failed";
    return rejectWithValue(errorMsg);
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
        state.orders.push(action.payload); // append the created order
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

        const apply = (list: Array<{ id: string; status: string }>) => {
          const i = list.findIndex((o) => o.id === orderId);
          if (i !== -1) list[i] = { ...list[i], status: "CANCELLED" };
        };
        apply(state.userOrders);
        apply(state.orders);

        if (state.currentOrder?.id === orderId) {
          state.currentOrder.status = "CANCELLED";
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to cancel order";
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch order";
      });
  },
});
export default orderSlice.reducer;
