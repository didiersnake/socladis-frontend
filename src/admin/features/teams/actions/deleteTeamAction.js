import React from "react";
import api from "../../../../app/api/axios";
import { deleteTeams } from "../teamSlice";

const deleteTeamAction = (id) => async (dispatch) => {
  const response = await api.delete(`/api/current/group/${id}`, {});

  dispatch(deleteTeams(id));
};

export default deleteTeamAction;
