from fastapi import FastAPI, HTTPException, Depends, Security
from firebase_admin import auth, credentials, firestore, initialize_app
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import google.generativeai as genai
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import logging
from fastapi.middleware.cors import CORSMiddleware
from fastapi import WebSocket, WebSocketDisconnect, BackgroundTasks
import asyncio
import threading
from rag_module import retrieve_relevant_docs


# Load environment variables
load_dotenv()

# Global session store for user prompts
user_sessions = {}

# Initialize Firebase only once
cred = credentials.Certificate("firebase_key.json")  
initialize_app(cred)
db = firestore.client()

# Initialize FastAPI
app = FastAPI()

# Configure Google Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# System Instructions for AI
SYSTEM_PROMPT = """
You are a financial assistant providing structured and user-friendly investment advice.
- Answer in clear and concise points.
- Categorize investments based on Stability, High Growth, and Passive Income.
- Assess risk level as Low, Medium, or High.
- Suggest suitable investment types, platforms, and strategies based on the user's experience level.
- If user input lacks details, ask friendly follow-up questions one at a time.
- Explain concepts in simple real-world terms if asked.
- Explain financial concepts using real-world analogies (e.g., 'Think of investing like planting a tree—you need patience for it to grow').
- Highlight potential pitfalls and market trends so users make well-balanced decisions.
- You're not just an advisor—you're an approachable financial mentor.
- Infuse witty humor when handling irrelevant or playful questions.
- Stay supportive and non-judgmental, especially for beginners.
- Provide a quick 'TL;DR' summary at the end of long responses.
- Offer 'Pro Tips' and 'Common Mistakes to Avoid' for each recommendation.
- Use a step-by-step action plan when guiding users through complex decisions.
- If users ask about historical trends, provide data-backed insights and predictive market trends based on AI analysis.
- Suggest alternative perspectives if the user is overly risk-averse or too aggressive in investing.
- If asked, provide simple budget allocation breakdowns for different income levels.
- At all times, stay professional yet engaging, making finance feel less intimidating and more exciting!
- Enhance responses with emojis
- Do not begin your responses with phrases like 'Here's what I found' or generic intros; dive directly into the useful content.

"""


# Generate advice using Gemini + RAG
def generate_investment_advice(prompt: str):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        # 🧠 Removed SYSTEM_PROMPT and doc context here — already merged in /recommend
        response = model.generate_content(prompt)

        if response and response.text:
            full_text = response.text.strip()

            for unwanted_start in ["here's what i found", "sure!", "of course!"]:
                if full_text.lower().startswith(unwanted_start):
                    full_text = full_text.split(":", 1)[-1].strip()

            # TL;DR Summary (Optional cleanup)
            sentences = full_text.split(".")
            summary = sentences[-1].strip() if len(sentences) > 1 else ""

            return {
                "response": full_text,
                "summary": summary
            }

        return {"response": "", "summary": ""}

    except Exception as e:
        logging.error(f"Error generating content: {e}")
        return {"error": "Failed to generate response."}

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security scheme for token authentication
security = HTTPBearer()

# Dependency to verify Firebase token
def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# User Authentication Model
class UserAuth(BaseModel):
    email: str
    password: str

# Investment Query Model
class InvestmentQuery(BaseModel):
    query: str

# Health Check
@app.get("/healthcheck")
def health_check():
    return {"status": "OK"}

# User Signup
@app.post("/signup")
def signup(user: UserAuth):
    try:
        new_user = auth.create_user(email=user.email, password=user.password)
        db.collection("users").document(new_user.uid).set({"email": user.email})
        return {"message": "User created", "uid": new_user.uid}
    except Exception as e:
        logger.error(f"User signup failed: {e}")
        raise HTTPException(status_code=400, detail="User signup failed")

# User Login (Token Retrieval) 🔹 This should be handled on the frontend using Firebase SDK
@app.post("/login")
def login():
    return {
        "message": "Use Firebase Authentication SDK to log in and obtain a token."
    }

class UserProfileUpdate(BaseModel):
    investment_type: str = None
    experience_level: str = None

@app.post("/update-profile")
def update_profile(profile: UserProfileUpdate, user=Depends(verify_token)):
    try:
        user_id = user["uid"]  # Make sure you're getting user ID from the token
        update_data = {}

        if profile.investment_type:
            update_data["investment_type"] = profile.investment_type
        if profile.experience_level:
            update_data["experience_level"] = profile.experience_level

        if update_data:
            db.collection("users").document(user_id).update(update_data)
        else:
            raise HTTPException(status_code=400, detail="No valid fields to update.")

        return {"message": "Profile updated successfully"}

    except Exception as e:
        logger.error(f"Profile update failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update profile")

@app.post("/recommend")
def recommend(query: InvestmentQuery, user=Depends(verify_token)):
    try:
        user_id = user.get("uid")
        user_doc = db.collection("users").document(user_id).get()

        user_input = query.query.strip().lower()

        # 👇 Debug input
        print(f"Received input: {user_input}")

        # Session logic
        if len(user_input.split()) <= 3:
            previous_prompt = user_sessions.get(user_id, "")
            combined_prompt = f"{previous_prompt} {user_input}"
        else:
            combined_prompt = user_input

        # 👇 Log final user prompt
        print(f"Final user prompt: {combined_prompt}")

        user_sessions[user_id] = combined_prompt

        if user_doc.exists:
            user_data = user_doc.to_dict()
            prompt = (
                f"The user is a {user_data.get('experience_level', 'beginner')} investor "
                f"interested in {user_data.get('investment_type', 'long-term')} investments. "
                f"They asked: '{combined_prompt}'. "
                f"Give a detailed, beginner-friendly explanation using clear language. "
                f"Break down any financial jargon and include examples where helpful. "
            )
        else:
            prompt = (
                f"The user asked: '{combined_prompt}'. "
                f"Respond with a clear, informative, and easy-to-understand explanation. "
                f"Avoid vague responses. If they asked about a concept like stocks, explain what it is with examples."
            )


        # 👇 Log prompt before sending to Gemini
        print("Prompt sent to Gemini:\n", prompt)

        final_prompt = f"{SYSTEM_PROMPT}\nUser Info:\n{prompt}\nAssistant:"
        recommendation = generate_investment_advice(final_prompt)
        print(recommendation)

        return {"recommendation": recommendation["response"]}


    except Exception as e:
        logger.error(f"Error in /recommend: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")

# Allow CORS (🔹 Restrict later in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 🔹 Restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home Endpoint
@app.get("/")
def home():
    return {"message": "Welcome to GenAI Financial Assistant!"}


connected_clients = []

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    connected_clients.append({"id": user_id, "ws": websocket})
    try:
        while True:
            await websocket.receive_text()  # Keep connection alive
    except WebSocketDisconnect:
        connected_clients[:] = [client for client in connected_clients if client["id"] != user_id]



def listen_for_profile_changes():
    def on_snapshot(doc_snapshot, changes, read_time):
        for doc in doc_snapshot:
            user_id = doc.id
            user_data = doc.to_dict()
            
            # Send update to relevant WebSocket client
            for client in connected_clients:
                if client["id"] == user_id:
                    asyncio.run(client["ws"].send_json({"update": user_data}))

    users_ref = db.collection("users")
    users_ref.on_snapshot(on_snapshot)

# Run Firestore listener in a separate thread
threading.Thread(target=listen_for_profile_changes, daemon=True).start()