import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts(state, action) {
      state.products = action.payload;
    },
    createProduct(state, action) {
      state.products.push(action.payload);
    },
    updateProduct(state, action) {
      const productIndex = state.products.findIndex(
        (product) => product._id === action.payload._id
      );
      state.products[productIndex] = action.payload;
    },
    deleteProduct(state, action) {
      state.products = state.products.filter(
        (product) => product._id !== action.payload._id
      );
    },
  },
});

export const { setProducts, createProduct, updateProduct, deleteProduct } =
  productSlice.actions;

export default productSlice.reducer;
export const selectAllProducts = (state) => state.product.products;
