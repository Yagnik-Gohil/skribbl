import React, { useEffect, useState } from "react";

const Word = ({
  word,
  isGuessed,
  hints,
  drawTime,
  isRoundStarted,
}: {
  word: string;
  isGuessed: boolean;
  hints: number;
  drawTime: number;
  isRoundStarted: boolean;
}) => {
  const wordArray = word.split(""); // Split the word into characters including spaces
  const [hintIndex, setHintIndex] = useState<number[]>([]); // State to track which indices to reveal as hints

  useEffect(() => {
    if (isRoundStarted && hints > 0 && drawTime > 0) {
      // Clear previous hints when a new round starts
      setHintIndex([]);

      const hintInterval = (drawTime * 1000) / hints; // Time interval for each hint reveal in milliseconds

      // Get valid indices (ignore spaces)
      const unrevealedIndices = wordArray
        .map((char, index) => (char !== " " ? index : -1)) // Filter out spaces
        .filter((index) => index !== -1);

      // Shuffle indices for random hint reveal
      const shuffledIndices = [...unrevealedIndices].sort(
        () => Math.random() - 0.5
      );

      let currentHint = 0;

      // Set up the interval to reveal hints
      const interval = setInterval(() => {
        setHintIndex((prevHints) => [
          ...prevHints,
          shuffledIndices[currentHint],
        ]); // Reveal one random character at a time

        currentHint += 1;

        if (currentHint >= hints || currentHint >= shuffledIndices.length) {
          clearInterval(interval); // Clear interval once all hints are revealed
        }
      }, hintInterval);

      // Cleanup interval on component unmount or when round is stopped
      return () => clearInterval(interval);
    }
  }, [isRoundStarted, hints, drawTime, word]); // Dependency on `word`, not `wordArray`

  return (
    <div className="flex flex-wrap">
      {wordArray.map((char, index) => (
        <span key={index} className="text-lg font-bold">
          {/* Display the character if guessed or if its index is in hintIndex */}
          {isGuessed || hintIndex.includes(index)
            ? char === " "
              ? "\u00A0\u00A0\u00A0" // Extra space between words
              : char
            : char === " "
            ? "\u00A0\u00A0\u00A0" // Extra space for hidden words
            : "\u00A0_\u00A0"}
        </span>
      ))}
    </div>
  );
};

export default Word;
