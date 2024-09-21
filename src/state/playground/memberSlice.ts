import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
  id: string;
  room: string;
  admin: boolean;
  name: string;
  score: number;
  emoji: string;
}

interface DefaultState {
  currentMember: userState;
  list: userState[];
}

const defaultState: DefaultState = {
  currentMember: {
    id: '',
    room: '',
    admin: false,
    name: '',
    score: 0,
    emoji: ''
  },
  list: [],
};

const memberSlice = createSlice({
  name: "member",
  initialState: defaultState,
  reducers: {
    create: (state, action) => {
      state.currentMember.id = action.payload.id;
      state.currentMember.room = action.payload.room;
      state.currentMember.admin = action.payload.admin;
      state.currentMember.name = action.payload.name;
      state.currentMember.emoji = action.payload.emoji;

      state.list = [state.currentMember]
    },
  },
});

export const { create } = memberSlice.actions;

export default memberSlice.reducer;
