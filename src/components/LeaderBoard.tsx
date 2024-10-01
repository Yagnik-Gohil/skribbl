import React, { useEffect, useState } from "react";
import { ILeaderBoard, IUser } from "../types";
import GetProfile from "./GetProfile";

const LeaderBoard = ({
  currentUser,
  leaderBoard,
}: {
  currentUser: IUser;
  leaderBoard: ILeaderBoard[];
}) => {
  const [timeLeft, setTimeLeft] = useState(10); // Countdown starts from 10 seconds
  const [progress, setProgress] = useState(100); // Progress bar starts at 100%

  // Countdown logic
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(countdown);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  // Emit "next-round" event when countdown reaches 0
  useEffect(() => {
    setProgress((timeLeft / 10) * 100);
  }, [timeLeft]);

  return (
    <div className="bg-theme-yellow h-full flex items-center justify-center text-lg">
      <div className="rounded bg-[#FFF] text-center p-2">
        <p className="text-xl pb-1">Leaderboard</p>
        <div className="w-[full] bg-theme-yellow h-1 rounded">
          <div
            className="bg-theme-red h-1 rounded transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
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
    </div>
  );
};

export default LeaderBoard;
