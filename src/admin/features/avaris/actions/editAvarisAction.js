import api from "../../../../app/api/axios";
import { updateProduct } from "../avarisSlice";

const editAvarisAction = (item) => async (dispatch) => {
  const response = await api.put(`/api/current/avari/${item._id}`, item);

  const productUpdate = response.data;
  dispatch(updateProduct(productUpdate));
  console.log(productUpdate);
};

export default editAvarisAction;
