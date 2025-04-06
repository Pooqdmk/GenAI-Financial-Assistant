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

# 💸 GenAI Financial Assistant – Frontend

This is the frontend for the GenAI-based Financial Assistant. It provides a sleek chat interface for users to interact with the assistant, which offers financial recommendations using GenAI and a FastAPI backend.

---

## 🔧 Tech Stack

- **Next.js** (React Framework)
- **TypeScript**
- **Firebase Authentication**
- **Tailwind CSS**
- **React Icons**
- **React Markdown**
- **FastAPI (Backend Integration)**

---

## 🚀 Features

- Google and GitHub authentication using Firebase
- Chat interface with real-time user-bot conversation
- Markdown rendering for bot responses
- Multiple chat sessions with chat history
- Integration with backend `/recommend` endpoint for financial recommendations

---

## 🛠️ Setup & Run Locally

### 1. Clone the repository

bash
git clone https://github.com/your-username/GenAI-Financial-Assistant.git
cd GenAI-Financial-Assistant/frontend

2. Install dependencies
bash
npm install

3. Create .env.local file
bash
touch .env.local


4. Add your Firebase configuration:

env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain

NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id


5. Run the development server

npm run dev

Open your browser at http://localhost:3000

🔗 Backend Integration

Ensure your FastAPI backend is running locally at:

bash
http://localhost:8000/recommend

The frontend sends authenticated POST requests to this endpoint using Firebase ID tokens.



## 🛠️ Scripts

| **Script**         | **Usage**                                                    |
|--------------------|--------------------------------------------------------------|
| **npm run dev**    | Start the Next.js app in development mode at `localhost:3000` |
| **npm run build**  | Create an optimized production build                         |
| **npm run start**  | Start the production server                                  |
| **npm run lint**   | Run ESLint to check code formatting and quality              |
| **npm install**    | Install project dependencies from `package.json`             |














 
 

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
