import { api } from "@/api/axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, CategoryResponse } from "../types";

interface categoryState {
  categories: Category[];
  selectedCategory: string | null;
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
      });
  },
});
export default categorySlice.reducer;
