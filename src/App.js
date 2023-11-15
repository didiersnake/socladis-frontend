import { Layout } from "./components/Layout";

import { Routes, Route } from "react-router-dom";
import Reconciliation from "./admin/features/reconciliation/Reconciliation";
import Dashboard from "./admin/pages/Dashboard";
import Stock from "./features/stock/Stock";
import AStock from "./admin/features/stock/AStock";
import Issues from "./features/stock/Avaris";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./features/auth/Login";
import RLayout from "./admin/components/RLayout";
import Users from "./features/users/Users";
import AddUser from "./features/users/AddUser";
import Products from "./admin/features/product/Products";
import AddProduct from "./admin/features/product/AddProduct";
import AddStockItem from "./admin/features/stock/AddStockItem";
import CreateInvoice from "./features/sales/CreateInvoice";
import Invoice from "./features/sales/Invoice";
import Avaris from "./admin/features/avaris/Avaris";
import Teams from "./admin/features/teams/Teams";
import CreateTeam from "./admin/features/teams/CreateTeam";
import ReturnLoad from "./admin/features/stock/ReturnLoad";
import StockLoad from "./admin/features/stock/StockLoad";
import AddAvarisItem from "./admin/features/avaris/AddAvarisItem";
import InvoiceView from "./features/sales/InvoiceView";
import Purchase from "./admin/features/purchase/Purchase";
import CreatePurchase from "./admin/features/purchase/CreatePurchase";
import AddEmptyItem from "./admin/features/empty_stock/AddEmptyItem";
import EmptyStock from "./admin/features/empty_stock/EmptyStock";
import Sales from "./admin/features/ventes/Sales";
import Income from "./admin/features/finances/income/Income";
import Expense from "./admin/features/finances/expenses/Expense";
import AddExpense from "./admin/features/finances/expenses/AddExpense";
import AddIncome from "./admin/features/finances/income/AddIncome";
import Empty from "./features/stock/Empty";
import LoadingAvaris from "./admin/features/avaris/LoadingAvaris";
import LowStock from "./admin/features/stock/LowStock";
import Ristournes from "./admin/pages/Ristournes";
import StoreAvaris from "./admin/features/avaris/StoreAvaris";
import Reports from "./admin/pages/Reports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Login />} />

        {/* protected route */}

        {/* Employee routes */}
        <Route element={<ProtectedRoute role={"EMPLOYEE"} />}>
          <Route path="products" element={""}>
            <Route index element={<Stock />} />
            <Route path="create" element={<AddStockItem />} />
            <Route path="load" element={<StockLoad />} />
            <Route path="return" element={<ReturnLoad />} />
            <Route path="issues">
              <Route index element={<Issues />} />
              <Route path="create" element={<AddAvarisItem />} />
            </Route>
            <Route path="empty">
              <Route index element={<Empty />} />
              <Route path="create" element={<AddEmptyItem />} />
            </Route>
          </Route>

          <Route path="sales">
            <Route index element={<Invoice />} />
            <Route path="createInvoice" element={<CreateInvoice />} />
            <Route path=":invoiceId" element={<InvoiceView />} />
          </Route>
        </Route>

        {/* Admin routes */}

        <Route element={<ProtectedRoute role={"ADMINISTRATOR"} />}>
          <Route path="admin" element={<RLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="ristourn" element={<Ristournes />} />
            <Route path="generate reports" element={<Reports />} />

            <Route path="stock faible" element={<LowStock />} />
            <Route path="avaris livraison" element={<LoadingAvaris />} />
            <Route path="avaris magasin" element={<StoreAvaris />} />

            <Route path="sales">
              <Route index element={<Sales />} />
              <Route path=":invoiceId" element={<InvoiceView />} />
            </Route>

            <Route path="issue">
              <Route index element={<Avaris />} />
              <Route path="create" element={<AddAvarisItem />} />
            </Route>

            <Route path="empty">
              <Route index element={<EmptyStock />} />
              <Route path="create" element={<AddEmptyItem />} />
            </Route>

            <Route path="products">
              <Route index element={<Products />} />
              <Route path="create" element={<AddProduct />} />
            </Route>

            <Route path="income">
              <Route index element={<Income />} />
              <Route path="create" element={<AddIncome />} />
            </Route>

            <Route path="expenses">
              <Route index element={<Expense />} />
              <Route path="create" element={<AddExpense />} />
            </Route>

            <Route path="purchase">
              <Route index element={<Purchase />} />
              <Route path="create" element={<CreatePurchase />} />
            </Route>

            <Route path="stock">
              <Route index element={<AStock />} />
              <Route path="create" element={<AddStockItem />} />
            </Route>

            <Route path="load" element={<StockLoad />} />
            <Route path="return" element={<ReturnLoad />} />
            <Route path="team report" element={<Reconciliation />} />

            <Route path="users">
              <Route index element={<Users />} />
              <Route path="create" element={<AddUser />} />
            </Route>

            <Route path="teams">
              <Route index element={<Teams />} />
              <Route path="create" element={<CreateTeam />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
