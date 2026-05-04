# PRAXIS — Financial Life Simulator & AI Council
## *Learn Finance by Living It*

**Project Classification:** AI-Native Experiential Learning Platform  
**Target Hackathon:** West Hacks 2026 (Greens Farms Academy) — Theme: *Fintech & Education*  
**Submission Deadline:** June 1st, 2026  
**Status:** Complete Product Blueprint & Technical Specification  
**Date:** May 4, 2026

---

## 1. Elevator Pitch

> **Praxis is the first AI-native "Financial Life Simulator" that does not teach finance through videos or quizzes — it lets you live it.** Create a parallel financial version of yourself, navigate realistic life scenarios with real market data, and watch a council of specialized AI agents debate your major money decisions in real-time. From choosing student loans to picking your first index fund, you learn by making decisions and experiencing decades of consequences in minutes — all visualized in a stunning WebGPU-powered 3D financial universe that runs in your browser.

**In one sentence:** Praxis is The Sims for financial literacy, powered by multi-agent AI, real-world financial data, and immersive 3D visualization.

---

## 2. The Problem (Backed by 2026 Market Data)

### The Financial Literacy Crisis
- **$250 billion+ lost annually** in the U.S. alone to avoidable debt, fees, and poor financial decisions due to lack of education (BeginFin / BPA Research, 2026).
- **81% of consumers** actively want financial education built into their apps, but **only 19% currently receive any guidance** from their financial tools (Plaid Fintech Trends Report, February 2026).
- Gen Z and high schoolers are entering an economy with record student debt, gig-economy income volatility, and increasingly complex financial instruments — yet most U.S. schools still do not require standalone financial literacy courses.

### Why Current Solutions Fail
| Solution Type | Why It Does Not Work |
|---------------|-------------------|
| **Video Courses** (Khan Academy, etc.) | Passive consumption, no transfer to real decisions, high dropout rates |
| **Budgeting Apps** (Mint, YNAB) | Show data but do not teach; users do not understand *why* they should change behavior |
| **Gamified Apps** (BeginFin, etc.) | Use fake currencies and abstract quiz formats; skills do not transfer to real markets |
| **Robo-Advisors** (Wealthfront, etc.) | Manage money for users but teach nothing; creates dependency, not literacy |
| **Stock Simulators** (Investopedia, etc.) | Isolated trading games without life context; teach speculation, not holistic planning |

### The Gap in 2026
There is **no platform** that combines:
1. **Real financial data** (actual market conditions, real cost-of-living, real salaries)
2. **Experiential simulation** (learning through consequential decision-making, not content consumption)
3. **AI-native tutoring** (Specialized Educational Intelligence — domain-specific AI that understands finance deeply, not generic chatbot wrappers)
4. **Immersive visualization** (spatial, interactive representation of financial systems)
5. **Multi-perspective reasoning** (observing AI agents debate trade-offs from different financial philosophies)

**Praxis fills this gap.**

---

## 3. The Solution — Core Concept

### The "Financial Twin" Architecture
Every user gets a **Financial Twin** — a persistent, AI-generated parallel version of themselves living in a realistic simulated economy.

**How the Twin is Born:**
1. **Profile Genesis** — User inputs: age, zip code, career interest, current savings/debt (optional Plaid link for real data seeding), risk temperament, life goals ("buy a car at 18," "graduate debt-free," "start investing early")
2. **Economic Context Injection** — System pulls real data for their location:
   - Median rent, food costs, transport costs via Bureau of Labor Statistics / CEX data
   - Entry-level salary ranges for their target career via Glassdoor/BLS OES
   - Local tax rates via Tax Foundation APIs
   - Real interest rate environment via FRED (Federal Reserve Economic Data)
3. **AI Twin Generation** — Claude/GPT-4o generates a realistic life trajectory: projected income curve, typical expenses, likely life events, probabilistic emergencies — all grounded in the real economic data above

### The Simulation Loop
```
Real World Events -> AI Scenario Engine -> User Decision Point
                                              |
                                              v
Long-term Consequences <- Time Acceleration <- AI Council Deliberation
```

1. **Event Injection** — Real financial news and market events are woven into the user's timeline (e.g., "March 2020: Markets dropped 30% due to COVID. Your portfolio just took a hit. What do you do?")
2. **Council Deliberation** — For major decisions, 3-4 specialized AI agents debate the options aloud, showing their reasoning (see Section 6)
3. **User Decision** — User makes the call
4. **Time Acceleration** — Simulation fast-forwards months or years, showing compound consequences
5. **Feedback Loop** — AI explains what happened, compares to alternative choices, updates user's "Financial Mastery" score

### Key Insight: Learning Through "Regret Architecture"
After each major decision milestone, the system shows the user:
- **What you chose** and its real outcome
- **What the AI Council recommended** and why
- **The optimal path** (given perfect foresight)
- **A "parallel you"** still running the alternate timeline for comparison

