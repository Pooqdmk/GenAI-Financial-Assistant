// app/(auth)/Login.tsx
"use client";
import { useState } from "react";
import { auth, googleProvider, githubProvider } from "@/firebase/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/bot");
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Error with Email Sign-In:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/bot");
    } catch (err) {
      setError("Google sign-in failed. Try again.");
      console.error("Error with Google Sign-In:", err);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      router.push("/bot");
    } catch (err) {
      setError("GitHub sign-in failed. Try again.");
      console.error("Error with GitHub Sign-In:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Email Login */}
      <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4 mb-4">
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
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Login with Email
        </button>
      </form>

      {/* Forgot Password */}
      <p
        className="text-blue-500 cursor-pointer hover:underline mb-4"
        onClick={() => router.push("/auth/ForgotPassword")}
      >
        Forgot Password?
      </p>

      {/* Social Login */}
      <button onClick={handleGoogleSignIn} className="p-2 mb-2 bg-red-500 text-white rounded-md w-72 hover:bg-red-600">
        Sign in with Google
      </button>
      <button onClick={handleGithubSignIn} className="p-2 mb-4 bg-gray-700 text-white rounded-md w-72 hover:bg-gray-800">
        Sign in with GitHub
      </button>

      {/* Sign Up Link */}
      <p className="text-gray-500">
        Don't have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => router.push("/auth/SignUp")} // Ensure the path is correct
        >
          Create an Account
        </span>
      </p>
    </div>
  );
}
