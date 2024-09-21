import React from "react";
import GetProfile from "./GetProfile";

const Member = ({
  member,
}: {
  member: { id:string; name: string; admin: boolean; score: number, emoji: string };
}) => {
  return (
    <div
      className={"flex items-center border rounded p-1 justify-between pr-4 bg-[#FFF]"}
      key={member.id}
    >
      <div className="flex items-center gap-1">
        <GetProfile emoji={member.emoji} className={"text-5xl p-1"} />
        <p>
          {member.name} {member.admin ? "👑" : ""}
          {true ? "🖍️" : ""}
        </p>
      </div>

      <span className="inline-flex items-center rounded-md bg-[#f0fdf4] px-2 py-1 text-xs font-medium text-[#15803d] ring-1 ring-inset ring-[#16a34a]/20">
        {member.score}
      </span>
    </div>
  );
};

export default Member;
