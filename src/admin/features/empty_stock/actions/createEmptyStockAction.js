import api from "../../../../app/api/axios";
import { createProduct } from "../emptyStockSlice";

const createEmptyStockAction =
  (team, plastic, bottle, cashier, date, format) => async (dispatch) => {
    const response = await api.post("/api/new/empty/stores", {
      team,
      plastic,
      bottle,
      cashier,
      date,
      format,
    });

    const item = response.data[0].stockInfo;
    dispatch(createProduct(item));
    console.log(item);
  };

export default createEmptyStockAction;
