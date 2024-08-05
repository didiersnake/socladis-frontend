import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    createUser(state, action) {
      state.users.push(action.payload);
    },
    updateUser(state, action) {
      const userIndex = state.users.findIndex((user) => user._id === action.payload._id);
      state.users[userIndex] = action.payload;
    },
    deleteUser(state, action) {
      state.users = state.users.filter((user) => user._id !== action.payload._id);
    },
  },
});

export const { setUsers, createUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;

export const selectAllUser = (state) => state.user.users;
export const selectUserById = (state, userId) => {
  return state.user.users.find((user) => user._id === userId);
};
