import api from "../../../app/api/axios";
import { updateUser } from "../userSlice";

const editUserActon = (user) => async (dispatch) => {
  const response = await api.put(`/api/current/user/${user._id}`, user);

  const userUpdate = response.data;
  dispatch(updateUser(userUpdate));
  console.log(userUpdate);
};

export default editUserActon;
