// src/lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import productReducer from "./features/productSlice";
import categoryReducer from "./features/categorySlice";
import orderReducer from "./features/orderSlice";
import cartReducer from "./features/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    order: orderReducer,
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
