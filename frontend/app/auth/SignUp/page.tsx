"use client";
import { useState } from "react";
import { auth, googleProvider, githubProvider } from "@/firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/auth/Bot");
    } catch (err) {
      setError("Failed to create account. Try again.");
      console.error("Error with Sign Up:", err);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/auth/Bot");
    } catch (err) {
      setError("Social sign-up failed. Try again.");
      console.error("Error with Social Sign-Up:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('/images/loginimg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat", //added to prevent image repeat
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px", //increased padding to match login
          background: "rgba(255, 255, 255, 0.9)", //added semi-transparent background
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", //added box shadow to match login
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "20px" }}>Sign Up</h2>
        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
        <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              background: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </form>
        <p style={{ margin: "15px 0", color: "#555" }}>Or sign up with</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={() => handleSocialSignIn(googleProvider)}
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
          >
            <Image src="/images/google.png" alt="Google" width={30} height={30} />
          </button>
          <button
            onClick={() => handleSocialSignIn(githubProvider)}
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
          >
            <Image src="/images/GitHub-Logo.png" alt="GitHub" width={30} height={30} />
          </button>
        </div>
        <p style={{ marginTop: "20px", color: "#555" }}>
          Already have an account?{" "}
          <button
            onClick={() => router.push("/auth/Login")}
            style={{ color: "#007BFF", border: "none", background: "none", cursor: "pointer" }}
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}