import os
import json
from typing import Dict, Any, TypeVar, Type
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

T = TypeVar('T', bound=BaseModel)

class BaseAgent:
    def __init__(self, agent_id: str, name: str, role_description: str):
        self.agent_id = agent_id
        self.name = name
        self.role_description = role_description
        
        # Initialize Groq client
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print(f"Warning: GROQ_API_KEY not found. Using mock mode for {self.name}.")
            self.client = None
        else:
            self.client = Groq(api_key=api_key)
            
        self.model = "llama-3.3-70b-versatile" # Latest stable Groq model (Llama 3.3)

    async def _generate_json(self, prompt: str, schema_class: Type[T]) -> T:
        """Helper to generate structured JSON using Groq"""
        if not self.client:
            raise ValueError("Groq client not initialized (missing API key)")
            
        schema = schema_class.model_json_schema()
        
        system_prompt = f"""You are {self.name}. {self.role_description}
        
You must respond with ONLY a valid JSON object that exactly matches the following JSON schema.
Do not include markdown blocks (```json) or any other text before or after the JSON.

SCHEMA:
{json.dumps(schema, indent=2)}
"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3, # Low temperature for consistency
                response_format={"type": "json_object"}
            )
            
            result_str = response.choices[0].message.content
            # The model is instructed to return JSON, parse it and validate against Pydantic
            data = json.loads(result_str)
            return schema_class(**data)
            
        except Exception as e:
            print(f"Error generating JSON for {self.agent_id}: {str(e)}")
            raise e

    async def analyze_decision(self, context: Dict[str, Any]) -> Any:
        raise NotImplementedError
        
    async def generate_rebuttal(self, context: Dict[str, Any], other_opinions: list) -> Any:
        raise NotImplementedError
