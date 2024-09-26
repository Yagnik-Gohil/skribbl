import React, { useEffect, useState } from "react";

const Timer = ({
  drawTime,
  isRoundStarted,
  setIsShowLeaderBoard,
  setIsRoundStarted,
}: {
  drawTime: number;
  isRoundStarted: boolean;
  setIsShowLeaderBoard: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRoundStarted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [timer, setTimer] = useState(drawTime);

  // Countdown logic
  useEffect(() => {
    let countdown;

    if (isRoundStarted) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup interval on unmount or when the round stops
    return () => {
      if (countdown) {
        clearInterval(countdown);
      }
    };
  }, [isRoundStarted]);

  // Reset timer when round starts or drawTime changes
  useEffect(() => {
    if (isRoundStarted) {
      setTimer(drawTime);
    }
  }, [drawTime, isRoundStarted]);

  // Trigger the leaderboard when the timer reaches 0
  useEffect(() => {
    if (timer === 0) {
      setIsShowLeaderBoard(true); // Trigger parent state change after rendering
      setIsRoundStarted(false);
    }
  }, [timer, setIsShowLeaderBoard]);

  return (
    <p>
      <span className="text-3xl">⏱️:</span>{" "}
      <span className="text-3xl font-bold">{timer}</span>
    </p>
  );
};

export default Timer;
