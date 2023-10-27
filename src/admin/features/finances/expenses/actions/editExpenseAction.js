import api from "../../../../../app/api/axios";
import { updateExpense } from "../expenseSlice";

const editExpenseAction = (item) => async (dispatch) => {
  const response = await api.put(`/api/current/fund/expense/${item._id}`, item);

  const expenseUpdate = response.data;
  dispatch(updateExpense(expenseUpdate));
};
export default editExpenseAction;
