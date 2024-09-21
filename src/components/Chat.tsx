import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you?" },
    { sender: "user", text: "Hi there!" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      setMessages([...messages, { sender: "user", text: inputMessage }]);
      setInputMessage("");
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "I'm here to assist you!" },
        ]);
      }, 1000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  return (
    <div className="flex flex-col shadow-lg overflow-hidden h-full">
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col">
              {msg.sender !== "user" && <span className="text-xs">Yagnik</span>}
              <div
                className={`rounded-lg p-3 text-sm max-w-xs text-[#000] ${
                  msg.sender === "user" ? "bg-theme-yellow" : "bg-[#e5e7eb]"
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
