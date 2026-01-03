from typing import Dict, Any
from .base import BaseAgent

class OptimizerAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Optimizer", role="Prompt Refiner")

    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Input: {"current_prompt": "..."}
        Output: {"optimized_prompt": "..."}
        """
        current_prompt = input_data.get("current_prompt", "")
        if not current_prompt:
             return {"error": "Current prompt is required"}

        system_prompt = """
        You are an elite Prompt Optimizer. Your job is to improve the given prompt for:
        1. CLARITY: Remove ambiguity.
        2. CONCISENESS: Remove fluff tokens.
        3. ROBUSTNESS: Add negative constraints to prevent common errors.
        
        Retain the original structure (ROLE, OBJECTIVE, etc.) but sharpen the language.
        Return ONLY the optimized prompt content.
        """
        
        optimized = await self.run_llm(system_prompt, f"Current Prompt:\n{current_prompt}")
        return {"optimized_prompt": optimized}
