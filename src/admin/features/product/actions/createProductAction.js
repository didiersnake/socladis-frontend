import api from "../../../../app/api/axios";
import { createProduct } from "../productSlice";

const createProductAction =
  (name, category, format, unitPrice, sale_price) => async (dispatch) => {
    const response = await api.post("/api/new/products", {
      name,
      category,
      format,
      unitPrice,
      sale_price,
    });
    const product = response.data[0].stockInfo;
    dispatch(createProduct(product));
    console.log(product);
  };

export default createProductAction;
