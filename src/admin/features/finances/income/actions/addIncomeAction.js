import api from "../../../../../app/api/axios";
import { createIncome } from "../incomeSlice";

const addIncomeAction = (income_source, amount, date) => async (dispatch) => {
  const response = await api.post("api/new/supply/box", {
    income_source,
    amount,
    date,
  });

  const income = response.data[0].stockInfo;
  dispatch(createIncome(income));
  console.log(income);
};

export default addIncomeAction;
