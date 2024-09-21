import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
  id: number;
  room: number;
  admin: boolean;
  name: string;
  score: number;
}

interface DefaultState {
  currentMember: userState;
  list: userState[];
}

const defaultState: DefaultState = {
  currentMember: {
    id: 0,
    room: 0,
    admin: false,
    name: '',
    score: 0,
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

      state.list = [state.currentMember]
    },
  },
});

export const { create } = memberSlice.actions;

export default memberSlice.reducer;
