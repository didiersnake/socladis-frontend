import api from "../../../../app/api/axios";
import { setPurchaseItems } from "../purchaseSlice";

const readPurchaseAction = () => async (dispatch) => {
  const response = await api.get("/api/all/achats/", {});

  const products = response.data;
  dispatch(setPurchaseItems(products));
};

export default readPurchaseAction;
