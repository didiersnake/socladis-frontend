import api from "../../../../app/api/axios";
import { updateTeams } from "../teamSlice";

const editTeamAction = (item) => async (dispatch) => {
  const response = await api.put(`//${item._id}`, item);

  const teamUpdate = response.data;
  dispatch(updateTeams(teamUpdate));
  console.log(teamUpdate);
};

export default editTeamAction;
