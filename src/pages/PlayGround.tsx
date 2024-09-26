import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { useNavigate } from "react-router-dom";
import Chat from "../components/Chat";
import Canvas from "../components/Canvas";
import Configuration from "../components/Configuration";
import Button from "../components/Button";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket";
import MemberList from "../components/MemberList";
import SelectWord from "../components/SelectWord";
import { IJoined, ILeft, IUser, IWordSelected, IWordSelection } from "../types";
import Word from "../components/Word";
import Timer from "../components/Timer";
import { makeAdmin } from "../state/playground/memberSlice";
import LeaderBoard from "../components/LeaderBoard";

const PlayGround = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const member = useSelector((state: RootState) => state.member);
  const [memberList, setMemberList] = useState([member]);
  const [isRoundStarted, setIsRoundStarted] = useState(false);
  const [isSelectingWord, setIsSelectingWord] = useState(false);
  const [isShowLeaderBoard, setIsShowLeaderBoard] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [word, setWord] = useState("Random Word");
  const [wordCount, setWordCount] = useState(2);
  const [hintIndex, setHintIndex] = useState([]);
  const [currentTurn, setCurrentTurn] = useState<IUser>({
    admin: false,
    emoji: "",
    id: "",
    name: "",
    room: "",
    score: 0,
  });

  const [isGuessed, setIsGuessed] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [rounds, setRounds] = useState(3);
  const [drawTime, setDrawTime] = useState(60);

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

      socket.on("joined", (data: IJoined) => {
        setMemberList(data.members);
        setCurrentTurn(data.currentTurn);
        setRounds(data.gameState.rounds);
        setCurrentRound(data.gameState.currentRound);
        setDrawTime(data.gameState.drawTime);
        setWord(data.gameState.word);

        if (data.gameState.status == "lobby") {
          setIsSelectingWord(false);
          setIsRoundStarted(false);
        } else if (data.gameState.status == "word-selection") {
          setIsSelectingWord(true);
          setIsRoundStarted(false);
        } else {
          setIsSelectingWord(false);
          setIsRoundStarted(true);
        }
      });

      socket.on("word-selection", (data: IWordSelection) => {
        setCurrentTurn(data.currentTurn);
        setWordCount(data.gameState.wordCount);
        setRounds(data.gameState.rounds);
        setCurrentRound(data.gameState.currentRound);
        setDrawTime(data.gameState.drawTime);

        setIsSelectingWord(true);
      });

      socket.on("game-started", (data: IWordSelected) => {
        setIsRoundStarted(true);
        setIsSelectingWord(false);
        setWord(data.word);
      });

      // Listen for "left" event and add a system message to the chat
      socket.on("left", (data: ILeft) => {
        console.log(data);

        const admin = data.members.find((member) => member.admin);
        if (admin && admin.id && member.id == admin.id && !member.admin) {
          // Make current user to admin.
          dispatch(makeAdmin());
        }

        setMemberList(data.members);
        setCurrentTurn(data.currentTurn);
      });

      return () => {
        socket.off("joined");
        socket.off("word-selection");
        socket.off("game-started");
        socket.off("left");
        disconnectSocket(); // Disconnect the socket on unmount
      };
    }
  }, [navigate]);

  const handleLeaveRoom = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit("leave", member); // Emit the leave event
      disconnectSocket();
    }
    navigate("/");
  };

  console.log(
    "\nisSocketConnected",
    isSocketConnected,
    "\nisSelectingWord",
    isSelectingWord,
    "\nisRoundStarted",
    isRoundStarted,
    "\nisShowLeaderBoard",
    isShowLeaderBoard
  );

  return (
    <div className="h-dvh w-dvw flex items-center justify-center text-[#000]">
      <div className="container flex flex-col h-[90%] gap-1">
        <div className="flex justify-between items-center bg-[#FFF] rounded-lg px-3 py-2">
          <Timer
            drawTime={drawTime}
            isRoundStarted={isRoundStarted}
            setIsShowLeaderBoard={setIsShowLeaderBoard}
            setIsRoundStarted={setIsRoundStarted}
          />
          <p>
            Round {currentRound} of {rounds}
          </p>
          <div className="text-center">
            <span className="text-xs">Guess This</span>
            <div className="flex">
              <Word
                word={word}
                isGuessed={member.id == currentTurn.id || isGuessed}
                hints={hintIndex}
              />
              <span className="ml-2 text-sm font-normal">
                {word
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
            {isSocketConnected && (
              <MemberList memberList={memberList} currentTurn={currentTurn} />
            )}
          </div>
          <div className="w-[60%] border-x border-[#000]">
            {isSocketConnected &&
              !isSelectingWord &&
              !isRoundStarted &&
              !isShowLeaderBoard && <Configuration member={member} />}
            {isSocketConnected &&
              isSelectingWord &&
              !isRoundStarted &&
              !isShowLeaderBoard &&
              currentTurn && (
                <SelectWord
                  member={member}
                  currentTurn={currentTurn}
                  wordCount={wordCount}
                />
              )}
            {isSocketConnected &&
              !isSelectingWord &&
              isRoundStarted &&
              !isShowLeaderBoard && <Canvas />}
            {isSocketConnected &&
              !isSelectingWord &&
              !isRoundStarted &&
              isShowLeaderBoard && <LeaderBoard />}
          </div>
          <div className="w-[20%]">
            {isSocketConnected && (
              <Chat
                member={member}
                word={word}
                isGuessed={isGuessed}
                setIsGuessed={setIsGuessed}
              />
            )}
          </div>
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
