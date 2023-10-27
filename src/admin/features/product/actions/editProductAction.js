import api from "../../../../app/api/axios";
import { updateProduct } from "../productSlice";

const editProductAction = (item) => async (dispatch) => {
  const response = await api.put(`/api/current/product/${item._id}`, item);

  const productUpdate = response.data;
  dispatch(updateProduct(productUpdate));
  console.log(productUpdate);
};

export default editProductAction;
