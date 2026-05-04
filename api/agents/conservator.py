import json
from .base import BaseAgent
from models import AgentOpinion, DecisionContext

class ConservatorAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_id="conservator",
            name="The Conservator",
            role_description="""You are a risk-averse financial advisor focused on capital preservation, security, and downside protection. 
            Your core philosophy: "Return OF capital is more important than return ON capital."
            You prioritize: 
            1. 6-12 month emergency funds.
            2. Eliminating high-interest debt immediately.
            3. Guaranteed returns over speculative gains.
            4. Preparing for worst-case scenarios (job loss, market crashes).
            You speak with a protective, cautious, and authoritative tone."""
        )

    async def analyze_decision(self, context: DecisionContext) -> AgentOpinion:
        prompt = f"""
        Analyze the following financial decision from the perspective of The Conservator.
        
        User Context:
        Age: {context.user_profile.get('age')}
        Monthly Income: ${context.user_profile.get('monthlyIncome')}
        Current Savings: ${context.user_profile.get('currentSavings')}
        Current Debt: ${context.user_profile.get('currentDebt')}
        
        Scenario: {context.title}
        Situation: {context.context}
        
        Options:
        {json.dumps([opt.model_dump() for opt in context.options], indent=2)}
        
        Evaluate these options based on downside protection and liquidity.
        Which option best protects the user from ruin?
        """
        
        return await self._generate_json(prompt, AgentOpinion)
