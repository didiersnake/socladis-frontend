import { setUsers } from "../userSlice";
import api from "../../../app/api/axios";

const readUsersAction = () => async (dispatch) => {
  const response = await api.get("/api/all/user", {});

  const users = response.data;
  dispatch(setUsers(users));
  console.log(users);
};

export default readUsersAction;
