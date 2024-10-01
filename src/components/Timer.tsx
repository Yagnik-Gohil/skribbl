import React, { useEffect, useState } from "react";

// Import the clock ticking sound
import clockSound from "../assets/clock.mp3";

const Timer = ({
  drawTime,
  isRoundStarted,
}: {
  drawTime: number;
  isRoundStarted: boolean;
}) => {
  const [timer, setTimer] = useState(drawTime);

  // Sound reference for ticking
  const clockTicking = new Audio(clockSound);

  // Countdown logic
  useEffect(() => {
    let countdown;

    if (isRoundStarted) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) {
            // Play sound when the timer reaches the last 10 seconds
            if (prev === 11) {
              clockTicking.play().catch((error) => console.error("Audio playback failed:", error));
            }
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
      // Stop the ticking sound if the component unmounts
      clockTicking.pause();
      clockTicking.currentTime = 0;
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
