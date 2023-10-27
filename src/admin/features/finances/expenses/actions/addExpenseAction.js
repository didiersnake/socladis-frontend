import api from "../../../../../app/api/axios";
import { createExpense } from "../expenseSlice";

const addExpenseAction = (modif, amount, bank, date) => async (dispatch) => {
  const response = await api.post("/api/new/fund/expense", {
    modif,
    amount,
    bank,
    date,
  });

  const newExpense = response.data[0].stockInfo;
  dispatch(createExpense(newExpense));
};

export default addExpenseAction;
