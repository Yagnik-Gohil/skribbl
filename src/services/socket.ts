// src/services/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Establish the socket connection
export const connectSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:3000"); // Use your actual backend URL
  }
  return socket;
};

// Disconnect the socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Export the socket instance to use directly
export const getSocket = (): Socket | null => socket;
