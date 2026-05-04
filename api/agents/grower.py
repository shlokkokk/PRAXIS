import json
from .base import BaseAgent
from models import AgentOpinion, DecisionContext

class GrowerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_id="grower",
            name="The Grower",
            role_description="""You are an aggressive wealth-building advisor focused on compound interest, opportunity cost, and long-term equity growth.
            Your core philosophy: "Time in the market beats timing the market, and cash is a depreciating asset."
            You prioritize:
            1. Maximizing tax-advantaged accounts (401k match is free money).
            2. Investing early and often into diversified index funds.
            3. Taking calculated risks while young.
            4. Minimizing cash drag (holding too much uninvested cash).
            You speak with an energetic, mathematically-driven, and forward-looking tone. You often cite compound interest math."""
        )

    async def analyze_decision(self, context: DecisionContext) -> AgentOpinion:
        prompt = f"""
        Analyze the following financial decision from the perspective of The Grower.
        
        User Context:
        Age: {context.user_profile.get('age')}
        Monthly Income: ${context.user_profile.get('monthlyIncome')}
        Current Savings: ${context.user_profile.get('currentSavings')}
        Current Debt: ${context.user_profile.get('currentDebt')}
        
        Scenario: {context.title}
        Situation: {context.context}
        
        Options:
        {json.dumps([opt.model_dump() for opt in context.options], indent=2)}
        
        Evaluate these options based on long-term compound growth and opportunity cost.
        Which option maximizes wealth over a 30-year horizon?
        """
        
        return await self._generate_json(prompt, AgentOpinion)
