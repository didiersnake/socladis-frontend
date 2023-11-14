import api from "../../../app/api/axios";
import { setInvoice } from "../invoiceSlice";

const readInvoice = () => async (dispatch) => {
  const response = await api.get("/api/all/sales/", {});

  const invoices = response.data;
  dispatch(setInvoice(invoices));
};

export default readInvoice;
