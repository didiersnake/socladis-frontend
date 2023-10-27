import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stockItems: [],
};

const aStockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setStockItems(state, action) {
      state.stockItems = action.payload;
    },
    createProduct(state, action) {
      state.stockItems.push(action.payload);
    },
    updateProduct(state, action) {
      const productIndex = state.stockItems.findIndex(
        (product) => product._id === action.payload._id
      );
      state.stockItems[productIndex] = action.payload;
    },
    deleteProduct(state, action) {
      state.stockItems = state.stockItems.filter(
        (product) => product.id !== action.payload.id
      );
    },
  },
});

export const { setStockItems, createProduct, updateProduct, deleteProduct } =
  aStockSlice.actions;

export default aStockSlice.reducer;
export const selectAllStockProducts = (state) => state.stock.stockItems;
