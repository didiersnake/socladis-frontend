import api from "../../../../../app/api/axios";
import { updateIncome } from "../incomeSlice";

const editIncome = (item) => async (dispatch) => {
  const response = await api.put(`/api/current/supply/box/${item._id}`, item);

  const incomeUpdate = response.data;
  dispatch(updateIncome(incomeUpdate));
};

export default editIncome;
