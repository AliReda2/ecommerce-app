import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createProductDto,
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

export const fetchAllProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("product/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ProductResponse>("/product");
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Fetching products failed"
    );
  }
});

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
  createProductDto,
  { rejectValue: string }
>("product/create", async (productData, { rejectWithValue }) => {
  try {
    const response = await api.post<SingleProductResponse>(
      "/product",
      productData
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
  { productId: string; productData: Partial<Product> },
  { rejectValue: string }
>("product/update", async ({ productId, productData }, { rejectWithValue }) => {
  try {
    const response = await api.patch<SingleProductResponse>(
      `/product/${productId}`,
      productData
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
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch products";
      })
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
