import { Layout } from "./components/Layout";
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const Stock = lazy(() => import("./features/stock/Stock"));
const AStock = lazy(() => import("./admin/features/stock/AStock"));
const Issues = lazy(() => import("./features/stock/Avaris"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Login = lazy(() => import("./features/auth/Login"));
const RLayout = lazy(() => import("./admin/components/RLayout"));
const Users = lazy(() => import("./features/users/Users"));
const AddUser = lazy(() => import("./features/users/AddUser"));
const Products = lazy(() => import("./admin/features/product/Products"));
const AddProduct = lazy(() => import("./admin/features/product/AddProduct"));
const AddStockItem = lazy(() => import("./admin/features/stock/AddStockItem"));
const CreateInvoice = lazy(() => import("./features/sales/CreateInvoice"));
const Invoice = lazy(() => import("./features/sales/Invoice"));
const Avaris = lazy(() => import("./admin/features/avaris/Avaris"));
const Teams = lazy(() => import("./admin/features/teams/Teams"));
const CreateTeam = lazy(() => import("./admin/features/teams/CreateTeam"));
const AddAvarisItem = lazy(() =>
  import("./admin/features/avaris/AddAvarisItem")
);
const InvoiceView = lazy(() => import("./features/sales/InvoiceView"));
const Purchase = lazy(() => import("./admin/features/purchase/Purchase"));
const CreatePurchase = lazy(() =>
  import("./admin/features/purchase/CreatePurchase")
);
const AddEmptyItem = lazy(() =>
  import("./admin/features/empty_stock/AddEmptyItem")
);
const EmptyStock = lazy(() =>
  import("./admin/features/empty_stock/EmptyStock")
);
const Sales = lazy(() => import("./admin/features/ventes/Sales"));
const Income = lazy(() => import("./admin/features/finances/income/Income"));
const Expense = lazy(() =>
  import("./admin/features/finances/expenses/Expense")
);
const AddExpense = lazy(() =>
  import("./admin/features/finances/expenses/AddExpense")
);
const AddIncome = lazy(() =>
  import("./admin/features/finances/income/AddIncome")
);
const Empty = lazy(() => import("./features/stock/Empty"));
const LoadingAvaris = lazy(() =>
  import("./admin/features/avaris/LoadingAvaris")
);
const LowStock = lazy(() => import("./admin/features/stock/LowStock"));
const Ristournes = lazy(() => import("./admin/pages/Ristournes"));
const StoreAvaris = lazy(() => import("./admin/features/avaris/StoreAvaris"));
const Reports = lazy(() => import("./admin/pages/Reports"));

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
