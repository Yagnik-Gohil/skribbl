import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
  id: string;
  room: string;
  admin: boolean;
  name: string;
  score: number;
  emoji: string;
}

const defaultState: userState = {
  id: "",
  room: "",
  admin: false,
  name: "",
  score: 0,
  emoji: "",
};

const memberSlice = createSlice({
  name: "member",
  initialState: defaultState,
  reducers: {
    create: (state, action) => {
      state.id = action.payload.id;
      state.room = action.payload.room;
      state.admin = action.payload.admin;
      state.name = action.payload.name;
      state.emoji = action.payload.emoji;
    },
  },
});

export const { create } = memberSlice.actions;

export default memberSlice.reducer;
