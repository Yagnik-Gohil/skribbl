import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import Member from "./Member";
import { getSocket } from "../services/socket";
import { IUser } from "../types";

const MemberList = ({ currentTurn }: { currentTurn: IUser }) => {
  const member = useSelector((state: RootState) => state.member);

  const [memberList, setMemberList] = useState([member]);

  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      // Listen for "joined" event and add a system message to the chat
      socket.on("joined", (data) => {
        setMemberList(data.members);
      });

      // Listen for "left" event and add a system message to the chat
      socket.on("left", (data) => {
        setMemberList(data.members);
      });

      return () => {
        socket.off("joined");
        socket.off("left");
      };
    }
  }, []);

  return (
    <div className="foverflow-hidden h-full">
      <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[670px]">
        {memberList.map((member) => (
          <Member
            key={member.id}
            member={member}
            isCurrentTurn={member.id == currentTurn.id}
          />
        ))}
      </div>
    </div>
  );
};

export default MemberList;
