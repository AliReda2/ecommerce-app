import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  highlightedProductId: string | null;
}

const initialState: UIState = {
  highlightedProductId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setHighlightedProduct: (state, action: PayloadAction<string | null>) => {
      state.highlightedProductId = action.payload;
    },
  },
});

export const { setHighlightedProduct } = uiSlice.actions;
export default uiSlice.reducer;
