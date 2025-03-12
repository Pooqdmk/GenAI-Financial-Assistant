from fastapi import FastAPI, HTTPException, Depends
from firebase_admin import auth
import openai
import firebase_admin
from firebase_admin import credentials
from pydantic import BaseModel

# Initialize Firebase
cred = credentials.Certificate("firebase_key.json")  
firebase_admin.initialize_app(cred)

# Initialize FastAPI
app = FastAPI()

# OpenAI API Key (Load securely in production)
openai.api_key = "your_openai_api_key"

# 📌 User Authentication Models
class UserAuth(BaseModel):
    email: str
    password: str

# 📌 Investment Query Model
class InvestmentQuery(BaseModel):
    investment_type: str  # "short-term" or "long-term"
    experience_level: str  # "beginner" or "experienced"

# ✅ Health Check
@app.get("/healthcheck")
def health_check():
    return {"status": "OK"}

# ✅ User Signup
@app.post("/signup")
def signup(user: UserAuth):
    try:
        new_user = auth.create_user(email=user.email, password=user.password)
        return {"message": "User created", "uid": new_user.uid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ✅ User Login (Firebase Auth Token)
@app.post("/login")
def login(user: UserAuth):
    # This will be handled on the frontend via Firebase Authentication
    return {"message": "Use Firebase Client SDK for login"}

# ✅ Get Investment Recommendations (OpenAI)
@app.post("/recommend")
def recommend(query: InvestmentQuery):
    prompt = f"Give me the best {query.investment_type} investment options for a {query.experience_level} investor."
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return {"recommendation": response["choices"][0]["message"]["content"]}

# ✅ FastAPI Docs (Automatic)
@app.get("/")
def home():
    return {"message": "Welcome to GenAI Financial Assistant!"}
