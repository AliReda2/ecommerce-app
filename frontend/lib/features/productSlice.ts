import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Product,
  ProductResponse,
  SingleProductResponse,
} from "../types/product";
import { api } from "@/api/axios";

interface productState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: productState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
};

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("product/fetchById", async (productId, { rejectWithValue }) => {
  try {
    const response = await api.get<SingleProductResponse>(
      `/product/${productId}`
    );
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Fetching product failed"
    );
  }
});

export const createProduct = createAsyncThunk<
  Product,
  FormData,
  { rejectValue: string }
>("product/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<SingleProductResponse>(
      "/product",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Creating product failed"
    );
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  {
    productId: string;
    productData:
      | FormData
      | Partial<
          Omit<Product, "id" | "category" | "createdAt" | "updatedAt">
        >;
  },
  { rejectValue: string }
>("product/update", async ({ productId, productData }, { rejectWithValue }) => {
  try {
    const isFormData =
      typeof FormData !== "undefined" && productData instanceof FormData;

    const response = await api.patch<SingleProductResponse>(
      `/product/${productId}`,
      productData as any,
      isFormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : undefined
    );
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Updating product failed"
    );
  }
});

export const deleteProduct = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("product/delete", async (productId, { rejectWithValue }) => {
  try {
    await api.delete(`/product/${productId}`);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Deleting product failed"
    );
  }
});

export const fetchProductsByCategory = createAsyncThunk<
  Product[],
  string,
  { rejectValue: string }
>("product/fetchByCategory", async (category, { rejectWithValue }) => {
  try {
    const response = await api.get<ProductResponse>(
      `/product/category/${category}`
    );
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Fetching products by category failed"
    );
  }
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch product";
      })
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create product";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete product";
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        // Keep current product in sync when updating on detail page
        if (state.currentProduct && state.currentProduct.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update product";
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch products by category";
      });
  },
});

export default productSlice.reducer;
