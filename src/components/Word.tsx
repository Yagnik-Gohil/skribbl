import React from "react";

const Word = ({
  word,
  isGuessed,
  hints,
}: {
  word: string;
  isGuessed: boolean;
  hints: number[];
}) => {
  const wordArray = word.split(""); // Split into characters including spaces

  return (
    <div className="flex flex-wrap">
      {wordArray.map((char, index) => (
        <span key={index} className="text-lg font-bold">
          {/* Display the character if guessed or if its index is in hints */}
          {isGuessed || hints.includes(index)
            ? char === " " // Add visible space between words
              ? "\u00A0\u00A0\u00A0" // Extra space between words
              : char
            : char === " " // Handle space between underscores for words
            ? "\u00A0\u00A0\u00A0" // Extra space for hidden words
            : "\u00A0_\u00A0"}
        </span>
      ))}
    </div>
  );
};

export default Word;
