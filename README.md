# 🌌 PRAXIS
> **QUANTUM FINANCIAL TIMELINE SIMULATOR**
> 
> *A high-fidelity digital twin environment for the deliberation of parallel financial futures.*

---

## 💎 THE CORE THESIS
Praxis is built on the principle that financial literacy isn't about math—it's about **behavioral muscle memory**. By creating a high-resolution **Financial Twin** and subjecting it to multi-year "Black Swan" events, Praxis allows for the deep exploration of financial causality in a safe, multi-agent environment.

---

## 🏛️ ARCHITECTURAL PILLARS

### 1. THE MULTI-AGENT COUNCIL
At the heart of Praxis is a three-phase deliberation engine. When a decision is made, the system doesn't just calculate interest—it sparks a debate between three specialized AI agents (Llama 3.3 70B):

- **🛡️ THE CONSERVATOR**: Prioritizes capital preservation, liquidity ratios, and downside protection. It is the voice of "Safety First."
- **📈 THE GROWER**: Prioritizes compound growth, opportunity cost, and asset acceleration. It is the voice of "Wealth at Speed."
- **🧠 THE BEHAVIORIST**: Analyzes the psychological impact of decisions, targeting loss aversion, lifestyle inflation, and hedonic adaptation.

**The Deliberation Protocol**:
- **Phase I**: Parallel independent analysis of the decision vector.
- **Phase II**: Direct cross-examination (Rebuttals) between agents to find logical flaws.
- **Phase III**: Final synthesis into a "CFO Recommendation" with a Confidence Score.

### 2. THE 3D DATA UNIVERSE (GALAXY ENGINE)
A Three.js-powered visual representation of a user’s financial state. It is a data-driven sculpture where:
- **Orbital Inclination**: Asset classes occupy distinct 3D planes to prevent visual congestion.
- **Satellite Moons**: Individual portfolio components (Stocks, Bonds, Crypto) orbit their parent planets with physics tied to their real-world volatility.
- **Debt Gravity**: A chaotic octahedron that physically warps the orbits of your growth planets, visualizing the "drag" of interest rates.

### 3. THE TEMPORAL ENGINE
A deterministic simulation layer that projects net worth, passive income, and debt-to-income ratios over a 10-year horizon. It integrates **Probabilistic Life Events**—randomized hurdles or boosts calculated based on the user's specific career goals and location.

---

## 🛠️ SYSTEM BLUEPRINT

### FRONTEND STACK
- **Visuals**: React Three Fiber (Three.js) + Framer Motion.
- **Data**: Recharts for parallel-timeline visualization.
- **State**: Zustand-driven financial twin persistence.
- **UI**: Custom "Cockpit" design system built for data density.

### BACKEND STACK
- **Engine**: FastAPI (Python) asynchronous orchestrator.
- **Intelligence**: Groq Cloud Integration (Llama 3.3 70B Versatile).
- **Schema**: Strict Pydantic-enforced JSON structures for agent deliberation.

---

## 📁 PROJECT TOPOLOGY

```text
├── api/
│   ├── agents/           # Specialized psychological profiles
│   ├── orchestrator.py   # 3-phase deliberation logic
│   └── models.py         # The Pydantic blueprint
├── src/
│   ├── components/
│   │   ├── galaxy/       # 3D Data Universe Engine
│   │   └── simulation/   # Narrative loop components
│   ├── data/             # Deep scenarios & "Black Swan" events
│   └── store/            # Twin state management
└── README.md             # The Blueprint
```

## 🚀 LOCAL SETUP & EXECUTION (West Hacks Judges)

To run the full Praxis environment locally, you will need two terminal windows.

### 1. The Frontend (React/Vite)
```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

### 2. The AI Backend (FastAPI + Groq)
*(Note: Requires a free Groq API key)*
```bash
# Navigate to the API folder
cd api

# Install Python dependencies
pip install -r requirements.txt

# Create a .env file and add your Groq API key:
echo "GROQ_API_KEY=your_key_here" > .env

# Start the Python orchestration server
uvicorn orchestrator:app --reload --port 8000
```

*(If the backend is not running, Praxis will automatically fallback to a lightning-fast deterministic mock engine so you can still experience the UI and scenarios without an API key!)*

---

> **Built for West Hacks 2026**
> *Developed to push Fintech Education forward for the 13-19 demographic.*
