import React from "react";
import { IUser } from "../types";
import GetProfile from "./GetProfile";
import Button from "./Button";
import { getSocket } from "../services/socket";

const Result = ({
  currentUser,
  leaderBoard,
  member,
}: {
  currentUser: IUser;
  leaderBoard: IUser[];
  member: IUser;
}) => {
  const handleRestart = () => {
    const socket = getSocket();

    if (socket) {
      socket.emit("restart", member.room);
    }
  };

  return (
    <div className="bg-theme-yellow h-full flex flex-col items-center justify-center text-lg">
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

            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ml-2 ${
                member.score >= 0
                  ? "text-[#15803d] bg-[#f0fdf4] ring-[#16a34a]/20"
                  : "text-theme-red bg-[#fdf0f0] ring-[#7f1d1d]/20"
              }`}
            >
              {member.score}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-[#FFF]">
        {member.admin ? (
          <Button
            key="reset-btn"
            name="Restart"
            onClick={handleRestart}
            className="bg-theme-red px-4 py-2 rounded-md"
          />
        ) : (
          <p className="bg-theme-red px-4 py-2 rounded-md text-center mx-auto">
            Wait for the admin to restart the game
          </p>
        )}
      </div>
    </div>
  );
};

export default Result;
