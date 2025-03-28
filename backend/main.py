from fastapi import FastAPI, HTTPException, Depends, Security
from firebase_admin import auth, credentials, firestore, initialize_app
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import google.generativeai as genai
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import logging
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

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
"""

# Generate Investment Advice
def generate_investment_advice(prompt: str):
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(f"{SYSTEM_PROMPT}\nUser: {prompt}\nAssistant:")
        return response.text if response else "No response from AI."
    except Exception as e:
        logging.error(f"Error generating content: {e}")
        return "Failed to generate response."

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
    investment_type: str  # "short-term" or "long-term"
    experience_level: str  # "beginner" or "experienced"

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

# Update User Profile (Investment Preferences)
@app.post("/update-profile")
def update_profile(query: InvestmentQuery, user=Depends(verify_token)):
    try:
        user_id = user.get("uid")
        db.collection("users").document(user_id).update({
            "investment_type": query.investment_type,
            "experience_level": query.experience_level
        })
        return {"message": "Profile updated successfully"}
    except Exception as e:
        logger.error(f"Profile update failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update profile")

# Get Investment Recommendations (Using Gemini AI)
@app.post("/recommend")
def recommend(query: InvestmentQuery, user=Depends(verify_token)):
    try:
        user_id = user.get("uid")
        user_doc = db.collection("users").document(user_id).get()

        # Check if user profile exists
        if user_doc.exists:
            user_data = user_doc.to_dict()
            prompt = f"The user is a {user_data.get('experience_level', 'beginner')} investor looking for {user_data.get('investment_type', 'long-term')} investments."
        else:
            # Ask friendly follow-up questions if data is missing
            prompt = f"The user is looking for investment advice but hasn't provided details. Start by asking if they prefer low risk, high growth, or balanced investments."

        recommendation = generate_investment_advice(prompt)
        return {"recommendation": recommendation}

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
