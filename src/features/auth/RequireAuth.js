import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { userLoginState } from "./authSlice";

const RequireAuth = ({ role }) => {
  const isLoggedIn = useSelector(userLoginState);
  const location = useLocation();

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="login" state={{ from: location }} replace />
  );
};
export default RequireAuth;
