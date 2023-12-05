import api from "../../../../app/api/axios";
import { setProducts } from "../productSlice";

const readProductAction = () => async (dispatch) => {
  const response = await api.get("/api/all/products/", {});

  const products = response.data;
  dispatch(setProducts(products));
};

export default readProductAction;
