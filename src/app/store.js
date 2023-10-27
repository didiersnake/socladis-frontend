import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import userSlice from "../features/users/userSlice";
import aStockSlice from "../admin/features/stock/aStockSlice";
import productSlice from "../admin/features/product/productSlice";
import invoiceSlice from "../features/sales/invoiceSlice";
import avarisSlice from "../admin/features/avaris/avarisSlice";
import teamSlice from "../admin/features/teams/teamSlice";
import emptyStockSlice from "../admin/features/empty_stock/emptyStockSlice";
import purchaseSlice from "../admin/features/purchase/purchaseSlice";
import incomeSlice from "../admin/features/finances/income/incomeSlice";
import expenseSlice from "../admin/features/finances/expenses/expenseSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
};

const reducers = combineReducers({
  auth: authSlice,
  user: userSlice,
  stock: aStockSlice,
  product: productSlice,
  invoice: invoiceSlice,
  avaris: avarisSlice,
  team: teamSlice,
  emptyStock: emptyStockSlice,
  purchase: purchaseSlice,
  income: incomeSlice,
  expense: expenseSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
