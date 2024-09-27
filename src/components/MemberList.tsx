import React from "react";
import Member from "./Member";
import { IUser } from "../types";

const MemberList = ({
  currentUser,
  memberList,
  currentTurn,
}: {
  currentUser: IUser;
  memberList: IUser[];
  currentTurn: IUser;
}) => {
  return (
    <div className="overflow-hidden h-full">
      <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[670px]">
        {memberList.map((member) => (
          <Member
            isMe={currentUser.id == member.id}
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
