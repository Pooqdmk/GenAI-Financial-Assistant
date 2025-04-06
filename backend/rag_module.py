# rag_module.py
from sentence_transformers import SentenceTransformer
import numpy as np
import requests
import os
from sklearn.metrics.pairwise import cosine_similarity

from dotenv import load_dotenv
load_dotenv()


# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load API Key
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY") or "your_finnhub_api_key_here"

def fetch_finnhub_news():
    try:
        url = f"https://finnhub.io/api/v1/news?category=general&token={FINNHUB_API_KEY}"
        response = requests.get(url)
        data = response.json()

        if isinstance(data, list):
            articles = [item["headline"] + ". " + item.get("summary", "") for item in data[:10]]
        else:
            print("⚠️ API error or unexpected response format:", data)
            articles = ["Fallback: Could not fetch news. Please check your API key or quota."]
        
        return articles
    except Exception as e:
        print(f"Error fetching news: {e}")
        return ["Fallback: Index funds are great for passive income and long-term growth."]



# Fetch docs
documents = fetch_finnhub_news()

# Embed all docs
document_embeddings = model.encode(documents)

def retrieve_relevant_docs(query: str, top_k: int = 2):
    query_embedding = model.encode([query])
    sims = cosine_similarity(query_embedding, document_embeddings)[0]
    top_indices = np.argsort(sims)[-top_k:][::-1]
    return [documents[i] for i in top_indices]
