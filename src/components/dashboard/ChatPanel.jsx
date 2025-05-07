import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../../hooks/AppContext";
import GoBackBtn from "../ui/GoBackBtn";

export default function ChatPanel() {
  const { isDarkMode } = useAppContext();
  const [message, setMessage] = useState("");

  const defaultMessages = [
    {
      id: 1,
      text: "Hi there! How can I help you today?",
      sender: "Admin",
      time: "09:15",
      isUser: false,
    },
    {
      id: 2,
      text: "Can you tell me more about your services?",
      sender: "You",
      time: "09:16",
      isUser: true,
    },
    {
      id: 3,
      text: "Absolutely! We offer consulting for university applications.",
      sender: "Admin",
      time: "09:17",
      isUser: false,
    },
  ];

  // Inside ChatPanel
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("wss://yourserver.com/socket");

    socketRef.current.onopen = () => {
      console.log("Connected to server");
      socketRef.current.send("Hello from client!");
    };

    socketRef.current.onmessage = (event) => {
      console.log("Received:", event.data);
      // You can push received messages here
      const newMessage = {
        id: Date.now(),
        text: event.data,
        sender: "Admin",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isUser: false,
      };
      setMessages((prev) => [...prev, newMessage]);
    };

    socketRef.current.onclose = () => {
      console.log("Disconnected");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const [messages, setMessages] = useState(defaultMessages);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "You",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isUser: true,
      };

      // Safe WebSocket send
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(message);
      } else {
        console.warn("WebSocket is not open. Cannot send message.");
      }

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  // Tailwind-based theme setup
  const bgMain = isDarkMode ? "bg-gray-800" : "bg-gray-50";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const borderColor = isDarkMode ? "border-gray-600" : "border-gray-300";
  const inputBg = isDarkMode ? "bg-gray-700" : "bg-white";

  return (
    <div
      className={`mt-6 p-6 rounded-lg w-full sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto ${bgMain}`}
    >
      <GoBackBtn />
      <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>
        Chat Panel (Local Only)
      </h3>

      {/* Chat messages */}
      <div className="space-y-4 max-h-80 overflow-y-auto mb-6 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg max-w-xs ${
              msg.isUser
                ? isDarkMode
                  ? "bg-blue-900 text-blue-100 ml-auto"
                  : "bg-blue-100 text-blue-800 ml-auto"
                : isDarkMode
                ? "bg-gray-600 text-gray-100"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <p>{msg.text}</p>
            <p
              className={`text-xs mt-1 ${
                msg.isUser
                  ? isDarkMode
                    ? "text-blue-300"
                    : "text-blue-600"
                  : isDarkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {msg.sender} • {msg.time}
            </p>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`flex-1 p-3 rounded-lg ${inputBg} border ${borderColor} focus:outline-none focus:ring-2 ${
            isDarkMode
              ? "focus:ring-blue-500 focus:border-blue-500"
              : "focus:ring-blue-300 focus:border-blue-300"
          }`}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className={`px-5 py-2 rounded-lg ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-medium transition`}
          disabled={!message.trim()}
        >
          Send
        </button>
      </form>

      {/* JSON View (for debugging) */}
      <div className="mt-6">
        <h4 className={`text-sm font-medium mb-2 ${textColor} `}>
          Message Array (JSON):
        </h4>
        <div
          className={`overflow-auto max-h-40 p-4 rounded-md ${
            isDarkMode
              ? "bg-gray-900 text-green-300"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <pre className="text-xs">{JSON.stringify(messages, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
