import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useNavigate } from "react-router-dom";
import Member from "../components/Member";
import Chat from "../components/Chat";
import Canvas from "../components/Canvas";
import Configuration from "../components/Configuration";
import Button from "../components/Button";

const PlayGround = () => {
  const navigate = useNavigate();
  const member = useSelector((state: RootState) => state.member.currentMember);
  const memberList = useSelector((state: RootState) => state.member.list);
  const isGameStarted = false;

  useEffect(() => {
    if (!member.room) {
      navigate("/");
    }

    if (member.admin) {
      // Create Room Logic
    } else {
      // Join Room Logic
    }
  }, [member.room, navigate]);

  return (
    <div className="h-dvh w-dvw flex items-center justify-center text-[#000]">
      <div className="container flex flex-col h-[80%] gap-1">
        <div className="flex justify-between items-center bg-[#FFF] rounded-lg px-3 py-2">
          <p><span className="text-3xl">⏱️:</span> <span className="text-3xl font-bold">60</span></p>
          <p>Round 1 of 3</p>
          <div className="text-center">
            <span className="text-xs">Guess This</span>
            <div className="flex">
              <p className="font-bold text-lg">Random Word</p>{" "}
              <span className="ml-2 text-sm font-normal">6 4</span>
            </div>
          </div>
          <div className="flex gap-3">
            <p className="bg-[#16a34a] w-10 h-10 rounded-full flex items-center justify-center select-none">👍</p>
            <p className="bg-theme-red w-10 h-10 rounded-full flex items-center justify-center select-none">👎</p>
          </div>
          <p>
            Room ID: <span className="font-bold">{member.room}</span>
          </p>
          <Button
            name="⚙️"
            className="text-3xl"
          ></Button>
        </div>
        <div className="flex justify-between h-full border border-[#000] bg-[#FFF] rounded-lg">
          <div className="w-[20%] flex flex-col gap-2 p-2 overflow-y-scroll">
            {memberList.map((member) => (
              <Member member={member} />
            ))}
          </div>
          <div className="w-[55%] border-x border-[#000]">
            {isGameStarted ? <Canvas /> : <Configuration />}
          </div>
          <div className="w-[25%]">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayGround;
