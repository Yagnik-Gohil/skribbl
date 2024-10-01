import React from "react";
import GetProfile from "./GetProfile";
import { IUser } from "../types";

const Member = ({
  isMe,
  member,
  isCurrentTurn,
}: {
  isMe: boolean;
  member: IUser;
  isCurrentTurn: boolean;
}) => {
  return (
    <div
      className={
        "flex items-center border rounded p-1 justify-between pr-4 bg-[#FFF]"
      }
      key={member.id}
    >
      <div className="flex items-center gap-1">
        <GetProfile emoji={member.emoji} className={"text-4xl p-1"} />
        <p>
          {member.name} {member.admin ? " 👑 " : ""}
          {isCurrentTurn ? " 🖍️ " : ""}
          {isMe ? " (Me) " : ""}
        </p>
      </div>

      <span
        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          member.score >= 0
            ? "text-[#15803d] bg-[#f0fdf4] ring-[#16a34a]/20"
            : "text-theme-red bg-[#fdf0f0] ring-[#7f1d1d]/20"
        }`}
      >
        {member.score}
      </span>
    </div>
  );
};

export default Member;
