import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import GetProfile from "../components/GetProfile";
import generateId from "../helpers/generateId";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../state/store";
import { create } from "../state/playground/memberSlice";
import { IUser } from "../types";
import getEmoji from "../helpers/getEmoji";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [emoji, setEmoji] = useState<string>(getEmoji());
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const handleCreateRoom = () => {
    if (name.trim() === "") {
      setAlertMessage("Name cannot be empty");
      setShowAlert(true);
      return;
    }

    const user: IUser = {
      id: generateId(),
      room: generateId(),
      admin: true,
      name: name,
      emoji: emoji,
      score: 0,
    };

    // Dispatch to Redux store
    dispatch(create(user));

    // Navigate to Playground after room creation
    navigate("/playground");
  };

  const handleJoinRoom = () => {
    const roomIdPattern = /^\d{6}$/;

    if (name.trim() === "") {
      setAlertMessage("Name cannot be empty");
      setShowAlert(true);
      return;
    }

    if (!roomIdPattern.test(roomId)) {
      setAlertMessage("Room ID must be a 6-digit number");
      setShowAlert(true);
    } else {
      setShowAlert(false);

      const user: IUser = {
        id: generateId(),
        room: roomId,
        admin: false,
        name: name,
        emoji: emoji,
        score: 0,
      };

      // Dispatch to Redux store
      dispatch(create(user));

      // Navigate to Playground after joining room
      navigate("/playground");
    }
  };

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setName(inputValue);
    setEmoji(getEmoji());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowAlert(false);
    const inputValue = e.target.value;
    setRoomId(inputValue);
  };

  return (
    <div className="h-dvh w-dvw flex items-center justify-center">
      <div className="text-center">
        <div className="my-4 flex justify-center items-center flex-col gap-4">
          <div className="flex gap-4 mb-2">
            <GetProfile emoji={emoji} className={"text-7xl"} />
          </div>
          <Input
            placeholder="Name"
            className="rounded p-4 text-xl w-1/3"
            onChange={handleName}
            value={name}
          />
        </div>
        <Button
          name="Create Room"
          className="bg-theme-yellow px-10 py-5 rounded font-bold"
          onClick={handleCreateRoom}
        />
        <div className="flex gap-2 items-center justify-center text-[#FFF] my-5">
          <hr className="w-[150px]" />
          <span className="font-bold">OR</span>
          <hr className="w-[150px]" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Input
            placeholder="Room ID"
            className="rounded p-4 text-xl w-1/3"
            onChange={handleInputChange}
            value={roomId}
          />
          <Button
            name="Join"
            className="bg-theme-yellow px-10 py-5 rounded font-bold"
            onClick={handleJoinRoom}
          />
        </div>
        {/* Show alert only if necessary */}
        {showAlert && (
          <Alert
            message={alertMessage}
            handleDisplay={setShowAlert}
            type="error"
          />
        )}
      </div>
    </div>
  );
};

export default Home;
