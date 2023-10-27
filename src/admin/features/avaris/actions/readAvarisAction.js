import api from "../../../../app/api/axios";
import { setAvarisItems } from "../avarisSlice";

const readAvarisAction = () => async (dispatch) => {
  const response = await api.get("/api/all/avaris/", {});

  const stock = response.data;
  dispatch(setAvarisItems(stock));
  console.log(stock);
};

export default readAvarisAction;