This creates **educational regret** — a powerful, emotionally sticky learning mechanism that textbooks cannot replicate.

---

## 4. Feature Specification

### 4.1 Core MVP Features (Hackathon Scope — Build by June 1)

#### Feature 1: Financial Twin Genesis Engine
- **Wizard onboarding** (5-7 questions) generates personalized 10-year financial simulation
- **Two modes:**
  - *Reality Mode:* Links via Plaid to seed with real account balances, real spending patterns
  - *Sandbox Mode:* Starts with median data for their demographic profile
- **Outputs:** Year-by-year projected cash flow, major decision nodes, risk exposure map

#### Feature 2: AI Council Deliberation System
- **3 Specialist Agents** (expandable architecture):
  - **Conservator** (Debt/Emergency Fund specialist — prioritizes security and stability)
  - **Growth** (Investment/Compound Interest specialist — prioritizes long-term wealth building)
  - **Behaviorist** (Psychology/Behavioral Econ specialist — identifies cognitive biases in user's thinking)
- **Visual Debate Interface:** Split-screen showing each agent's avatar, their opening argument, rebuttals, and final consensus/conflict summary
- **Socratic Mode:** Agents ask the user questions before giving answers, forcing active reasoning

#### Feature 3: Scenario Engine (3 Pre-Built + AI-Generated Variations)
- **Scenario A: "The First Paycheck"** — User gets first job at 18/22. Decide: 401k contribution? HSA? Emergency fund? Debt payoff? Apartment budget?
- **Scenario B: "The Market Crash"** — Markets drop 25%. User sees their 401k down $5,000. Panic sell? Buy more? Do nothing? Each choice simulated forward 5 years with real recovery data.
- **Scenario C: "The Opportunity"** — User inherits $10,000. Start a side hustle? Pay off student loans? Invest in S&P 500? Emergency fund? Crypto? (Each option simulated using historical data)
- **AI Variation Engine:** Same scenarios but with randomized variables (inheritance amount, market timing, job offers) so no two runs are identical

#### Feature 4: WebGPU 3D Financial Universe
- **The "Galaxy" View:** Each financial instrument or decision is a node in a 3D force-directed graph
  - Stocks = glowing orbs with real-time price pulsing
  - Bonds = stable anchor points
  - Cash = bright central star
  - Debt = gravity wells (dark nodes pulling everything inward)
- **Portfolio Constellation:** User's holdings form a personal constellation that grows/shifts as they progress
- **Time Travel Slider:** Drag to scrub through simulated years; watch the galaxy evolve, debts shrink, investments grow
- **Risk Visualization:** Volatility rendered as orbital instability — high-risk assets wobble erratically
- **Particle Market Stream:** 100,000+ particles representing market data flowing in real-time (WebGPU compute shaders)

#### Feature 5: Real Market Data Integration
- Live stock/ETF/crypto prices via **Yahoo Finance API** or **Polygon.io**
- Historical data for backtesting scenarios (e.g., "What if you invested in AAPL in 2015?")
- Economic indicators from **FRED API** (interest rates, inflation, unemployment)
- **Not for trading:** All data used purely for educational simulation and visualization

### 4.2 Post-Hackathon Scale Features (V1.0+)

#### Expanded Council (7 Agents)
- **Tax Strategist** — Optimizes for tax-advantaged accounts, deductions, brackets
- **Entrepreneur** — Evaluates side hustle vs. W-2 optimization
- **Housing** — Rent vs. buy analysis, mortgage optimization
- **Insurance** — Risk pooling, life/disability/health trade-offs

#### Multiplayer / Cohort Mode
- **Classroom Integration:** Teachers assign scenarios, students compete for highest "Financial Wellness Score"
- **Family Mode:** Couples/families link twins to make household financial decisions together
- **Leaderboards:** Anonymous ranking by demographic cohort ("Top 10% of 18-year-olds in Connecticut")

#### AI-Generated Infinite Scenarios
- Users type natural language goals: "I want to move to Austin and become a UX designer without student debt"
- AI generates a full 10-year scenario with realistic milestones, decision nodes, and market conditions
- Community scenario sharing: Users publish and rate each other's custom scenarios

#### Real-World Action Bridge
- **"Do It For Real" Mode:** After simulation proves a strategy works, one-click execution:
  - Open a real brokerage account (partner API)
  - Set up automatic savings transfers (Plaid transfer APIs)
  - Apply for a real credit card (affiliate)
  - Schedule a real financial advisor consultation

---

## 5. Technical Architecture

### 5.1 Tech Stack (2026-Grade)

| Layer | Technology | Rationale |
|-------|----------|-----------|
| **Frontend** | Next.js 15 (App Router) + TypeScript | Server components for AI streaming, optimal performance |
| **Styling** | Tailwind CSS + shadcn/ui + Framer Motion | Rapid, beautiful, accessible UI development |
| **3D Engine** | Three.js r175+ with WebGPURenderer | Production-ready WebGPU support, auto-fallback to WebGL 2 |
| **State Management** | Zustand + TanStack Query | Lightweight, excellent for server state (market data) |
| **Backend API** | Python FastAPI | Excellent async support for AI streaming, data science ecosystem |
| **AI Orchestration** | Custom multi-agent framework + Anthropic Claude 3.7 Sonnet / OpenAI GPT-4o | Best reasoning capabilities for financial deliberation |
| **Database** | PostgreSQL 16 + TimescaleDB extension | Time-series data for simulations, market history |
| **Cache / Real-time** | Redis | Session state, simulation caching, rate limiting |
| **Auth** | Clerk.dev | Modern auth, social logins, session management |
| **Financial Data** | Polygon.io (stocks), FRED API (macro), Plaid (user bank linking — optional) | Reliable, cost-effective APIs |
| **Hosting** | Vercel (frontend) + Railway/Render (backend + DB) | Fast deploy, generous free tiers |
| **Monorepo** | Turborepo | Clean separation of web, API, shared types |

### 5.2 System Architecture Diagram

```
CLIENT LAYER
  Next.js (React)  +  Three.js WebGPU 3D  +  Zustand Store (Simulation State)
                              |
                              v
                        tRPC Client
                              |
                              v HTTPS/WebSocket
API GATEWAY LAYER
                    FastAPI (Python) + Uvicorn ASGI
                              |
        +---------------------+---------------------+
        |                     |                     |
        v                     v                     v
  AI Council Service    Simulation Engine     Market Data Service
        |                     |                     |
        v                     v                     v
  Claude 3.7 / GPT-4o   PostgreSQL + Timescale   Polygon.io / FRED / Plaid
  APIs                  Redis Cache
```

### 5.3 Data Flow: The Simulation Tick

1. **Frontend** requests scenario start — sends user profile + Twin parameters
2. **Simulation Engine** generates timeline (12 months to 10 years of events)
3. At each **Decision Node**:
   - Frontend pauses, renders 3D visualization of current state
   - AI Council Service generates deliberation (parallel agent calls)
   - User submits decision — stored in PostgreSQL
   - Simulation Engine fast-forwards, calculates consequences
   - Market Data Service injects real historical returns for the period
4. **Results streamed** back via Server-Sent Events or WebSocket for real-time visualization updates

---

## 6. AI Council — Multi-Agent System Design

### 6.1 Why Multi-Agent? (2026 Trend Alignment)

According to the CFA Institute's 2026 research on Agentic AI for Finance, multi-agent systems are replacing single LLM calls in financial applications because:
- **Clear auditability** — each agent's reasoning is logged separately
- **Specialized expertise** — different models/tools for different domains
- **Debate surfaces trade-offs** — no single "correct" answer in personal finance
- **Reduces hallucination** — agents fact-check each other

Praxis leverages this cutting-edge architecture to create **transparent, educational AI deliberation**.

### 6.2 Agent Specifications

#### Agent 1: The Conservator
```yaml
role: Debt & Security Specialist
model: Claude 3.7 Sonnet (extended thinking mode)
system_prompt: |
  You are "The Conservator," a financial advisor who prioritizes 
  financial security above all. You believe in emergency funds, 
  zero debt, stable bonds, and predictable cash flow. 

  RULES:
  - Always calculate worst-case scenarios
  - Emphasize peace of mind and sleep-at-night factor
  - Cite the 2008 and 2020 market crashes as cautionary tales
  - Recommend 6-12 month emergency funds before any investing
  - Favor high-yield savings, Treasury bills, and bond ladders

  TONE: Calm, protective, grandfatherly, slightly risk-averse but loving
```

#### Agent 2: The Grower
```yaml
role: Investment & Compounding Specialist  
model: Claude 3.7 Sonnet
system_prompt: |
  You are "The Grower," a long-term wealth building specialist.
  You worship at the altar of compound interest and time in market.

  RULES:
  - Always show the math: "$500/month at 10% = $1M in 30 years"
  - Favor low-cost index funds (VOO, VTI) over individual stock picking
  - Advocate for tax-advantaged accounts (401k, Roth IRA, HSA)
  - Dismiss market timing; emphasize consistent contribution
  - Cite historical S&P 500 returns and the power of starting early

  TONE: Energetic, mathematical, optimistic, evidence-based
```

#### Agent 3: The Behaviorist
```yaml
role: Cognitive Bias & Psychology Specialist
model: GPT-4o (stronger psychology reasoning)
system_prompt: |
  You are "The Behaviorist," a behavioral economist who studies 
  how humans actually make financial decisions (not how they 
  *should* make them in theory).

  RULES:
  - Identify cognitive biases in the user's stated reasoning
  - Name specific effects: Loss Aversion, Mental Accounting, 
    Hyperbolic Discounting, Sunk Cost Fallacy, Dunning-Kruger
  - Predict how the user will likely *feel* after each option
  - Suggest "nudges" and mental frameworks, not just numbers
  - Reference Daniel Kahneman, Richard Thaler, Dan Ariely

  TONE: Observational, psychological, gently challenging, insightful
```

### 6.3 The Deliberation Protocol

```python
class CouncilDeliberation:
    # Multi-step debate protocol for financial decisions.
    # Each agent sees the others' arguments and responds.

    async def deliberate(decision_context: ScenarioNode) -> CouncilOpinion:
        # Phase 1: Independent Analysis (parallel)
        opinions = await asyncio.gather(
            conservator.analyze(decision_context),
            grower.analyze(decision_context),
            behaviorist.analyze(decision_context)
        )

        # Phase 2: Cross-Examination (parallel with shared context)
        rebuttals = await asyncio.gather(
            conservator.rebut(opinions[1], opinions[2]),
            grower.rebut(opinions[0], opinions[2]),
            behaviorist.rebut(opinions[0], opinions[1])
        )

        # Phase 3: Synthesis
        consensus = await synthesizer.synthesize(
            opinions=opinions,
            rebuttals=rebuttals,
            decision_context=decision_context
        )

        return CouncilOpinion(
            individual_opinions=opinions,
            rebuttals=rebuttals,
            consensus=consensus,
            conflict_points=extract_disagreements(opinions),
            recommended_action=consensus.action,
            user_bias_warning=behaviorist.bias_analysis
        )
```

### 6.4 Educational Output Format

For each decision, the frontend renders a JSON structure with:
- `summary`: High-level council consensus
- `agreement`: What all agents agree on
- `disagreement`: Where they differ and why
- `math_projections`: Numerical outcomes for each option
- `behavioral_warning`: Cognitive biases detected in user reasoning
- `final_recommendation`: Synthesized best path with trade-offs acknowledged

---

## 7. WebGPU 3D Financial Universe — Visualization Design

### 7.1 Why WebGPU? (2026 Production-Ready)

WebGPU has crossed the production threshold in 2026:
- **~70% browser support** across Chrome, Edge, Safari, Firefox (as of early 2026)
- **2-3x performance** over WebGL for compute-heavy workloads
- **Three.js r171+** supports WebGPU with zero-config automatic WebGL fallback
- **Compute shaders** enable GPU-side particle simulation and data transformation
- Used in production by Morningstar, NASA, Google Maps (2026)

### 7.2 The "Praxis Galaxy" Visual System

#### Asset Classes as Celestial Bodies
| Asset | Visual Representation | Dynamic Behavior |
|-------|----------------------|-------------------|
| **Cash** | Bright gold central star | Stable, pulsing gently with interest rate |
| **Stocks/Equity** | Hot blue-white orbs | Orbit speed = volatility; brightness = market cap; trails = price history |
| **Bonds** | Cool green stable rings | Slow, predictable orbits; ring thickness = yield |
| **Debt** | Dark red gravity wells | Pull nearby assets inward; vortex rotation = interest rate |
| **Real Estate** | Large orange planet | Slow orbital period; moons = property tax/maintenance costs |
| **Crypto** | Purple volatile comets | Erratic hyperbolic trajectories; tail length = 24h volume |
| **Your Portfolio** | Personal constellation connecting your holdings | Grows as you acquire; constellation geometry = diversification score |

#### The Time Scrubber
- Horizontal slider at bottom scrubs through simulation years
- As time advances, orbits complete, debts shrink into nothingness, portfolios expand
- **WebGPU instancing** renders 1,000,000+ data points at 60fps (financial market history as background particle field)

#### The Risk Storm
- When a market crash hits the simulation, the galaxy experiences a "solar storm"
- Particles scatter, orbits destabilize, debts grow larger
- User sees their portfolio constellation flicker — emotionally resonant feedback without numbers

### 7.3 Technical Implementation

```typescript
// Three.js WebGPU Renderer Setup (2026)
import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';

const renderer = new WebGPURenderer({ antialias: true });
await renderer.init();

// Compute Shader for Market Particle System
// 100,000 particles representing historical market data
const particleCompute = new THREE.ComputeNode(/* ... */);
particleCompute.count = 100000;

// Instanced rendering for portfolio nodes
const portfolioGeometry = new THREE.IcosahedronGeometry(1, 64);
const portfolioMaterial = new THREE.MeshStandardNodeMaterial({
  color: new THREE.ColorNode(),
  emissive: new THREE.EmissiveNode(), // Glow based on performance
});
const portfolioMesh = new THREE.InstancedMesh(
  portfolioGeometry, 
  portfolioMaterial, 
  500 // Max portfolio holdings
);
```

---

## 8. User Experience Flow

### 8.1 Onboarding (3 Minutes to First Simulation)

1. **Screen 1:** "Welcome to Praxis" — Manifesto text + animated galaxy background
2. **Screen 2:** "Who are you?" — Age, location, career goal, current savings (optional)
3. **Screen 3:** "What is your money personality?" — 5 behavioral questions (loss tolerance, delayed gratification, status importance, research patience, automation comfort)
4. **Screen 4:** "Generating your Financial Twin..." — WebGPU visualization of twin being constructed from data streams
5. **Screen 5:** "Your Twin is Ready" — First scenario loads automatically

### 8.2 The Scenario Experience

The main interface shows:
- **Top:** Current simulation date and scenario title (e.g., "YEAR 1, MONTH 3 — THE FIRST PAYCHECK")
- **Center-left:** 3D Galaxy View showing current financial state
- **Center-right:** AI Council cards with live deliberation
- **Bottom:** Decision options + "See the Future" preview button

### 8.3 The "See the Future" Button

When clicked before deciding, the galaxy splits into **4 parallel timelines**, each showing a rapid 5-year simulation of that option:
- Timeline A: Conservative path — slow, steady, safe
- Timeline B: Growth path — higher variance, potentially better long-term
- Timeline C: Aggressive debt payoff — psychological win, opportunity cost shown
- Timeline D: User's custom path (if they adjusted sliders)

Each timeline rendered as a **thin orbital trail** from the central star. User can hover for exact numbers at any year.

---

## 9. Data Sources & API Integration

| Data Need | Source | Cost | Integration Complexity |
|-----------|--------|------|----------------------|
| Stock/ETF real-time & historical | Polygon.io | Free tier: 5 API calls/min | Low (REST) |
| Macroeconomic indicators (interest, inflation, unemployment) | FRED API (St. Louis Fed) | Free | Low (REST) |
| Cost of living / regional prices | BLS Consumer Expenditure + Census | Free | Medium (batch download) |
| Salary data by career/region | Glassdoor API or BLS OES | Free tier available | Medium |
| User bank account linking (optional) | Plaid | Free sandbox; prod paid | Medium (OAuth flow) |
| Tax calculation | Taxee.io or self-built brackets | Free | Medium |
| Historical market events database | Self-curated + Wikipedia/NewsAPI | Free | High (manual curation) |

---

## 10. Implementation Roadmap

### Phase 0: Foundation (May 5–10, 2026)
- [ ] Initialize monorepo (Turborepo + Next.js + FastAPI)
- [ ] Set up Three.js WebGPU scene with basic galaxy visualization
- [ ] Configure Anthropic/OpenAI API access + multi-agent prompt framework
- [ ] Design database schema (simulation states, user profiles, decision logs)
- [ ] Set up Clerk auth + Vercel deploy pipeline

### Phase 1: The Twin (May 11–15, 2026)
- [ ] Build onboarding wizard + user profile capture
- [ ] Implement Twin generation engine (real data ingestion + AI prompt chain)
- [ ] Create first scenario data structure: "The First Paycheck"
- [ ] Basic 3D visualization: portfolio as simple nodes + lines

### Phase 2: The Council (May 16–20, 2026)
- [ ] Build 3-agent system with distinct prompts
- [ ] Implement deliberation protocol (analyze to rebut to synthesize)
- [ ] Create Council UI: avatar cards, argument display, conflict highlighting
- [ ] Integrate with scenario engine: decisions trigger consequences

### Phase 3: The Universe (May 21–25, 2026)
- [ ] WebGPU particle system for market data (100k particles)
- [ ] Time scrubber with year-by-year state transition
- [ ] Risk storm visual effects (volatility rendering)
- [ ] Parallel timeline visualization ("See the Future" split-screen)

### Phase 4: Polish & Submit (May 26–31, 2026)
- [ ] Add Scenario B (Market Crash) + Scenario C (The Opportunity)
- [ ] AI variation engine (randomized parameters per run)
- [ ] Dashboard: user's "Financial Mastery" score + decision history
- [ ] Performance optimization: reduce AI latency with caching
- [ ] Bug fixes, mobile responsiveness, accessibility audit
- [ ] **Video Demo Script & Recording** (May 30–31)
- [ ] **GitHub Repo Cleanup + README**
- [ ] **Devpost Submission Page**

### Phase 5: Post-Hackathon Scale (June 2026+)
- [ ] Integrate Polygon.io for real-time market data
- [ ] Add Classroom/Cohort mode for teacher assignments
- [ ] Expand to 7-agent council
- [ ] Natural language scenario generation
- [ ] Mobile app (React Native) companion
- [ ] Pitch to Y Combinator / tech accelerators

---

## 11. Competitive Analysis — Why Praxis Wins

| Competitor | Approach | Praxis Differentiation |
|------------|----------|---------------------|
| **BeginFin** (high school platform, 2026) | Bite-size lessons + 4-question quizzes | Praxis is experiential, not instructional; uses real data, not fabricated scenarios |
| **Investopedia Simulator** | Fake-money stock trading game | Praxis teaches holistic life finance, not stock picking; uses real historical events |
| **Zogo** | Gamified financial literacy with points | Praxis has no fake currency; consequences are mathematically real, not gamified |
| **YNAB / Mint** | Budget tracking and categorization | Praxis teaches *why* and *what if*, not just *what happened* |
| **Khan Academy Finance** | Video-based passive learning | Praxis is active, consequential, and personalized; no two users have the same experience |
| **Wealthfront** | Robo-advisor (manages money for you) | Praxis teaches you to manage your own money; builds literacy, not dependency |
| **Paper Trading Apps** | Real-market simulation for trading | Praxis embeds trading in life context; teaches emergency funds and taxes alongside investing |

**The moat:** Multi-agent deliberation + WebGPU visualization + real economic data + personalized life simulation. Each component exists elsewhere; **no one has combined them**.

---

## 12. West Hacks Submission Strategy

### 12.1 Video Demo Script (5 Minutes Max)

**Minute 0:00–0:45 — The Hook & Problem**
- Open with a shocking stat: "$250 billion lost yearly to financial illiteracy"
- Show boring quiz app to user zoning out to quiz score meaningless
- "What if you could learn finance the way pilots learn to fly — in a simulator?"

**Minute 0:45–2:00 — The Product Walkthrough**
- Onboarding wizard (30 seconds real-time)
- "Generating your Financial Twin" animation
- First scenario loads: "The First Paycheck"
- Show the 3D galaxy: cash as a star, debt as gravity well

**Minute 2:00–3:30 — The AI Council (The Killer Feature)**
- "You have $10,000. What do you do?"
- Play the Council deliberation: 3 agents argue, rebut, synthesize
- Show the "See the Future" button to 4 parallel timelines render
- User makes decision to time fast-forwards to consequences shown

**Minute 3:30–4:15 — Technical Depth**
- Briefly show: WebGPU code, multi-agent architecture diagram, real API integrations
- "This isn't a prototype — it's a production-grade architecture"

**Minute 4:15–5:00 — Impact & Vision**
- "Financial literacy shouldn't be a class you sit through. It should be a life you survive — risk-free."
- Future vision: classroom integration, real-world action bridge, every high schooler in America
- Call to action / GitHub + live demo links

### 12.2 GitHub Repository Structure

```
praxis/
├── README.md                 # Detailed setup + architecture + demo link
├── LICENSE                   # MIT (open source for hackathon requirement)
├── apps/
│   ├── web/                  # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/          # App router pages
│   │   │   ├── components/   # React components
│   │   │   ├── lib/three/    # WebGPU 3D scene code
│   │   │   └── stores/       # Zustand state management
│   │   └── package.json
│   └── api/                  # FastAPI backend
│       ├── src/
│       │   ├── agents/       # Multi-agent council code
│       │   ├── simulation/   # Scenario engine
│       │   ├── market/       # Polygon/FRED data clients
│       │   └── models/       # Pydantic schemas + DB models
│       └── requirements.txt
├── packages/
│   ├── shared-types/         # TypeScript + Python shared interfaces
│   └── ui-components/        # shadcn/ui component library
├── infra/
│   ├── docker-compose.yml    # Local dev stack
│   └── terraform/            # Production infra (optional)
└── docs/
    ├── architecture.md       # System design document
    ├── api-reference.md      # Endpoint documentation
    └── scenario-guide.md     # Scenario writing guide
```

### 12.3 Devpost Project Description (Draft)

**Project Name:** Praxis — Financial Life Simulator  
**Tagline:** Learn finance by living it.  
**Built With:** Next.js, Three.js (WebGPU), Python FastAPI, Anthropic Claude, PostgreSQL, Polygon.io, FRED API

**What issue are you solving?**
Financial literacy education is broken. 81% of consumers want financial guidance from their apps, but only 19% receive any. High schoolers graduate without understanding compound interest, taxes, or investing. Current solutions are either passive video courses (low retention), fake-currency games (no real-world transfer), or robo-advisors that manage money without teaching anything. We're facing a $250B+ annual literacy crisis in the U.S. alone.

**How does your project address it?**
Praxis is the first AI-native "Financial Life Simulator." Instead of watching videos or taking quizzes, users create a "Financial Twin" — a parallel simulated version of themselves with realistic income, expenses, and life events based on real economic data. They navigate major financial decisions (first paycheck, market crashes, inheritance, debt payoff) while observing a **Council of specialized AI agents** debate the options in real-time. Users learn by making consequential decisions and watching time-accelerated outcomes — with real market data, real historical events, and real mathematical consequences.

Key innovations:
- **Multi-Agent AI Council:** Three specialized AI agents (Conservator, Grower, Behaviorist) independently analyze, cross-examine each other's reasoning, and synthesize recommendations — teaching users how to think, not what to think.
- **WebGPU 3D Financial Universe:** A browser-based immersive visualization where portfolio assets are celestial bodies, debt is gravity, and risk is orbital instability — rendering 100,000+ data points at 60fps.
- **Real Data Foundation:** Polygon.io market data, Federal Reserve economic indicators, Bureau of Labor Statistics salary/cost data, and optional Plaid bank linking ensure every scenario reflects reality.
- **Regret Architecture:** After each decision, users see what they chose, what the Council recommended, and a "parallel you" running the alternate timeline — creating sticky, emotionally resonant learning.

**What was the hardest part of the build?**
The multi-agent deliberation system was the most complex challenge. Getting three independent AI agents to genuinely debate (not just agree politely) required careful prompt engineering with explicit disagreement rules, staged rebuttal rounds, and a synthesis layer that preserves conflict rather than smoothing it over. We also had to ensure financial accuracy — the agents needed access to real tax brackets, historical market returns, and regional cost data to avoid hallucinating numbers. Balancing this technical depth with the WebGPU visualization pipeline (compute shaders for particle systems, instanced rendering for portfolio nodes) made this our most ambitious integration challenge.

**Try it live:** [URL]  
**Video demo:** [URL]  
**GitHub:** [URL]

---

## 13. Future Vision & Scalability

### 13.1 The Education Market Angle
Praxis isn't just a fintech hackathon project — it's an **operating system for experiential financial education**.

**School Integration (B2B SaaS):**
- Teachers assign scenario modules ("Module 3: Credit Cards and Interest")
- Students complete simulations, submit decision logs + reflection essays
- Auto-graded based on financial wellness outcomes, not just "correct answers"
- District-level dashboards showing cohort financial literacy growth

**Partnership Path:**
- **Credit Unions / Community Banks:** White-label Praxis as customer education to reduces default rates, increases product adoption
- **Employers:** Embed as financial wellness benefit to reduce financial stress, increase 401k participation
- **Fintech Apps:** Praxis API provides "educational layer" for neobanks and robo-advisors to solves the 81% education demand gap

### 13.2 Beyond Finance — The "Praxis Engine"
The underlying architecture (AI Twin + Multi-Agent Council + WebGPU Visualization + Real Data) applies to any complex decision domain:
- **Praxis for Careers:** Simulate choosing college major, graduate school, career pivots with real salary data
- **Praxis for Entrepreneurs:** Simulate startup funding decisions, burn rate management, equity splits
- **Praxis for Health:** Simulate insurance plan selection, HSA vs. FSA, procedure cost shopping

### 13.3 Monetization (Post-Hackathon)
| Tier | Price | Features |
|------|-------|----------|
| **Student** | Free | 3 core scenarios, basic council, public community scenarios |
| **Learner** | $8/month | Unlimited scenarios, all 7 agents, custom scenario builder, decision history |
| **Classroom** | $5/student/semester | Teacher dashboard, assignment tools, gradebook integration, LMS connectors |
| **Enterprise** | Custom | White-label, API access, SSO, custom scenario development, analytics |

### 13.4 The Long-Term Mission
> *"By 2030, every high school student in America will graduate having survived 20 major financial life decisions in Praxis before making their first one in reality."*

---

## 14. Appendix: Technical Deep Dives

### A.1 Multi-Agent Prompt Engineering (Extended)
To prevent the agents from simply agreeing with each other, each agent prompt includes:
- **Explicit disagreement rules:** "You MUST find at least one flaw in another agent's reasoning"
- **Role anchoring:** "You represent [philosophy], not consensus"
- **User bias injection:** The Behaviorist specifically analyzes the user's stated reasoning and flags biases, forcing the other agents to respond to psychological reality, not just mathematical optimality
- **Stochastic temperature:** Agents run at slightly different temperatures (Conservator: 0.3, Grower: 0.5, Behaviorist: 0.7) to ensure genuine cognitive diversity

### A.2 WebGPU Performance Budget
- **Target:** 60fps on M1 MacBook Air / Intel i5 integrated / Snapdragon 8 Gen 2
- **Particle count:** 100,000 market history particles (compute shader updated)
- **Portfolio nodes:** Max 50 holdings, instanced mesh
- **Galaxy background:** 5,000 star field points
- **Fallback:** WebGL 2 renderer for older devices (Three.js auto-fallback)

### A.3 AI Cost Estimation (MVP)
- **Claude 3.7 Sonnet API:** ~$0.003/input token, $0.015/output token
- **Per deliberation:** ~8K input tokens (system prompts + context) + ~4K output tokens (3 agents x ~1.3K each)
- **Cost per decision:** ~$0.08-$0.12
- **With caching:** ~60% reduction via prompt caching (Claude's 2026 feature)
- **Monthly run-rate (100 active users, 10 decisions each):** ~$100-$150

### A.4 Database Schema (Core Tables)
```sql
-- Users (managed by Clerk, minimal local data)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    demographic JSONB, -- age, location, career, etc.
    money_personality JSONB -- quiz results
);

-- Simulations (one per scenario run)
CREATE TABLE simulations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id),
    scenario_type TEXT NOT NULL, -- 'first_paycheck', 'market_crash', etc.
    twin_config JSONB NOT NULL, -- generated twin parameters
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    final_wellness_score DECIMAL(5,2)
);

-- Decision Nodes (each point where user had to choose)
CREATE TABLE decision_nodes (
    id UUID PRIMARY KEY,
    simulation_id UUID REFERENCES simulations(id),
    node_index INT NOT NULL, -- position in timeline
    scenario_context TEXT NOT NULL,
    council_deliberation JSONB NOT NULL, -- full agent outputs
    user_choice TEXT NOT NULL,
    alternate_projections JSONB NOT NULL, -- what-if data
    actual_outcome JSONB -- result after time acceleration
);

-- Market Data Cache (TimescaleDB hypertable)
CREATE TABLE market_snapshots (
    time TIMESTAMPTZ NOT NULL,
    ticker TEXT NOT NULL,
    price DECIMAL(12,4),
    volume BIGINT,
    volatility DECIMAL(8,4)
);
SELECT create_hypertable('market_snapshots', 'time');
```

---

## 15. Quick Reference: West Hacks Requirements Checklist

| Requirement | Status | Notes |
|------------|--------|-------|
| **Theme Alignment** | Strong | Directly answers "how can technology help teach finance/push education forward?" |
| **Video Demo (<=5 min)** | Script ready | See Section 12.1 — record May 30-31 |
| **Working Project** | Build target | Live URL via Vercel; functional by May 31 |
| **Public GitHub Repo** | Setup ready | MIT license, clean README, runnable locally with docker-compose |
| **Devpost Description** | Draft ready | See Section 12.3 — copy, refine, submit |
| **Problem Statement** | Defined | Financial literacy crisis, $250B annual cost |
| **Solution Explanation** | Detailed | AI-native experiential simulation with multi-agent deliberation |
| **Hardest Part** | Identified | Multi-agent debate system + WebGPU integration |

---

**Document Version:** 1.0  
**Prepared:** May 4, 2026  
**Next Step:** Initialize repository and begin Phase 0 development.

---

> *"Tell me and I forget. Teach me and I remember. Involve me and I learn. — Benjamin Franklin"*
>
> **Praxis does not just involve you — it makes you live it.**

alr so yeah i wanted to build this project fully so i gave a vague idea to another ai to make documentation of this project and he made this blueprint i love this ngl but yeah you dont have to exactly follow this blueprint u can make changes and stuff but yeah this is the idea like the core idea of what i wanted to build but yeah i want you to build this whole project but like ya know like this is the minimmum idea i want u to do 1000x better than this blueprint we gotta make changes here and there and stuff but yeah just build this project like you have full freedom to make changes and stuff you can add or implement your own idea or anything just make this perfect project use this blueprint md as refernce of what to make the full concept and everything just build it well and if u want me to manually do something get any key or like anything jus make a todo.md in and add all the stuff u need me to do there okay i will do it manually if needed like yeah make this project fully like fully and yeah main points: there shouldnt be any hardcoded lame bad coding shit okay i want everything to be super perfect and well made and yeah make it super interactive and user friendly make it fun and engaging make it like people will want to play this and not just learn but enjoy it make it so that people learn from it like without even realizing they are learning make it fun make it interactive make it engaging make it super duper cool and like the ui ux should be super cool godly and perfect d with nice colours animations designs transitions everything super smooth working perfectly i trust u you can do it and make it 1000x better 

yeah you can do your own tech stack or make changes as you may js use this idea as core and make it a thousand times better and do in parts or sections one by one so u dont reach limit of output generation and yeah winning a hackathon is just a by product of this cuz this will be like a really big industry level big super cool project so dont give so much importance on hackathon focus more on making this super perfect i may submit it anywhere or this may be my that big project like super nice so make it super perfect and godly okay yeah and add more steps and all in todo so ik what to do exactly bro we dont fking need it perfect by june 1 its jus there for timepass ignore thehackathon make it 1000x better than that scope blueprint make ti super good perfect top tier and yeah groq is good for now it will be local till i test and all but maybe later do on render vercel yeah ig and jus make the 3dsuper perfect so it never fails and also super cool make it all covering super good 