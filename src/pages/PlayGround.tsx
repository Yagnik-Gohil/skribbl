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
import {
  IJoined,
  ILeaderBoard,
  ILeft,
  IUser,
  IWordSelected,
  IWordSelection,
} from "../types";
import Word from "../components/Word";
import Timer from "../components/Timer";
import { makeAdmin } from "../state/playground/memberSlice";
import LeaderBoard from "../components/LeaderBoard";
import Result from "../components/Result";
import joinSound from "../assets/join.mp3";
import leaveSound from "../assets/leave.mp3";
import resultSound from "../assets/result.mp3";
import startSound from "../assets/start.mp3";

const PlayGround = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const member = useSelector((state: RootState) => state.member);
  const [memberList, setMemberList] = useState([member]);

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isShowConfiguration, setIsShowConfiguration] = useState(true);
  const [isSelectingWord, setIsSelectingWord] = useState(false);
  const [isRoundStarted, setIsRoundStarted] = useState(false);
  const [isShowLeaderBoard, setIsShowLeaderBoard] = useState(false);
  const [isShowResult, setIsShowResult] = useState(false);
  const [isReacted, setIsReacted] = useState(false);

  const [word, setWord] = useState("Random Word");
  const [wordCount, setWordCount] = useState(2);
  const [hints, setHints] = useState(0);
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

  const [leaderBoard, setLeaderBoard] = useState<ILeaderBoard[]>([]);

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
        // Play the sound
        const audio = new Audio(joinSound);
        audio
          .play()
          .catch((error) => console.error("Audio playback failed:", error));

        setMemberList(data.members);
        setCurrentTurn(data.currentTurn);
        setRounds(data.gameState.rounds);
        setCurrentRound(data.gameState.currentRound);
        setDrawTime(data.gameState.drawTime - 1);
        setWord(data.gameState.word);
        setHints(data.gameState.hints);

        if (data.gameState.status == "lobby") {
          setIsShowConfiguration(true);
          setIsSelectingWord(false);
          setIsRoundStarted(false);
          setIsShowLeaderBoard(false);
          setIsShowResult(false);
        } else if (data.gameState.status == "word-selection") {
          setIsShowConfiguration(false);
          setIsSelectingWord(true);
          setIsRoundStarted(false);
          setIsShowLeaderBoard(false);
          setIsShowResult(false);
        } else {
          setIsShowConfiguration(false);
          setIsSelectingWord(false);
          setIsRoundStarted(true);
          setIsShowLeaderBoard(false); // manage this
          setIsShowResult(false); // manage this
        }
      });

      socket.on("restart", () => {
        setIsShowResult(false);
        setIsShowConfiguration(true);
      });

      socket.on("word-selection", (data: IWordSelection) => {
        setCurrentTurn(data.currentTurn);
        setMemberList(data.roomMembers);
        setWordCount(data.gameState.wordCount);
        setRounds(data.gameState.rounds);
        setCurrentRound(data.gameState.currentRound);
        setDrawTime(data.gameState.drawTime - 1);
        setHints(data.gameState.hints);

        setIsShowConfiguration(false);
        setIsSelectingWord(true);
        setIsRoundStarted(false);
        setIsShowLeaderBoard(false);
        setIsShowResult(false);
      });

      socket.on("game-started", (data: IWordSelected) => {
        // Play the sound
        const audio = new Audio(startSound);
        audio
          .play()
          .catch((error) => console.error("Audio playback failed:", error));
        setWord(data.word);

        setIsShowConfiguration(false);
        setIsSelectingWord(false);
        setIsRoundStarted(true);
        setIsShowLeaderBoard(false);
        setIsShowResult(false);
        setIsReacted(false);
      });

      socket.on("leader-board", (data: ILeaderBoard[]) => {
        setLeaderBoard(data);

        setIsShowConfiguration(false);
        setIsSelectingWord(false);
        setIsRoundStarted(false);
        setIsShowLeaderBoard(true);
        setIsShowResult(false);
        setIsGuessed(true);

        // Play the sound
        const audio = new Audio(resultSound);
        audio
          .play()
          .catch((error) => console.error("Audio playback failed:", error));
      });

      socket.on("result", (data: IUser[]) => {
        setMemberList(data);

        setIsShowConfiguration(false);
        setIsSelectingWord(false);
        setIsRoundStarted(false);
        setIsShowLeaderBoard(false);
        setIsShowResult(true);
        // Play the sound
        const audio = new Audio(resultSound);
        audio
          .play()
          .catch((error) => console.error("Audio playback failed:", error));
      });

      // Listen for "left" event and add a system message to the chat
      socket.on("left", (data: ILeft) => {
        const admin = data.members.find((member) => member.admin);
        if (admin && admin.id && member.id == admin.id && !member.admin) {
          // Make current user to admin.
          dispatch(makeAdmin());
        }

        setMemberList(data.members);
        setCurrentTurn(data.currentTurn);

        // Play the sound
        const audio = new Audio(leaveSound);
        audio
          .play()
          .catch((error) => console.error("Audio playback failed:", error));
      });

      return () => {
        socket.off("joined");
        socket.off("restart");
        socket.off("word-selection");
        socket.off("game-started");
        socket.off("leader-board");
        socket.off("result");
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

  const handleLike = (e) => {
    const socket = getSocket();
    if (socket && !isReacted) {
      socket.emit("like", {
        isLiked: e.target.name == "👍" ? true : false,
        user: member,
        currentTurn: currentTurn,
      });
      setIsReacted(true);
    }
  };

  return (
    <div className="h-dvh w-dvw flex items-center justify-center text-[#000]">
      <div className="container flex flex-col h-[90%] gap-1">
        <div className="flex justify-between items-center bg-[#FFF] rounded-lg px-3 py-2">
          <Timer drawTime={drawTime} isRoundStarted={isRoundStarted} />
          <p>
            Round {currentRound} of {rounds}
          </p>
          <div className="text-center">
            <span className="text-xs">Guess This</span>
            <div className="flex">
              <Word
                word={word}
                isGuessed={member.id == currentTurn.id || isGuessed}
                hints={hints}
                drawTime={drawTime - 10}
                isRoundStarted={isRoundStarted}
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
              className={`w-10 h-10 rounded-full flex items-center justify-center select-none ${
                (isReacted || member.id == currentTurn.id || !isRoundStarted) ? "bg-[#4b5563]" : "bg-[#16a34a]"
              }`}
              onClick={handleLike}
              disabled={isReacted || member.id == currentTurn.id || !isRoundStarted}
            />
            <Button
              name="👎"
              className={`w-10 h-10 rounded-full flex items-center justify-center select-none ${
                (isReacted || member.id == currentTurn.id || !isRoundStarted) ? "bg-[#4b5563]" : "bg-theme-red"
              }`}
              onClick={handleLike}
              disabled={isReacted || member.id == currentTurn.id || !isRoundStarted}
            />
          </div>
          <p>
            Room ID: <span className="font-bold">{member.room}</span>
          </p>
          <Button
            name="Leave"
            onClick={handleLeaveRoom}
            className="bg-theme-yellow p-2 rounded-md"
          />
        </div>
        <div className="flex justify-between h-full border border-[#000] bg-[#FFF] rounded-lg">
          <div className="w-[20%]">
            {isSocketConnected && (
              <MemberList
                currentUser={member}
                memberList={memberList}
                currentTurn={currentTurn}
              />
            )}
          </div>
          <div className="w-[60%] border-x border-[#000]">
            {isSocketConnected && isShowConfiguration && (
              <Configuration member={member} />
            )}
            {isSocketConnected && isSelectingWord && (
              <SelectWord
                member={member}
                currentTurn={currentTurn}
                wordCount={wordCount}
              />
            )}
            {isSocketConnected && isRoundStarted && (
              <Canvas
                room={member.room}
                disabled={member.id !== currentTurn.id}
              />
            )}
            {isSocketConnected && isShowLeaderBoard && (
              <LeaderBoard currentUser={member} leaderBoard={leaderBoard} />
            )}
            {isSocketConnected && isShowResult && (
              <Result
                currentUser={member}
                leaderBoard={memberList}
                member={member}
              />
            )}
          </div>
          <div className="w-[20%]">
            {isSocketConnected && (
              <Chat
                member={member}
                word={word}
                isGuessed={isGuessed}
                setIsGuessed={setIsGuessed}
                disabled={member.id == currentTurn.id && isRoundStarted}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayGround;
