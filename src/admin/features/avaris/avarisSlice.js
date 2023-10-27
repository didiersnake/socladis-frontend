import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  avarisItems: [],
};

const avarisSlice = createSlice({
  name: "avaris",
  initialState,
  reducers: {
    setAvarisItems(state, action) {
      state.avarisItems = action.payload;
    },
    createProduct(state, action) {
      state.avarisItems.push(action.payload);
    },
    updateProduct(state, action) {
      const productIndex = state.avarisItems.findIndex(
        (product) => product._id === action.payload._id
      );
      state.avarisItems[productIndex] = action.payload;
    },
    deleteProduct(state, action) {
      state.avarisItems = state.avarisItems.filter(
        (product) => product._id !== action.payload._id
      );
    },
  },
});

export const { setAvarisItems, createProduct, updateProduct, deleteProduct } =
  avarisSlice.actions;

export const selectAllAvarisProducts = (state) => state.avaris.avarisItems;
export default avarisSlice.reducer;
