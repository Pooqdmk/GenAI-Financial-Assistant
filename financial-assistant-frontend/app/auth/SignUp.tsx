// app/(auth)/SignUp.tsx
"use client";
import { useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/bot");
    } catch (err) {
      setError("Failed to create an account. Try again.");
      console.error("Error with Sign-Up:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded-md w-72 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded-md w-72 focus:outline-none"
          required
        />
        <button type="submit" className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Create Account
        </button>
      </form>
    </div>
  );
}
