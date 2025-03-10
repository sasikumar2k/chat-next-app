"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://chat-next-app-livid.vercel.app");

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
      socket.off("activeUsers");
    };
  }, []);

  const sendMessage = () => {
    if (inputValue.trim()) {
      socket.emit("message", inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Real-Time Chat</h2>

        {/* Active Users */}
        <div className="mb-4 p-3 bg-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-700">Active Users</h3>
          <ul className="list-disc pl-5">
            {activeUsers.map((userId) => (
              <li key={userId} className="text-sm text-gray-600">{userId} is online</li>
            ))}
          </ul>
        </div>

        {/* Chat Messages */}
        <div className="h-64 overflow-y-auto bg-gray-50 p-3 border rounded-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-md text-white ${
                msg.userId === socket.id ? "bg-blue-500 text-right" : "bg-gray-600 text-left"
              }`}
            >
              <p className="text-xs text-gray-200">{msg.userId}</p>
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="mt-4 flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
