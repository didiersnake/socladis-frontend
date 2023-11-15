import api from "../../../../app/api/axios";
import { createPurchase } from "../purchaseSlice";

const addPurchase =
  (name, unitPrice, format, quantity, category, date, invoice_number) =>
  async (dispatch) => {
    const response = await api.post("/api/new/achats/", {
      name,
      unitPrice,
      format,
      quantity,
      category,
      date,
      invoice_number,
    });

    const purchase = response.data[0].stockInfo;
    dispatch(createPurchase(purchase));
    console.log(purchase);
  };

export default addPurchase;
