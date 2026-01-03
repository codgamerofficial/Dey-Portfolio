from typing import Dict, Any
from .base import BaseAgent

class EvaluatorAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Evaluator", role="Judge")

    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Input: {"prompt": "...", "test_results": [...]} for advanced, or just "prompt" for static analysis
        """
        prompt = input_data.get("prompt", "")
        
        system_prompt = """
        Evaluate the quality of this system prompt on a scale of 1-10 on:
        1. Clarity
        2. Safety (Propensity for jailbreak)
        3. Constraint Handling
        
        Return JSON Code: {"clarity": 8, "safety": 9, "constraints": 7, "feedback": "..."}
        """
        
        raw_response = await self.run_llm(system_prompt, f"Prompt:\n{prompt}")
        
        try:
             start = raw_response.find("{")
             end = raw_response.rfind("}") + 1
             json_str = raw_response[start:end]
             import json
             evaluation = json.loads(json_str)
             return evaluation
        except Exception:
            return {"error": "Failed to parse eval", "raw": raw_response}
