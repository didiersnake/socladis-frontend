import { logout } from "../authSlice";

export const logoutAction = () => (dispatch) => {
  dispatch(logout());
};
