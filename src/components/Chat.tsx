import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { stringSimilarity } from "string-similarity-js";
import { getSocket } from "../services/socket";
import Button from "./Button";
import { IUser } from "../types";
import correctAnswerSound from "../assets/correct-answer.mp3";

const Chat = ({
  member,
  word,
  isGuessed,
  setIsGuessed,
  disabled,
}: {
  member: IUser;
  word: string;
  isGuessed: boolean;
  setIsGuessed: Dispatch<SetStateAction<boolean>>;
  disabled: boolean;
}) => {
  const [messages, setMessages] = useState<
    { sender: string; text: string; type?: string }[]
  >([]); // Add optional "type" for system messages
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling
  // const [isGuessed, setIsGuessed] = useState(false); // Track if the current user has guessed the word

  useEffect(() => {
    setIsGuessed(false);
  }, [word]);

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

      socket.on("word-guessed", (data: IUser) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "System",
            text: `${data.name} has guessed the word!`,
            type: "system",
          },
        ]);
        // Play the sound
        const audio = new Audio(correctAnswerSound);
        audio
          .play()
          .catch((error) => console.error("Audio playback failed:", error));
      });

      return () => {
        socket.off("receive");
        socket.off("joined");
        socket.off("left");
        socket.off("word-guessed");
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
    const trimmedMessage = inputMessage.trim();
    const isExactMatch = trimmedMessage.toLowerCase() === word.toLowerCase();
    // Calculate the similarity percentage between input and the target word
    const similarityPercentage = stringSimilarity(trimmedMessage, word) * 100;
    const isSimilar = similarityPercentage > 70;

    if (socket && inputMessage.trim() !== "" && !isGuessed) {
      if (!isExactMatch) {
        // Emit message to the server
        socket.emit("send", {
          user: member.name,
          room: member.room,
          message: inputMessage,
        });
      }

      // Determine the message type (correct, similar, or regular)
      let messageType: string | undefined = undefined;
      if (isExactMatch) {
        if (!isGuessed) {
          // If the word is guessed for the first time, emit "word-guessed" event
          socket.emit("word-guessed", member);

          // Set `isGuessed` to true to prevent further correct guesses
          setIsGuessed(true);

          messageType = "correct";
        }
      } else if (isSimilar) {
        messageType = "similar";
      }

      // Update local messages with the appropriate type
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "You",
          text: inputMessage,
          type: messageType, // Use "correct" for exact matches, "similar" for similar ones
        },
      ]);
    } else if (socket && inputMessage.trim() !== "" && isGuessed) {
      // Prevent user from sending the correct word again
      // Emit message to the server
      socket.emit("send", {
        user: member.name,
        room: member.room,
        message:
          isExactMatch || isSimilar
            ? inputMessage.replace(/./g, "*")
            : inputMessage,
      });
      // Update local messages with the appropriate type
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "You",
          text: inputMessage,
          type: "regular", // Use "correct" for exact matches, "similar" for similar ones
        },
      ]);
    }
    setInputMessage("");
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
                    ? msg.text.includes("guessed the word")
                      ? "bg-[#22c55e] text-[#FFF]" // Green background for word guessed system message
                      : "bg-[#d1d5db] text-[#4b5563]" // Gray background for other system messages
                    : msg.type === "correct"
                    ? "bg-[#22c55e] text-[#FFF]" // Green background for exact match
                    : msg.type === "similar"
                    ? "bg-[#86efac]" // Light green background for similar matches (>70% similarity)
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
          className="w-full p-2  rounded-md outline-none"
          disabled={disabled}
        />
        <Button
          name="Send"
          onClick={handleSendMessage}
          className="ml-3 p-2 text-white rounded-md shadow bg-theme-yellow"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default Chat;
