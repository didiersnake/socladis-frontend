import api from "../../../app/api/axios";
import { createInvoice } from "../invoiceSlice";

const addInvoice =
  (
    clientName,
    products,
    total_without_tax,
    VAT_amount,
    withdrawal_amount,
    total_with_tax,
    ristourne,
    status,
    date,
    payment_method
  ) =>
  async (dispatch) => {
    const response = await api.post("/api/new/sales", {
      clientName,
      products,
      total_without_tax,
      VAT_amount,
      withdrawal_amount,
      total_with_tax,
      ristourne,
      status,
      date,
      payment_method,
    });

    const invoice = response.data[0].saleInfo;
    dispatch(createInvoice(invoice));
    console.log(invoice);
  };

export default addInvoice;
