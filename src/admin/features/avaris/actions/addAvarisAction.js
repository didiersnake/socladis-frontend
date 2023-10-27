import api from "../../../../app/api/axios";
import { createProduct } from "../avarisSlice";

const addAvarisAction =
  (name, category, format, quantity, type, total, date) => async (dispatch) => {
    const response = await api.post("/api/new/avaris", {
      name,
      category,
      format,
      quantity,
      type,
      total,
      date,
    });

    const avarisItem = response.data[0].stockInfo;
    dispatch(createProduct(avarisItem));
    console.log(avarisItem);
  };

export default addAvarisAction;
