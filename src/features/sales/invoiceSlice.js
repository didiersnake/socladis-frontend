import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [],
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setInvoice(state, action) {
      state.invoices = action.payload;
    },
    createInvoice(state, action) {
      state.invoices.push(action.payload);
    },
    updateInvoice(state, action) {
      const invoiceIndex = state.invoices.findIndex(
        (product) => product._id === action.payload._id
      );
      state.invoices[invoiceIndex] = action.payload;
    },
    deleteInvoice(state, action) {
      state.invoices = state.invoices.filter(
        (product) => product.id !== action.payload.id
      );
    },
  },
});
export const { setInvoice, createInvoice, updateInvoice, deleteInvoice } =
  invoiceSlice.actions;
export const selectAllInvoices = (state) => state.invoice.invoices;

export const selectInvoiceById = (state, invoiceId) => {
  return state.invoice.invoices.find((invoice) => invoice._id === invoiceId);
};

export default invoiceSlice.reducer;
