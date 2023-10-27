import api from "../../../../app/api/axios";
import { updateProduct } from "../aStockSlice";

const editItemAction = (item) => async (dispatch) => {
  const response = await api.put(`/api/current/stock/${item._id}`, item);

  const productUpdate = response.data;
  dispatch(updateProduct(productUpdate));
  console.log(productUpdate);
};
export default editItemAction;
