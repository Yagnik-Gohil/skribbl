import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import Button from "./Button";
import { decrement, increment, incrementAsync, incrementByAmount, reset } from "../state/counter/counterSlice";

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  const handleIncrement = () => {
    // dispatch(increment());
    // dispatch(incrementByAmount(1));
    dispatch(incrementAsync(1));
  };

  const handleDecrement = () => {
    dispatch(decrement());
  };

  const handleReset = () => {
    dispatch(reset());
  }

  return (
    <div>
      <div>{count}</div>
      <br></br>
      <div className="flex gap-2 justify-center">
        <Button
          name="-"
          onClick={handleDecrement}
          className="bg-theme-yellow w-16 h-12 rounded font-bold text-[#000] text-2xl"
        />
        <Button
          name="Reset"
          onClick={handleReset}
          className="bg-theme-yellow w-32 h-12 rounded font-bold text-[#000] text-2xl"
        />
        <Button
          name="+"
          onClick={handleIncrement}
          className="bg-theme-yellow w-16 h-12 rounded font-bold text-[#000] text-2xl"
        />
      </div>
    </div>
  );
};

export default Counter;
