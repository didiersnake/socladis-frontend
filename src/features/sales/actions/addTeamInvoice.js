import { createInvoice } from "../invoiceSlice";
import api from "../../../app/api/axios";

const addTeamInvoice =
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
    const response = await api.post("/api/new/second/sales", {
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
  };

export default addTeamInvoice;
