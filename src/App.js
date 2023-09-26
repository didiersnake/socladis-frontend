import { Layout } from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import Login from "./features/auth/Login";
import RequireAuth from "./features/auth/RequireAuth";
import Dashboard from "./admin/pages/Dashboard";
import Stock from "./pages/stock/Stock";
import Issues from "./pages/stock/Issues";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Login />} />

        <Route path="product" element={""}>
          <Route index element={<Stock />} />
          <Route path="issues" element={<Issues />} />
        </Route>

        {/* protected route */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
