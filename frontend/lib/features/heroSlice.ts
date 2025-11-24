import { api } from "@/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorMessage } from "../getErrorMessage";
import { Hero, HeroResponse, SingleHeroResponse } from "../types";

interface heroState {
  heroes: Hero[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}
const initialState: heroState = {
  heroes: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

export const fetchHeroes = createAsyncThunk<
  Hero[],
  void,
  { rejectValue: string }
>("hero/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<HeroResponse>("/hero");
    return response.data.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const createHero = createAsyncThunk<
  Hero,
  FormData,
  { rejectValue: string }
>("hero/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<SingleHeroResponse>("/hero", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const updateHero = createAsyncThunk<
  Hero,
  { heroId: string; formData: FormData },
  { rejectValue: string }
>("hero/update", async ({ heroId, formData }, { rejectWithValue }) => {
  try {
    const response = await api.patch<SingleHeroResponse>(`/hero/${heroId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const deleteHero = createAsyncThunk<
  Hero,
  string,
  { rejectValue: string }
>("hero/delete", async (heroId, { rejectWithValue }) => {
  try {
    const response = await api.delete<SingleHeroResponse>(`/hero/${heroId}`);
    return response.data.data;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const heroSlice = createSlice({
  name: "hero",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHeroes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.heroes = action.payload;
      })
      .addCase(fetchHeroes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch heroes";
      })
      .addCase(createHero.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createHero.fulfilled, (state, action) => {
        state.isCreating = false;
        state.heroes.push(action.payload);
      })
      .addCase(createHero.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || "Failed to create hero";
      })
      .addCase(updateHero.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateHero.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.heroes.findIndex(
          (hero) => hero.id === action.payload.id
        );
        if (index !== -1) {
          state.heroes[index] = action.payload;
        }
      })
      .addCase(updateHero.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || "Failed to update hero";
      })
      .addCase(deleteHero.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteHero.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.heroes = state.heroes.filter(
          (hero) => hero.id !== action.payload.id
        );
      })
      .addCase(deleteHero.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || "Failed to delete hero";
      });
  },
});

export default heroSlice.reducer;
