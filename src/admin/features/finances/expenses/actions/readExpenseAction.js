import api from "../../../../../app/api/axios";
import { setExpenses } from "../expenseSlice";

const readExpenseAction = () => async (dispatch) => {
  const response = await api.get("/api/all/fund/expenses", {});
  const data = response.data;
  dispatch(setExpenses(data));
  console.log(data);
};

export default readExpenseAction;
