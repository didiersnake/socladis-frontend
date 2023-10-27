import React from "react";
import api from "../../../../app/api/axios";
import { createTeams } from "../teamSlice";

const addTeamAction = (name, members, date) => async (dispatch) => {
  const response = await api.post("/api/new/groups", {
    name,
    members,
    date,
  });

  const new_team = response.data[0].groupInfo;
  dispatch(createTeams(new_team));
  console.log(new_team);
};

export default addTeamAction;
