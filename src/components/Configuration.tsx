import React, { useEffect, useState } from "react";
import { getSocket } from "../services/socket";
import Button from "./Button";
import { IConfiguration, IUser } from "../types";

const Configuration = ({ member }: { member: IUser }) => {
  // Default values for the select options
  const defaultSettings: IConfiguration = {
    room: member.room,
    rounds: 3,
    drawTime: 60,
    hints: 1,
    wordCount: 2,
    wordMode: "normal",
  };

  // State to store the selected values
  const [settings, setSettings] = useState<IConfiguration>(defaultSettings);

  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      socket.on("configuration-updated", (data) => {
        setSettings(data);
      });

      return () => {
        socket.off("configuration-updated");
      };
    }
  }, []);

  useEffect(() => {
    if (member.admin) {
      const socket = getSocket();

      if (socket) {
        socket.emit("update-configuration", settings);
      }
    }
  }, [settings]);

  // Function to reset the settings
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Function to handle changes in select inputs
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: ["wordMode"].includes(name) ? value : +value,
    }));
  };

  // Function to start the game
  const startGame = () => {
    const socket = getSocket();

    if (socket) {
      socket.emit("word-selection", member);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-lg">
      <div className="bg-theme-red p-4 rounded-md w-full max-w-sm">
        {/* Rounds */}
        <div className="flex items-center justify-between my-2">
          <p className="text-[#FFF] text-xl">Rounds 🔄</p>
          <select
            name="rounds"
            value={settings.rounds}
            onChange={handleChange}
            className="ml-4 p-1 rounded bg-[#FFF]"
            disabled={!member.admin}
          >
            {[1, 2, 3, 4, 5, 10].map((round) => (
              <option key={round} value={round}>
                {round} Round{round > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between my-2">
          <p className="text-[#FFF] text-xl">Timer ⏱️</p>
          <select
            name="drawTime"
            value={settings.drawTime}
            onChange={handleChange}
            className="ml-4 p-1 rounded bg-[#FFF]"
            disabled={!member.admin}
          >
            {[10, 60, 70, 80, 90, 100, 110, 120].map((time) => (
              <option key={time} value={time}>
                {time} Seconds
              </option>
            ))}
          </select>
        </div>

        {/* Hints */}
        <div className="flex items-center justify-between my-2">
          <p className="text-[#FFF] text-xl">Hints 💡</p>
          <select
            name="hints"
            value={settings.hints}
            onChange={handleChange}
            className="ml-4 p-1 rounded bg-[#FFF]"
            disabled={!member.admin}
          >
            {[0, 1, 2, 3].map((hint) => (
              <option key={hint} value={hint}>
                {hint} Hint{hint > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Word Count */}
        <div className="flex items-center justify-between my-2">
          <p className="text-[#FFF] text-xl">Word Count 🔢</p>
          <select
            name="wordCount"
            value={settings.wordCount}
            onChange={handleChange}
            className="ml-4 p-1 rounded bg-[#FFF]"
            disabled={!member.admin}
          >
            {[1, 2, 3].map((count) => (
              <option key={count} value={count}>
                {count} Word{count > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Word Mode */}
        <div className="flex items-center justify-between my-2">
          <p className="text-[#FFF] text-xl">Word Mode 🔎</p>
          <select
            name="wordMode"
            value={settings.wordMode}
            onChange={handleChange}
            className="ml-4 p-1 rounded bg-[#FFF]"
            disabled={!member.admin}
          >
            {["normal", "hidden", "both"].map((mode) => (
              <option key={mode} value={mode}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Reset and Start Buttons */}
        <div className="flex justify-between mt-4">
          {member.admin ? (
            <>
              <Button
                key="reset-btn"
                name="Reset"
                onClick={resetSettings}
                className="bg-theme-yellow px-4 py-2 rounded-md"
              />
              <Button
                key="start-btn"
                name="Start Game"
                onClick={startGame}
                className="bg-theme-yellow px-4 py-2 rounded-md"
              />
            </>
          ) : (
            <p className="bg-theme-yellow px-4 py-2 rounded-md text-center mx-auto">
              Wait for the admin to start the game
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuration;
