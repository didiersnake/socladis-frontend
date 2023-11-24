import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  emptyStockItems: [],
};
const emptyStockSlice = createSlice({
  name: "emptyStock",
  initialState,
  reducers: {
    setEmptyStockItems(state, action) {
      state.emptyStockItems = action.payload;
    },
    createProduct(state, action) {
      state.emptyStockItems.push(action.payload);
    },
    updateProduct(state, action) {
      const productIndex = state.emptyStockItems.findIndex(
        (product) => product._id === action.payload._id
      );
      state.emptyStockItems[productIndex] = action.payload;
    },
    deleteProduct(state, action) {
      state.emptyStockItems = state.emptyStockItems.filter(
        (product) => product._id !== action.payload._id
      );
    },
  },
});

export const {
  setEmptyStockItems,
  createProduct,
  updateProduct,
  deleteProduct,
} = emptyStockSlice.actions;
export const selectAllEmptyStock = (state) => state.emptyStock.emptyStockItems;

export default emptyStockSlice.reducer;
