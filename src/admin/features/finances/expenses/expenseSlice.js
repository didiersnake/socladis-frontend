import { createSlice } from "@reduxjs/toolkit";
import React from "react";

const initialState = {
  allExpenses: [],
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpenses(state, action) {
      state.allExpenses = action.payload;
    },
    createExpense(state, action) {
      state.allExpenses.push(action.payload);
    },
    updateExpense(state, action) {
      const expenseIndex = state.allExpenses.findIndex(
        (expense) => expense._id === action.payload._id
      );
      state.allExpenses[expenseIndex] = action.payload;
    },
    deleteExpense(state, action) {
      const expenseIndex = state.allExpenses.findIndex(
        (expense) => expense._id === action.payload
      );
      state.allExpenses.splice(expenseIndex, 1);
    },
  },
});

export const { setExpenses, createExpense, updateExpense, deleteExpense } =
  expenseSlice.actions;
export const selectAllExpenses = (state) => state.expense.allExpenses;
export default expenseSlice.reducer;
