import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useNavigate } from "react-router-dom";
import Member from "../components/Member";
import Chat from "../components/Chat";
import Canvas from "../components/Canvas";

const PlayGround = () => {
  const navigate = useNavigate();
  const member = useSelector((state: RootState) => state.member.currentMember);
  const memberList = useSelector((state: RootState) => state.member.list);

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
      <div className="container flex justify-between h-[80%] border border-[#000] bg-[#FFF] rounded-lg">
        <div className="w-[20%] flex flex-col gap-2 p-2 overflow-y-scroll">
          {memberList.map((member) => (
            <Member member={member} />
          ))}
        </div>
        <div className="w-[55%] border-x border-[#000]">
          <Canvas/>
        </div>
        <div className="w-[25%]">
          <Chat/>
        </div>
      </div>
    </div>
  );
};

export default PlayGround;
