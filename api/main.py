import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import DecisionContext, CouncilResponse
from orchestrator import CouncilOrchestrator
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PRAXIS API", description="AI Council Backend for Praxis Financial Simulator")

# Configure CORS for the Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = CouncilOrchestrator()

@app.get("/health")
def health_check():
    api_key = os.getenv("GROQ_API_KEY")
    return {
        "status": "ok", 
        "ai_enabled": bool(api_key and api_key.startswith("gsk_"))
    }

@app.post("/api/deliberate", response_model=CouncilResponse)
async def deliberate_decision(context: DecisionContext):
    """
    Triggers the Multi-Agent Council to debate a specific financial scenario
    based on the user's twin profile and available options.
    """
    try:
        response = await orchestrator.deliberate(context)
        return response
    except Exception as e:
        print(f"Deliberation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
