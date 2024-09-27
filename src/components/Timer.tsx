import React, { useEffect, useState } from "react";

const Timer = ({
  drawTime,
  isRoundStarted,
}: {
  drawTime: number;
  isRoundStarted: boolean;
}) => {
  const [timer, setTimer] = useState(drawTime);

  // Countdown logic
  useEffect(() => {
    let countdown;

    if (isRoundStarted) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(countdown); // Stop the timer when it reaches 0
            return 0;
          }
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

  return (
    <p>
      <span className="text-3xl">⏱️:</span>{" "}
      <span className="text-3xl font-bold">{timer}</span>
    </p>
  );
};

export default Timer;
