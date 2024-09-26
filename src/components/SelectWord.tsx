import React from "react";
import Button from "./Button";
import { getSocket } from "../services/socket";
import { IUser } from "../types";
import getWordList from "../helpers/getWordList";

const SelectWord = ({
  member,
  currentTurn,
  wordCount,
}: {
  member: IUser;
  currentTurn: IUser;
  wordCount: number;
}) => {
  const wordList = getWordList(wordCount);

  const handleSelectWord = (e) => {
    const socket = getSocket();

    if (socket) {
      socket.emit("word-selected", {
        currentTurn: currentTurn,
        word: e.target.name,
      });
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-lg">
      {member.id !== currentTurn?.id && <p className="text-5xl select-none">⏳</p>}
      <div className="w-full max-w-md flex justify-between">
        {member.id == currentTurn?.id ? (
          wordList.map((word, index) => (
            <Button
              key={index}
              name={word}
              onClick={handleSelectWord}
              className="bg-theme-yellow px-4 py-2 rounded-md"
            />
          ))
        ) : (
          <p className="text-center mx-auto select-none mt-2">
            {currentTurn?.name} is choosing the word
          </p>
        )}
      </div>
    </div>
  );
};

export default SelectWord;
