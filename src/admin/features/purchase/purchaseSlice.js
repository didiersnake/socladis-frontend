import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  purchaseItems: [],
};

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    setPurchaseItems(state, action) {
      state.purchaseItems = action.payload;
    },
    createPurchase(state, action) {
      state.purchaseItems.push(action.payload);
    },
    updatePurchase(state, action) {
      const purchaseIndex = state.purchaseItems.findIndex(
        (purchase) => purchase._id === action.payload._id
      );
      state.purchaseItems[purchaseIndex] = action.payload;
    },
    deletePurchase(state, action) {
      state.purchaseItems = state.purchaseItems.filter(
        (purchase) => purchase.id !== action.payload.id
      );
    },
  },
});
export const {
  setPurchaseItems,
  createPurchase,
  updatePurchase,
  deletePurchase,
} = purchaseSlice.actions;
export const selectAllPurchase = (state) => state.purchase.purchaseItems;
export default purchaseSlice.reducer;
