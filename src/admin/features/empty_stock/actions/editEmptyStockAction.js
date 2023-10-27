import api from "../../../../app/api/axios";
import { updateProduct } from "../emptyStockSlice";

const editEmptyStockAction = (item) => async (dispatch) => {
  const response = await api.put(`/api/current/empty/store/${item._id}`, item);

  const editedStock = response.data;
  dispatch(updateProduct(editedStock));
  console.log(editedStock);
};

export default editEmptyStockAction;
