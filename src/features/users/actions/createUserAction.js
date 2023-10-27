import { createUser } from "../userSlice";
import api from "../../../app/api/axios";

export const createUserAction =
  (name, roles, category, tax_system, phone, location, group, password) =>
  async (dispatch) => {
    const response = await api.post("/api/users", {
      name,
      roles,
      category,
      tax_system,
      phone,
      location,
      group,
      password,
    });

    const user = response.data[0].userId;
    dispatch(createUser(user));
    console.log(user);
  };
