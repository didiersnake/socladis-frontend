import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import readUsersAction from "./features/users/actions/readUsersAction";
import readProductAction from "./admin/features/product/actions/readProductAction";
import readAvarisAction from "./admin/features/avaris/actions/readAvarisAction";
import readIncomeAction from "./admin/features/finances/income/actions/readIncomeAction";
import readInvoice from "./features/sales/actions/readInvoice";
import readStockActions from "./admin/features/stock/actions/readStockActions";
import readTeamAction from "./admin/features/teams/actions/readTeamAction";
import readExpenseAction from "./admin/features/finances/expenses/actions/readExpenseAction";
import readEmptyStockAction from "./admin/features/empty_stock/actions/readEmptyStockAction";
import readPurchaseAction from "./admin/features/purchase/actions/readPurchaseAction";

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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
