import api from "../../../../../app/api/axios";
import { setIncomes } from "../incomeSlice";

const readIncomeAction = () => async (dispatch) => {
  const response = await api.get("/api/all/supply/box/", {});
  const allIncomes = response.data;
  dispatch(setIncomes(allIncomes));
};

export default readIncomeAction;
