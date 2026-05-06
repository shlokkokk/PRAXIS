import asyncio
import json
from typing import List, Dict, Any
from models import DecisionContext, CouncilResponse, AgentOpinion, AgentRebuttal, DeliberationSynthesis
from agents.conservator import ConservatorAgent
from agents.grower import GrowerAgent
from agents.behaviorist import BehavioristAgent

class CouncilOrchestrator:
    def __init__(self):
        self.conservator = ConservatorAgent()
        self.grower = GrowerAgent()
        self.behaviorist = BehavioristAgent()
        self.agents = [self.conservator, self.grower, self.behaviorist]

    async def deliberate(self, context: DecisionContext) -> CouncilResponse:
        # Phase 1: Parallel Independent Analysis
        opinions = await asyncio.gather(
            *[agent.analyze_decision(context) for agent in self.agents]
        )
        
        # Phase 2: Cross-Examination (Rebuttals)
        # For hackathon MVP, we'll do a simplified synthetic rebuttal generation
        # by passing the opinions to the base agent to generate rebuttals.
        # In a full version, each agent would individually read the others' opinions.
        rebuttals = await self._generate_rebuttals(context, opinions)
        
        # Phase 3: Synthesis
        synthesis, bias_warnings = await self._generate_synthesis(context, opinions, rebuttals)
        
        import time
        return CouncilResponse(
            agents=opinions,
            rebuttals=rebuttals,
            synthesis=synthesis,
            biasWarnings=bias_warnings,
            timestamp=time.time()
        )

    async def _generate_rebuttals(self, context: DecisionContext, opinions: List[AgentOpinion]) -> List[AgentRebuttal]:
        # Synthesize a prompt for the behaviorist to act as the moderator generating the rebuttals
        # (This saves API calls and time vs having all 3 agents cross-examine each other)
        
        prompt = f"""
        You are moderating a debate between three financial advisors:
        1. The Conservator (Risk-averse, security first)
        2. The Grower (Growth-focused, compound interest)
        3. The Behaviorist (Psychology, sustainability)
        
        Here are their independent opinions on a user's decision:
        {json.dumps([o.model_dump() for o in opinions], indent=2)}
        
        Generate exactly 3 rebuttals where one agent directly challenges another agent's recommendation.
        For example, the Grower might challenge the Conservator for being too timid.
        CRITICAL RULES:
        1. Use ONLY these exact strings for 'agentId' and 'targetAgentId': 'conservator', 'grower', 'behaviorist'.
        2. An agent MUST NOT rebut themselves (agentId and targetAgentId must be different).
        3. Ensure variety: try to have each agent participate at least once.
        """
        
        # We'll use a temporary Pydantic model for the Groq generation
        from pydantic import BaseModel
        class RebuttalList(BaseModel):
            rebuttals: List[AgentRebuttal]
            
        try:
            result = await self.behaviorist._generate_json(prompt, RebuttalList)
            return result.rebuttals
        except Exception as e:
            print(f"Failed to generate real rebuttals: {e}")
            # Fallback mock rebuttal if Groq fails
            return []

    async def _generate_synthesis(self, context: DecisionContext, opinions: List[AgentOpinion], rebuttals: List[AgentRebuttal]) -> tuple[DeliberationSynthesis, List[str]]:
        prompt = f"""
        You are the Chief Financial Officer summarizing a heated debate among your advisors.
        
        Scenario: {context.title}
        
        Advisors' Opinions:
        {json.dumps([o.model_dump() for o in opinions], indent=2)}
        
        Debate Points:
        {json.dumps([r.model_dump() for r in rebuttals], indent=2)}
        
        Create a final synthesis that:
        1. Summarizes the core conflict.
        2. Lists areas of agreement.
        3. Lists areas of disagreement.
        4. Provides a final, balanced recommendation for the user.
        5. Extracts any cognitive biases the user should watch out for.
        """
        
        from pydantic import BaseModel
        class SynthesisResult(BaseModel):
            synthesis: DeliberationSynthesis
            biasWarnings: List[str]
            
        try:
            result = await self.behaviorist._generate_json(prompt, SynthesisResult)
            return result.synthesis, result.biasWarnings
        except Exception as e:
            print(f"Failed to generate real synthesis: {e}")
            # Fallback mock
            from models import DeliberationSynthesis
            return DeliberationSynthesis(
                summary="The council debated safety vs growth.",
                agreements=[], disagreements=[], finalRecommendation="Balance your approach.",
                confidenceScore=0.5, tradeOffs=[]
            ), ["Loss aversion"]
