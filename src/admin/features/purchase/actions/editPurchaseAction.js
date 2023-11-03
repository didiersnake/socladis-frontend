import api from "../../../../app/api/axios";
import { updatePurchase } from "../purchaseSlice";

const editPurchaseAction = (item) => async (dispatch) => {
  const response = await api.put(`/api/current/achat/${item._id}`, item);

  const productUpdate = response.data;
  dispatch(updatePurchase(productUpdate));
};

export default editPurchaseAction;
