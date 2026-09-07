"""
SkillVista AI Service — DistilBERT Semantic Course Matching Engine
FastAPI microservice for semantic similarity using DistilBERT model.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

app = FastAPI(
    title="SkillVista AI Service — DistilBERT Semantic Engine",
    description="Microservice providing DistilBERT-based semantic similarity and course recommendation for SkillVista competency gap analysis.",
    version="1.0.0"
)

# Enable CORS for local Node backend & frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instance
model = None
MODEL_NAME = os.getenv("DISTILBERT_MODEL", "distilbert-base-nli-stsb-mean-tokens")

@app.on_event("startup")
def load_model():
    global model
    print(f"🚀 Loading DistilBERT model: {MODEL_NAME}...")
    try:
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer(MODEL_NAME)
        print("✅ DistilBERT model loaded successfully!")
    except Exception as e:
        print(f"⚠️ Notice: DistilBERT lazy-loading mode active ({e}).")

class CourseItem(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = ""
    provider: Optional[str] = ""

class MatchRequest(BaseModel):
    skill_gap: str
    courses: List[CourseItem]

class RecommendationResult(BaseModel):
    course_id: Optional[str] = None
    title: str
    provider: Optional[str] = ""
    score: float

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "SkillVista DistilBERT AI Service",
        "model": MODEL_NAME,
        "model_loaded": model is not None
    }

@app.post("/match")
def match_courses(req: MatchRequest):
    if not req.skill_gap or not req.courses:
        raise HTTPException(status_code=400, detail="skill_gap and courses list are required.")

    skill_gap = req.skill_gap
    course_texts = [
        f"{c.title}. {c.description or ''}" for c in req.courses
    ]

    global model
    if model is None:
        try:
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer(MODEL_NAME)
        except Exception as e:
            # Fallback similarity matcher if sentence-transformers is not yet installed
            results = []
            gap_words = set(skill_gap.lower().split())
            for idx, c in enumerate(req.courses):
                c_words = set(course_texts[idx].lower().split())
                intersection = gap_words.intersection(c_words)
                union = gap_words.union(c_words)
                jaccard = len(intersection) / max(len(union), 1)
                score = round(min(0.95, max(0.30, jaccard * 3 + 0.35)), 4)
                results.append({
                    "course_id": c.id,
                    "title": c.title,
                    "provider": c.provider or "iGOT Karmayogi",
                    "score": score
                })
            results.sort(key=lambda x: x["score"], reverse=True)
            return results

    try:
        from sentence_transformers import util
        gap_embedding = model.encode(skill_gap, convert_to_tensor=True)
        course_embeddings = model.encode(course_texts, convert_to_tensor=True)

        cosine_scores = util.cos_sim(gap_embedding, course_embeddings)[0]

        results = []
        for c, score in zip(req.courses, cosine_scores):
            results.append({
                "course_id": c.id,
                "title": c.title,
                "provider": c.provider or "iGOT Karmayogi",
                "score": round(float(score), 4)
            })

        results.sort(key=lambda x: x["score"], reverse=True)
        return results
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"DistilBERT matching error: {str(err)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
