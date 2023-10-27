import { useLocation, Navigate, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUserRoles, userLoginState } from "../features/auth/authSlice";

const ProtectedRoute = ({ role }) => {
  const isLoggedIn = useSelector(userLoginState);
  const userRoles = useSelector(selectUserRoles);
  const location = useLocation();

  return isLoggedIn && userRoles === role ? (
    <Outlet />
  ) : (
    <Navigate to="login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
