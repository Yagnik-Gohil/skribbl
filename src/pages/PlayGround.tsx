import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useNavigate } from "react-router-dom";
import Chat from "../components/Chat";
import Canvas from "../components/Canvas";
import Configuration from "../components/Configuration";
import Button from "../components/Button";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket";
import MemberList from "../components/MemberList";
import SelectWord from "../components/SelectWord";
import { IGameState, IUser, IWordSelected } from "../types";
import Word from "../components/Word";

const PlayGround = () => {
  const navigate = useNavigate();
  const member = useSelector((state: RootState) => state.member);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isSelectingWord, setIsSelectingWord] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [randomWord, setRandomWord] = useState("Random Word");
  const [isGuessed, setIsGuessed] = useState(false);
  const [hintIndex, setHintIndex] = useState([]);
  const [wordList, setWordList] = useState([]);
  const [currentTurn, setCurrentTurn] = useState<IUser>(member);

  useEffect(() => {
    if (!member.room) {
      navigate("/");
      return;
    }

    const socket = connectSocket(); // Connect the socket when the component mounts

    if (socket) {
      console.log("Hello");
      setIsSocketConnected(true); // Set connection state

      // Emit join event
      socket.emit("join", member);

      socket.on(
        "joined",
        (data: {
          user: IUser;
          members: IUser[];
          gameState: IGameState;
          currentTurn: IUser;
        }) => {
          console.log(data);
          setCurrentTurn(data.currentTurn);
          if (data.gameState.status == "lobby") {
            setIsSelectingWord(false);
            setIsGameStarted(false);
          } else if (data.gameState.status == "word-selection") {
            setIsSelectingWord(true);
            setIsGameStarted(false);
          } else {
            setIsSelectingWord(false);
            setIsGameStarted(true);
          }
        }
      );

      socket.on("word-selection", (data) => {
        setWordList(data.list);
        setCurrentTurn(data.currentTurn);
        setIsSelectingWord(true);
      });

      socket.on("game-started", (data: IWordSelected) => {
        setIsGameStarted(true);
        setIsSelectingWord(false);
        setRandomWord(data.word);
      });

      return () => {
        socket.off("game-started");
        socket.off("select-word");
      };
    }
  }, [member, navigate]);

  const handleLeaveRoom = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit("leave", member); // Emit the leave event
    }
    navigate("/");
  };

  return (
    <div className="h-dvh w-dvw flex items-center justify-center text-[#000]">
      <div className="container flex flex-col h-[90%] gap-1">
        <div className="flex justify-between items-center bg-[#FFF] rounded-lg px-3 py-2">
          <p>
            <span className="text-3xl">⏱️:</span>{" "}
            <span className="text-3xl font-bold">60</span>
          </p>
          <p>Round 1 of 3</p>
          <div className="text-center">
            <span className="text-xs">Guess This</span>
            <div className="flex">
              <Word
                word={randomWord}
                isGuessed={member.id == currentTurn.id || isGuessed}
                hints={hintIndex}
              />
              <span className="ml-2 text-sm font-normal">
                {randomWord
                  .split(" ")
                  .map((word) => word.length)
                  .join(" ")}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              name="👍"
              className="bg-[#16a34a] w-10 h-10 rounded-full flex items-center justify-center select-none"
            />
            <Button
              name="👎"
              className="bg-theme-red w-10 h-10 rounded-full flex items-center justify-center select-none"
            />
          </div>
          <p>
            Room ID: <span className="font-bold">{member.room}</span>
          </p>
          <Button name="⚙️" className="text-3xl select-none"></Button>
        </div>
        <div className="flex justify-between h-full border border-[#000] bg-[#FFF] rounded-lg">
          <div className="w-[20%]">
            {isSocketConnected && <MemberList currentTurn={currentTurn} />}
          </div>
          <div className="w-[60%] border-x border-[#000]">
            {isSocketConnected && !isGameStarted && !isSelectingWord && (
              <Configuration member={member} />
            )}
            {isSocketConnected &&
              !isGameStarted &&
              isSelectingWord &&
              currentTurn && (
                <SelectWord
                  member={member}
                  currentTurn={currentTurn}
                  wordList={wordList}
                />
              )}
            {isSocketConnected && isGameStarted && !isSelectingWord && (
              <Canvas />
            )}
          </div>
          <div className="w-[20%]">{isSocketConnected && <Chat />}</div>
        </div>
        <div className="flex justify-between rounded-lg">
          <Button
            name="Leave Room"
            onClick={handleLeaveRoom}
            className="bg-theme-yellow"
          />
          <div className="bg-theme-yellow">Color Selection</div>
          <div className="bg-theme-yellow">Eraser</div>
          <div className="bg-theme-yellow">Clear Screen</div>
        </div>
      </div>
    </div>
  );
};

export default PlayGround;
