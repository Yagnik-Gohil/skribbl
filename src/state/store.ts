import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./counter/counterSlice";
import memberSlice from "./playground/memberSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    member: memberSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
