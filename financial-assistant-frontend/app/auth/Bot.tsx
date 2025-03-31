"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig"; // Ensure correct import
import { onAuthStateChanged } from "firebase/auth";

// Interfaces for TypeScript
interface Message {
  text: string;
  sender: "user" | "bot";
}

interface Chat {
  id: number;
  messages: Message[];
}

export default function Bot() {
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Ensure user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth/Login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Start a new chat
  const startNewChat = () => {
    const newChat: Chat = { id: Date.now(), messages: [] };
    setConversations([...conversations, newChat]);
    setCurrentChatId(newChat.id);
  };

  // Load an existing chat
  const loadChat = (chatId: number) => {
    setCurrentChatId(chatId);
  };

  // Send a message
  const sendMessage = () => {
    if (!message.trim() || currentChatId === null) return;

    setConversations(
      conversations.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { text: message, sender: "user" },
                { text: "This is a bot response!", sender: "bot" },
              ],
            }
          : chat
      )
    );

    setMessage("");
  };

  const currentChat = conversations.find((chat) => chat.id === currentChatId);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "25%", backgroundColor: "#333", color: "white", padding: "20px", display: "flex", flexDirection: "column" }}>
        <button
          onClick={startNewChat}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px",
            marginBottom: "15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          + New Chat
        </button>

        <h2>Chat History</h2>
        <div style={{ overflowY: "auto", flexGrow: 1, marginTop: "10px" }}>
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => loadChat(chat.id)}
              style={{
                backgroundColor: chat.id === currentChatId ? "#555" : "#444",
                padding: "10px",
                marginBottom: "5px",
                borderRadius: "5px",
                cursor: "pointer",
                color: "white",
              }}
            >
              {chat.messages[0]?.text.slice(0, 30) || "New Chat"}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flexGrow: 1, backgroundColor: "#f4f4f4", display: "flex", flexDirection: "column" }}>
        {/* Chat Display */}
        <div style={{ flexGrow: 1, padding: "20px", overflowY: "auto", backgroundColor: "#e8e8e8", marginBottom: "10px" }}>
          {currentChat ? (
            currentChat.messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: msg.sender === "user" ? "#007bff" : "#ddd",
                  color: msg.sender === "user" ? "white" : "black",
                  alignSelf: msg.sender === "user" ? "flex-start" : "flex-end",
                  maxWidth: "60%",
                }}
              >
                {msg.text}
              </div>
            ))
          ) : (
            <p style={{ color: "#666", textAlign: "center", marginTop: "20px" }}>
              Start a new chat to begin...
            </p>
          )}
        </div>

        {/* Message Input */}
        {currentChat && (
          <div style={{ padding: "10px", backgroundColor: "#ddd", display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              style={{
                flexGrow: 1,
                padding: "10px",
                marginRight: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
