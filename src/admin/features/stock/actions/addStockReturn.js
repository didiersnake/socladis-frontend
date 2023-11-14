import api from "../../../../app/api/axios";

const addStockReturn = (team, products, date) => async (dispatch) => {
  const response = api.post("/api/new/retours", { team, products, date });

  const res = response.data;
};

export default addStockReturn;
