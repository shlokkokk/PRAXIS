from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ScenarioOption(BaseModel):
    id: str
    label: str
    description: str

class DecisionContext(BaseModel):
    scenario_id: str
    node_id: str
    title: str
    context: str
    options: List[ScenarioOption]
    user_profile: Dict[str, Any]
    financial_twin: Dict[str, Any]

class AgentOpinion(BaseModel):
    agentId: str
    agentName: str
    recommendation: str
    reasoning: str
    keyPoints: List[str]
    recommendedOption: str
    confidence: float
    tone: str

class AgentRebuttal(BaseModel):
    agentId: str
    targetAgentId: str
    rebuttal: str
    concessions: List[str]
    counterPoints: List[str]

class DeliberationSynthesis(BaseModel):
    summary: str
    agreements: List[str]
    disagreements: List[str]
    finalRecommendation: str
    confidenceScore: float
    tradeOffs: List[str]

class CouncilResponse(BaseModel):
    agents: List[AgentOpinion]
    rebuttals: List[AgentRebuttal]
    synthesis: DeliberationSynthesis
    biasWarnings: List[str]
    timestamp: float
