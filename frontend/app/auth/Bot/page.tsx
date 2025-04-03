"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import { FaTrash } from "react-icons/fa";

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

interface Chat {
  id: number;
  messages: Message[];
}

export default function Bot() {
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/auth/Login");
    });
    return () => unsubscribe();
  }, [router]);

  const startNewChat = () => {
    const newChat: Chat = { id: Date.now(), messages: [] };
    setConversations([...conversations, newChat]);
    setCurrentChatId(newChat.id);
  };

  const loadChat = (chatId: number) => {
    setCurrentChatId(chatId);
  };

  const deleteChat = (chatId: number) => {
    setConversations(conversations.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) setCurrentChatId(null);
  };

  const sendMessage = () => {
    if (!message.trim() || currentChatId === null) return;

    const timestamp = new Date().toLocaleTimeString();
    
    // Ensure the user message stays visible while bot processes
    setConversations(conversations.map((chat) =>
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, { text: message, sender: "user", timestamp }] }
        : chat
    ));

    setMessage("");
    setIsBotTyping(true);

    setTimeout(() => {
      setConversations(conversations.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, { text: "Processing your request...", sender: "bot", timestamp: new Date().toLocaleTimeString() }] }
          : chat
      ));
      setIsBotTyping(false);
    }, 1000);
  };

  const currentChat = conversations.find((chat) => chat.id === currentChatId);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: "25%", backgroundColor: "#2D3748", color: "white", padding: "20px", display: "flex", flexDirection: "column" }}>
        <button
          onClick={startNewChat}
          style={{ backgroundColor: "#4A5568", padding: "10px", borderRadius: "5px", cursor: "pointer", color: "white", border: "none", marginBottom: "15px" }}
        >
          + New Chat
        </button>
        <h2 style={{ borderBottom: "1px solid #718096", paddingBottom: "10px" }}>Chat History</h2>
        <div style={{ marginTop: "10px", overflowY: "auto", maxHeight: "70vh" }}>
          {conversations.map((chat) => (
            <div
              key={chat.id}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", margin: "5px 0", backgroundColor: currentChatId === chat.id ? "#4A5568" : "#718096", cursor: "pointer", borderRadius: "5px" }}
            >
              <div onClick={() => loadChat(chat.id)} style={{ flexGrow: 1 }}>{chat.messages[0]?.text.slice(0, 20) || "New Chat"}</div>
              <FaTrash onClick={() => deleteChat(chat.id)} style={{ cursor: "pointer", color: "white", marginLeft: "10px" }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: "75%", backgroundColor: "#F7FAFC", display: "flex", flexDirection: "column" }}>
        <div style={{ backgroundColor: "#4A5568", color: "white", padding: "10px", textAlign: "center", fontWeight: "bold" }}>AI Financial Assistant</div>

        <div style={{ flexGrow: 1, padding: "20px", overflowY: "auto" }}>
          {currentChat ? (
            currentChat.messages.map((msg, idx) => (
              <div
                key={idx}
                style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", marginBottom: "10px" }}
              >
                <div style={{ maxWidth: "60%", backgroundColor: msg.sender === "user" ? "#2B2F4C" : "#E2E8F0", padding: "10px", borderRadius: "10px", color: msg.sender === "user" ? "white" : "black" }}>
                  <div style={{ fontSize: "0.9em", marginBottom: "5px", fontWeight: "bold" }}>{msg.sender === "user" ? "You" : "Bot"}</div>
                  <div>{msg.text}</div>
                  <div style={{ fontSize: "0.8em", color: "gray", marginTop: "5px", textAlign: "right" }}>{msg.timestamp}</div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "gray" }}>Start a new chat to begin...</p>
          )}
          {isBotTyping && <p style={{ color: "gray" }}>Bot is typing...</p>}
        </div>

        {currentChat && (
          <div style={{ display: "flex", padding: "10px", backgroundColor: "#E2E8F0" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              style={{ flexGrow: 1, padding: "8px", borderRadius: "5px", marginRight: "10px", border: "1px solid #CBD5E0", color: "black" }}
            />
            <button onClick={sendMessage} style={{ padding: "8px 12px", backgroundColor: "#3182CE", color: "white", borderRadius: "5px", cursor: "pointer", border: "none" }}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}
