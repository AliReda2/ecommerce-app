import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Product,
  ProductResponse,
  SingleProductResponse,
} from "../types/product";
import { api } from "@/api/axios";
import { getErrorMessage } from "../getErrorMessage";

interface ProductState {
  products: Product[];
  productsByTag: Record<string, Product[]>; // NEW, TRENDING, etc.
  currentProduct: Product | null;
  isLoading: boolean;

  isLoadingByTag: Record<string, boolean>;
  isToggling: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  productsByTag: {},
  currentProduct: null,
  isLoading: false,
  isLoadingByTag: {},
  isToggling: false,
  error: null,
};


export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("product/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ProductResponse>("/product");
    return response.data.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
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
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
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
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  {
    productId: string;
    productData:
    | FormData
    | Partial<Omit<Product, "id" | "category" | "createdAt" | "updatedAt">>;
  },
  { rejectValue: string }
>("product/update", async ({ productId, productData }, { rejectWithValue }) => {
  try {
    const isFormData =
      typeof FormData !== "undefined" && productData instanceof FormData;

    const response = await api.patch<SingleProductResponse>(
      `/product/${productId}`,
      productData as unknown,
      isFormData
        ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
        : undefined
    );
    return response.data.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const deleteProduct = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("product/delete", async (productId, { rejectWithValue }) => {
  try {
    await api.delete(`/product/${productId}`);
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
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
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const fetchProductsByTag = createAsyncThunk<
  Product[],
  string,
  { rejectValue: string }
>("product/fetchByTag", async (tag, { rejectWithValue }) => {
  try {
    const response = await api.get<ProductResponse>(`/product/products/${tag}`);
    return response.data.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const toggleTag = createAsyncThunk<
  Product,
  { productId: string; tagName: string },
  { rejectValue: string }
>("product/toggleTag", async (body, { rejectWithValue }) => {
  try {
    const response = await api.post<SingleProductResponse>(
      "/product/toggleTag",
      body
    );

    return response.data.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
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
        if (
          state.currentProduct &&
          state.currentProduct.id === action.payload.id
        ) {
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
      })
      .addCase(fetchProductsByTag.pending, (state, action) => {
        state.isLoadingByTag[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(fetchProductsByTag.fulfilled, (state, action) => {
        const tag = action.meta.arg;
        state.isLoadingByTag[tag] = false;
        state.productsByTag[tag] = action.payload;
      })
      .addCase(fetchProductsByTag.rejected, (state, action) => {
        const tag = action.meta.arg;
        state.isLoadingByTag[tag] = false;
        state.error = action.payload || `Failed to fetch products for tag ${tag}`;
      })

      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch products";
      })
      .addCase(toggleTag.pending, (state) => {
        state.isToggling = true;
        state.error = null;
      })
      .addCase(toggleTag.fulfilled, (state, action) => {
        state.isToggling = false;
        const updated = action.payload;

        if (updated) {
          // Update main products list
          const idx = state.products.findIndex((p) => p.id === updated.id);
          if (idx !== -1) {
            state.products[idx] = { ...state.products[idx], ...updated };
          } else {
            state.products.push(updated);
          }

          // Update productsByTag lists
          for (const tag in state.productsByTag) {
            const tagIdx = state.productsByTag[tag].findIndex(
              (p) => p.id === updated.id
            );
            if (tagIdx !== -1) {
              state.productsByTag[tag][tagIdx] = {
                ...state.productsByTag[tag][tagIdx],
                ...updated,
              };
            }
          }

          // Update currentProduct if it matches
          if (state.currentProduct?.id === updated.id) {
            state.currentProduct = { ...state.currentProduct, ...updated };
          }
        }
      })

      .addCase(toggleTag.rejected, (state, action) => {
        state.isToggling = false;
        state.error = action.payload || "Failed to toggle tag";
      });
  },
});

export default productSlice.reducer;
