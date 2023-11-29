import readAvarisAction from "../admin/features/avaris/actions/readAvarisAction";
import readEmptyStockAction from "../admin/features/empty_stock/actions/readEmptyStockAction";
import readExpenseAction from "../admin/features/finances/expenses/actions/readExpenseAction";
import readIncomeAction from "../admin/features/finances/income/actions/readIncomeAction";
import readProductAction from "../admin/features/product/actions/readProductAction";
import readPurchaseAction from "../admin/features/purchase/actions/readPurchaseAction";
import readStockActions from "../admin/features/stock/actions/readStockActions";
import readTeamAction from "../admin/features/teams/actions/readTeamAction";
import { store } from "../app/store";
import readInvoice from "../features/sales/actions/readInvoice";
import readUsersAction from "../features/users/actions/readUsersAction";

export const loadData = () => {
  store.dispatch(readUsersAction());
  store.dispatch(readProductAction());
  store.dispatch(readAvarisAction());
  store.dispatch(readIncomeAction());
  store.dispatch(readInvoice());
  store.dispatch(readStockActions());
  store.dispatch(readTeamAction());
  store.dispatch(readExpenseAction());
  store.dispatch(readEmptyStockAction());
  store.dispatch(readPurchaseAction());
};
