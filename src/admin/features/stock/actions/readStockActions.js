import api from "../../../../app/api/axios";
import { setStockItems } from "../aStockSlice";

const readStockActions = () => async (dispatch) => {
  const response = await api.get("/api/all/stocks/", {});

  const stock = response.data;
  dispatch(setStockItems(stock));
};

export default readStockActions;
