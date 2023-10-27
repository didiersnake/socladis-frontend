import api from "../../../../app/api/axios";
import { createProduct } from "../aStockSlice";

const addItemAction =
  (name, category, format, quantity, unitPrice, status, date, productId) =>
  async (dispatch) => {
    const response = await api.post("/api/new/stocks", {
      name,
      category,
      format,
      quantity,
      unitPrice,
      status,
      date,
      productId,
    });

    const stockItem = response.data[0].stockInfo;
    dispatch(createProduct(stockItem));
    console.log(stockItem);
  };
export default addItemAction;
