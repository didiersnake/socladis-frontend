import api from "../../../../app/api/axios";
import { deleteProduct } from "../productSlice";

const deleteProductAction = (id) => async (dispatch) => {
  const response = await api.delete(`/api/current/product/${id}`, {});

  dispatch(deleteProduct(id));
  console.log("deleted");
  console.log(response.data);
};

export default deleteProductAction;
