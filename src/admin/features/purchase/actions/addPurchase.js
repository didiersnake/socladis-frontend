import api from "../../../../app/api/axios";
import { createPurchase } from "../purchaseSlice";

const addPurchase =
  (name, purchase_price, format, quantity, category, date) =>
  async (dispatch) => {
    const response = await api.post("/api/new/achats/", {
      name,
      purchase_price,
      format,
      quantity,
      category,
      date,
    });

    const purchase = response.data[0].stockInfo;
    dispatch(createPurchase(purchase));
    console.log(purchase);
  };

export default addPurchase;
