import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teams: [],
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeams(state, action) {
      state.teams = action.payload;
    },
    createTeams(state, action) {
      state.teams.push(action.payload);
    },
    updateTeams(state, action) {
      const productIndex = state.teams.findIndex(
        (product) => product._id === action.payload._id
      );
      state.teams[productIndex] = action.payload;
    },
    deleteTeams(state, action) {
      state.teams = state.teams.filter(
        (product) => product._id !== action.payload._id
      );
    },
  },
});
export const { setTeams, createTeams, updateTeams, deleteTeams } =
  teamSlice.actions;
export const selectAllTeams = (state) => state.team.teams;
export default teamSlice.reducer;
