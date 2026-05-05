import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import DecisionContext, CouncilResponse
from orchestrator import CouncilOrchestrator
from dotenv import load_dotenv
import httpx

load_dotenv()

app = FastAPI(title="PRAXIS API", description="AI Council Backend for Praxis Financial Simulator")

# Configure CORS for the Vite frontend
frontend_url = os.getenv("FRONTEND_URL", "*")
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
if frontend_url != "*":
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if frontend_url == "*" else origins,
    allow_credentials=False if frontend_url == "*" else True,
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

@app.get("/api/market-data")
async def get_market_data():
    """
    Fetches real macro-economic data from FRED if API key is provided.
    Fallback to mocked latest data if no key is present.
    """
    fred_key = os.getenv("FRED_API_KEY")
    if not fred_key:
        return {"fedRate": 5.25, "inflation": 3.1}

    try:
        async with httpx.AsyncClient() as client:
            # Fed Funds Rate (FEDFUNDS)
            fed_res = await client.get(
                f"https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key={fred_key}&file_type=json&limit=1&sort_order=desc"
            )
            fed_data = fed_res.json()
            fed_rate = float(fed_data['observations'][0]['value']) if 'observations' in fed_data else 5.25

            # Inflation (CPIAUCSL - Percent Change from Year Ago)
            cpi_res = await client.get(
                f"https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key={fred_key}&file_type=json&limit=1&sort_order=desc&units=pc1"
            )
            cpi_data = cpi_res.json()
            inflation_rate = float(cpi_data['observations'][0]['value']) if 'observations' in cpi_data and len(cpi_data['observations']) > 0 else 3.1
            
            return {"fedRate": fed_rate, "inflation": round(inflation_rate, 2)}
    except Exception as e:
        print(f"FRED API error: {e}")
        return {"fedRate": 5.25, "inflation": 3.1}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
