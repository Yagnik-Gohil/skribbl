import React, { useEffect, useState } from "react";
import Button from "./Button";
import { getSocket } from "../services/socket";
import { IUser } from "../types";

const SelectWord = ({
  member,
  currentTurn,
  wordList,
}: {
  member: IUser;
  currentTurn: IUser;
  wordList: string[];
}) => {
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
          <p className="text-center mx-auto">
            {currentTurn?.name} is choosing the word
          </p>
        )}
      </div>
    </div>
  );
};

export default SelectWord;
