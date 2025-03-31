// financial-assistant-frontend/app/(auth)/ForgotPassword.tsx
"use client";
import { useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent to your inbox.");
    } catch (error) {
      setMessage("Failed to send password reset email. Check the email address.");
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

      {message && (
        <p className={`mb-4 ${message.includes("sent") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handlePasswordReset} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded-md focus:outline-none"
          required
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Send Reset Email
        </button>
      </form>
    </div>
  );
}
