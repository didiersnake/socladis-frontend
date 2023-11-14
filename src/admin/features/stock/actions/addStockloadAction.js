import api from "../../../../app/api/axios";

const addStockloadAction = (team, products, date) => async (dispatch) => {
  const response = api.post("/api/new/charge", { team, products, date });

  const res = response.data;
  console.log(res);
};

export default addStockloadAction;
