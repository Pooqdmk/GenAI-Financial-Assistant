# 💸 AI-Powered Financial Assistant

An intelligent **AI Financial Assistant** built for the Google Hackathon!  
This tool helps users simplify money management by offering real-time insights, PDF-based financial summaries, and budgeting suggestions — all through natural conversation.

---

## 🔧 Features

- ✅ **Conversational AI with Gemini** for smart financial dialogue  
- 🔐 **Firebase Authentication** for secure and easy user login  
- 📄 **Retrieval-Augmented Generation (RAG)** with external APIs  
- 🌐 **WebSocket-based Real-Time Communication** for dynamic, streaming chat   
- 💬 **Modern Chat UI with React**  
- ⚡ **FastAPI Backend** for performance and simplicity  
 
---

## 🔍 Tech Stack

| Layer        | Technology Used                    |
|--------------|------------------------------------|
| 💬 Frontend  | React, Tailwind CSS                |
| ⚙️ Backend   | FastAPI, Python, WebSockets        |
| 🔒 Auth      | Firebase Authentication            |
| 🧠 AI Engine | Gemini Pro (Google AI Model)       |
| 📄 RAG       | Sklearn                            |

---
## 🔐 Firebase Authentication

Firebase handles secure authentication with:

- ✅ **Email/Password Login**
- 🔗 **Google Sign-In**
- 🐙 **GitHub Login**
---

# 🧠 GenAI Financial Assistant (Backend)

This backend powers a conversational AI-driven **financial advisor bot** that provides tailored investment advice using **Google Gemini Pro**, **Firebase**, **WebSockets**, and **Retrieval-Augmented Generation (RAG)** for enhanced knowledge grounding.

---

## 🚀 Features

### 🔐 Firebase Authentication
- Supports **Email/Password**, **Google**, and **GitHub** login.
- Firebase Admin SDK handles secure user creation and token verification.
- Firestore is used to store user profiles and preferences.

### 🧠 Conversational AI with Gemini
- Uses **Google's Gemini 1.5 Pro** model (`google.generativeai`) for natural, personalized financial advice.
- Adapts advice based on:
  - User's investment experience level (Beginner, Intermediate, Expert)
  - Preferred investment type (e.g., Long-term, Passive income, etc.)
- Responses include:
  - TL;DR summaries
  - Risk assessments
  - Pro tips & common pitfalls
  - Step-by-step action plans
  - Emoji-enhanced answers for better readability
- System prompt includes behavioral instructions for humor, analogies, and follow-up questioning

### 📚 RAG (Retrieval-Augmented Generation)
- Relevant documents are retrieved using a custom `rag_module` to ground Gemini responses in real facts.
- Provides better accuracy and reliability for advice and definitions.

### 🌐 WebSockets
- Real-time profile change monitoring using **WebSocket endpoints**.
- Backend pushes updates to connected clients whenever Firestore user data changes.

### 🧩 Session Handling
- Short user prompts are automatically merged with previous ones for context retention.
- Each user has an active session maintained in memory to simulate multi-turn conversations.

---

## 📦 API Endpoints

### `GET /`
> Home route – "Welcome to GenAI Financial Assistant!"

### `GET /healthcheck`
> Returns service health status.

### `POST /signup`
> Creates a new user in Firebase and stores profile in Firestore.

### `POST /login`
> Frontend handles login using Firebase SDK; this route is informational.

### `POST /update-profile`
> Updates user's investment type and experience level.

### `POST /recommend`
> Core route for generating investment advice using Gemini + RAG + profile data.

### `GET /ws/{user_id}`
> WebSocket endpoint to push real-time updates to specific users.

---

## 🛡️ Security

- Auth middleware verifies Firebase tokens using `HTTPBearer` scheme.
- All protected routes require a valid JWT from Firebase.

---

## ⚙️ Tech Stack

| Tech         | Usage                                      |
|--------------|--------------------------------------------|
| **FastAPI**  | Backend framework                          |
| **Firebase** | Auth, Firestore, Realtime updates          |
| **Gemini Pro** | Financial advice generation (GenAI)     |
| **RAG**      | Knowledge grounding via custom module      |
| **WebSockets** | Real-time client updates                 |
| **CORS**     | Enabled for `localhost:3000` (frontend)    |

---

 # frontend
 This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
