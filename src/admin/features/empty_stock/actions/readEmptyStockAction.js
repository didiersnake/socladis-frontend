import api from "../../../../app/api/axios";
import { setEmptyStockItems } from "../emptyStockSlice";

const readEmptyStockAction = () => async (dispatch) => {
  const response = await api.get("/api/all/empty/stores/", {});

  const emptyStock = response.data;
  dispatch(setEmptyStockItems(emptyStock));
  console.log(emptyStock);
};

export default readEmptyStockAction;
