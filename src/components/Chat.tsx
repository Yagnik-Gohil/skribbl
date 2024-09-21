import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { getSocket } from "../services/socket";

const Chat = () => {
  const member = useSelector((state: RootState) => state.member.currentMember);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling

  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      socket.on("receive", (data: { user: string; message: string }) => {
        console.log("message received", data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: data.user, text: data.message },
        ]);
      });

      return () => {
        socket.off("receive");
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
              msg.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col">
              {msg.sender !== "You" && (
                <span className="text-xs">{msg.sender}</span>
              )}
              <div
                className={`rounded-lg p-3 text-sm max-w-xs text-[#000] ${
                  msg.sender === "You" ? "bg-theme-yellow" : "bg-[#e5e7eb]"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="flex items-center p-3 bg-[#f3f4f6] border-t">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Guess the word..."
          className="flex-1 p-2 border rounded-lg outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 p-2 text-white border rounded-lg shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
