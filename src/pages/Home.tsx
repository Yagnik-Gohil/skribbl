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

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const handleCreateRoom = () => {
    if (name.trim() === "") {
      setAlertMessage("Name cannot be empty");
      setShowAlert(true);
      return; // Prevent further execution
    }

    const user = {
      id: generateId(),
      room: generateId(),
      admin: true,
      name: name,
    };

    dispatch(create(user));
    navigate("/playground");
  };

  const handleJoinRoom = () => {
    // Validate if roomId is a 6-digit integer
    const roomIdPattern = /^\d{6}$/;

    if (name.trim() === "") {
      setAlertMessage("Name cannot be empty");
      setShowAlert(true);
      return; // Prevent further execution
    }

    if (!roomIdPattern.test(roomId)) {
      setAlertMessage("Room ID must be a 6-digit number");
      setShowAlert(true); // Only show alert when "Join" is clicked and input is invalid
    } else {
      setShowAlert(false); // Hide alert if the room ID is correct

      const user = {
        id: generateId(),
        room: +roomId,
        admin: false,
        name: name,
      };

      dispatch(create(user));
      navigate("/playground");
    }
  };

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setName(inputValue);
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
          {name.length > 0 ? (
            <GetProfile seed={name} size={10} />
          ) : (
            <GetProfile seed={Math.random().toString()} size={10} />
          )}
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
        {/* Only show the alert if Join button is clicked and Room ID or Name is invalid */}
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
