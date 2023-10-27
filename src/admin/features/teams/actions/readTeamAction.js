import api from "../../../../app/api/axios";
import { setTeams } from "../teamSlice";

const readTeamAction = () => async (dispatch) => {
  const response = await api.get("/api/all/groups/", {});

  const team = response.data;
  dispatch(setTeams(team));
  console.log(team);
};

export default readTeamAction;
