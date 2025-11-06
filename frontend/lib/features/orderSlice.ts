import { api } from "@/api/axios";
import { Order, OrderResponse, SingleOrderResponse } from "../types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface orderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}
const initialState: orderState = {
  orders: [],
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

export const updateOrderStatus = createAsyncThunk<
  void,
  { orderId: string; status: Order["status"] },
  { rejectValue: string }
>("order/updateStatus", async ({ orderId, status }, { rejectWithValue }) => {
  try {
    await api.patch(`/order/${orderId}/status`, { status });
    // nothing to return
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Updating order status failed");
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
      }).addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { orderId, status } = action.meta.arg; 
        const idx = state.orders.findIndex(o => o.id === orderId);
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
      });
  },
});
export default orderSlice.reducer;