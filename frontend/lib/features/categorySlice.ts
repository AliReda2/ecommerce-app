import { api } from "@/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category, CategoryResponse } from "../types/category";

interface categoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}
const initialState: categoryState = {
  categories: [],
  isLoading: false,
  error: null,
};
export const fetchCategories = createAsyncThunk<
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
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch categories";
      });
  },
});
export default categorySlice.reducer;
