"use client"; // Required for useEffect to work in Next.js (app directory)

import { useEffect, useState } from "react";

interface WebSocketProps {
  userId: string;
}

const WebSocketComponent: React.FC<WebSocketProps> = ({ userId }) => {
  const [updates, setUpdates] = useState<string | null>(null);
  const wsUrl = `ws://localhost:8000/ws/${userId}`; // Update if backend is hosted

  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("🔌 WebSocket connected ✅");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📡 Received update:", data);
      setUpdates(data.update);
    };
    ws.onclose = () => console.log("❌ WebSocket disconnected");

    return () => {
      ws.close();
    };
  }, [userId]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Live Updates:</h3>
      {updates ? (
        <pre className="bg-gray-200 p-2 rounded">{JSON.stringify(updates, null, 2)}</pre>
      ) : (
        <p className="text-gray-500">No updates yet.</p>
      )}
    </div>
  );
};

export default WebSocketComponent;
