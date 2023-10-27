import api from "../../../app/api/axios";
import { login } from "../authSlice";

let response;
export const loginAction = (name, password) => async (dispatch) => {
  const data = {
    name,
    password,
  };

  response = await api.post("/api/login", data);

  const token = response.data.token;
  const user = response.data.user;

  dispatch(login({ token, user }));
};

export const redirect = () => {
  let access;
  const role = response.data.user.roles;
  const category = response.data.user.category;
  console.log(category);
  if (role === "ADMINISTRATOR") {
    access = "admin";
  } else {
    category === "stock" ? (access = "stock") : (access = "ventes");
  }

  console.log(role);
  return access;
};
