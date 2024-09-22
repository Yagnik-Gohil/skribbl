import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { getSocket } from "../services/socket";
import Button from "./Button";

const Chat = () => {
  const member = useSelector((state: RootState) => state.member);
  const [messages, setMessages] = useState<
    { sender: string; text: string; type?: string }[]
  >([]); // Add optional "type" for system messages
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling

  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      // Listen for regular messages
      socket.on("receive", (data: { user: string; message: string }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: data.user, text: data.message },
        ]);
      });

      // Listen for "joined" event and add a system message to the chat
      socket.on("joined", (data: { user: { name: string } }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "System",
            text: `${data.user.name} has joined the room`,
            type: "system",
          },
        ]);
      });

      // Listen for "left" event and add a system message to the chat
      socket.on("left", (data: { user: { name: string } }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "System",
            text: `${data.user.name} has left the room`,
            type: "system",
          },
        ]);
      });

      return () => {
        socket.off("receive");
        socket.off("joined");
        socket.off("left");
      };
    }
  }, []);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    const socket = getSocket();

    if (socket && inputMessage.trim() !== "") {
      socket.emit("send", {
        user: member.name,
        room: member.room,
        message: inputMessage,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", text: inputMessage },
      ]);
      setInputMessage("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  // Handle key down event for "Enter" press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of pressing Enter (e.g., form submission)
      handleSendMessage(); // Trigger the send message function
    }
  };

  return (
    <div className="flex flex-col shadow-lg overflow-hidden h-full justify-between">
      {/* Chat Messages */}
      <div
        className="flex-1 p-4 overflow-y-auto bg-white max-h-[600px]"
        ref={messagesEndRef} // Attach the ref to the messages container
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              msg.type === "system"
                ? "justify-center" // Center the system messages
                : msg.sender === "You"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div className="flex flex-col">
              {msg.sender !== "You" && msg.type !== "system" && (
                <span className="text-xs">{msg.sender}</span>
              )}
              <div
                className={`rounded-lg p-3 text-sm max-w-xs text-[#000] ${
                  msg.type === "system"
                    ? "bg-gray-300 text-gray-600" // Style for system messages
                    : msg.sender === "You"
                    ? "bg-theme-yellow"
                    : "bg-[#e5e7eb]"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="flex items-center p-3 bg-theme-red border-t">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Guess the word..."
          className="w-full p-2 border rounded-md outline-none"
        />
        <Button
          name="Send"
          onClick={handleSendMessage}
          className="ml-3 p-2 text-white rounded-md shadow bg-theme-yellow"
        />
      </div>
    </div>
  );
};

export default Chat;
