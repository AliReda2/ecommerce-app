import { api } from "@/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category, CategoryResponse, SingleCategoryResponse } from "../types";
import toast from "react-hot-toast";

interface categoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}
const initialState: categoryState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

export const fetchAllCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("category/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<CategoryResponse>("/category");
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Fetching categories failed"
    );
  }
});

export const getCategoryById = createAsyncThunk<
  Category,
  string,
  { rejectValue: string }
>("category/fetchById", async (categoryId, { rejectWithValue }) => {
  try {
    const response = await api.get<SingleCategoryResponse>(
      `/category/${categoryId}`
    );
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Fetching category failed"
    );
  }
});

export const updateCategory = createAsyncThunk<
  Category,
  { categoryId: string; categoryData: FormData },
  { rejectValue: string }
>(
  "category/update",
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const isFormData =
        typeof FormData !== "undefined" && categoryData instanceof FormData;

      const response = await api.patch<SingleCategoryResponse>(
        `/category/${categoryId}`,
        categoryData as any,
        isFormData
          ? {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          : undefined
      );
      toast.success(response.data.msg);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Updating category failed"
      );
    }
  }
);
export const createCategory = createAsyncThunk<
  Category,
  FormData,
  { rejectValue: string }
>("category/create", async (categoryData, { rejectWithValue }) => {
  try {
    const response = await api.post<SingleCategoryResponse>(
      `/category`,
      categoryData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.success(response.data.msg);
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Creating category failed"
    );
  }
});

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch categories";
      })
      .addCase(getCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch category";
      })
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (
          state.selectedCategory &&
          state.selectedCategory.id === action.payload.id
        ) {
          state.selectedCategory = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update category";
      })
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create category";
      });
  },
});
export default categorySlice.reducer;
