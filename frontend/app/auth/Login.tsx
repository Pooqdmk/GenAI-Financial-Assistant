"use client";
import { useState } from "react";
import { auth, googleProvider, githubProvider } from "@/firebase/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/auth/Bot");
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Error with Email Sign-In:", err);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/auth/Bot");
    } catch (err) {
      setError("Social sign-in failed. Try again.");
      console.error("Error with Social Sign-In:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('/images/loginimage.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          background: "rgba(255,255,255,0.9)",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "rgba(45,30,20,1)", marginBottom: "20px" }}>Sign In</h2>
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}
        <form onSubmit={handleEmailSignIn} style={{ display: "flex", flexDirection: "column" }}>
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
            Sign In
          </button>
        </form>
        <p style={{ margin: "15px 0", color: "black" }}>Or continue with</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={() => handleSocialSignIn(googleProvider)}
            style={{
              padding: "10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <Image src="/images/google.png" alt="Google" width={60} height={50} />
          </button>
          <button
            onClick={() => handleSocialSignIn(githubProvider)}
            style={{
              padding: "10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <Image src="/images/GitHub-Logo.png" alt="GitHub" width={60} height={50} />
          </button>
        </div>
        <p style={{ marginTop: "20px", color: "black" }}>
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/auth/SignUp")}
            style={{ color: "#007BFF", border: "none", background: "none", cursor: "pointer" }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
