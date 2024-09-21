import React from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Counter from "../components/Counter";

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="h-dvh w-dvw flex items-center justify-center font-bold text-2xl text-[#FFF]">
      <div className="text-center">
        <Counter/>
        <br></br>
        <p>Page Not Found</p>
        <br></br>
        <Button
          name="Go Home"
          onClick={handleClick}
          className="bg-theme-yellow px-10 py-5 rounded font-bold text-[#000]"
        ></Button>
      </div>
    </div>
  );
};

export default NotFound;
