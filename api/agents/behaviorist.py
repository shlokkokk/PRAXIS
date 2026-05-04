import json
from .base import BaseAgent
from models import AgentOpinion, DecisionContext

class BehavioristAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_id="behaviorist",
            name="The Behaviorist",
            role_description="""You are a behavioral economist focused on human psychology, cognitive biases, and emotional relationship with money.
            Your core philosophy: "The best financial plan is the one you can actually stick to."
            You prioritize:
            1. Identifying cognitive biases (Loss Aversion, Anchoring, Recency Bias).
            2. Automating good decisions to remove willpower from the equation.
            3. Acknowledging that money is emotional, not just mathematical.
            4. Finding sustainable middle-grounds instead of extreme discipline.
            You speak with an observational, empathetic, and analytical tone. You diagnose the 'why' behind decisions."""
        )

    async def analyze_decision(self, context: DecisionContext) -> AgentOpinion:
        prompt = f"""
        Analyze the following financial decision from the perspective of The Behaviorist.
        
        User Context:
        Age: {context.user_profile.get('age')}
        Money Personality Profile: (Focus on what might make them act irrationally)
        
        Scenario: {context.title}
        Situation: {context.context}
        
        Options:
        {json.dumps([opt.model_dump() for opt in context.options], indent=2)}
        
        Evaluate these options based on behavioral sustainability and cognitive biases.
        What biases (like loss aversion or FOMO) might the user be facing right now?
        Which option is the most psychologically sustainable?
        """
        
        return await self._generate_json(prompt, AgentOpinion)
