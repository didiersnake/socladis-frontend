import { createSlice } from "@reduxjs/toolkit";
import React from "react";

const initialState = {
  incomes: [],
};

const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    setIncomes(state, action) {
      state.incomes = action.payload;
    },
    createIncome(state, action) {
      state.incomes.push(action.payload);
    },
    updateIncome(state, action) {
      const incomeIndex = state.incomes.findIndex(
        (income) => income._id === action.payload._id
      );
      state.incomes[incomeIndex] = action.payload;
    },
    deleteIncome(state, action) {
      const incomeIndex = state.incomes.findIndex(
        (income) => income._id === action.payload
      );
      state.incomes.splice(incomeIndex, 1);
    },
  },
});
export const { setIncomes, createIncome, updateIncome, deleteIncome } =
  incomeSlice.actions;
export const selectAllIncomes = (state) => state.income.incomes;
export default incomeSlice.reducer;
