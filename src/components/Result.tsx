import React, { useEffect, useState } from "react";
import { ILeaderBoard, IUser } from "../types";
import GetProfile from "./GetProfile";

const Result = ({
  currentUser,
  leaderBoard,
}: {
  currentUser: IUser;
  leaderBoard: IUser[];
}) => {
  return (
    <div className="bg-theme-yellow h-full flex items-center justify-center text-lg">
      <div className="rounded bg-[#FFF] text-center p-2">
        <p className="text-xl pb-1">Result</p>
        {leaderBoard.map((member, index) => (
          <div
            className={"flex items-center p-1 justify-between pr-4"}
            key={member.id}
          >
            <div className="flex items-center gap-1">
              <GetProfile emoji={member.emoji} className={"text-2xl p-1"} />
              <p>
                {member.name}{" "}
                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : ""}
                {currentUser.id == member.id ? " (Me) " : ""}
              </p>
            </div>

            <span className="inline-flex items-center rounded-md bg-[#f0fdf4] ml-4 px-2 py-1 text-xs font-medium text-[#15803d] ring-1 ring-inset ring-[#16a34a]/20">
              {member.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Result;
