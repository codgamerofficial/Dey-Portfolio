from typing import Dict, Any
import json
from .base import BaseAgent

class ArchitectAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Architect", role="Prompt Structural Designer")

    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Input: {"intent": "I want a prompt for a fitness coach bot"}
        Output: {"draft_prompt": "..."}
        """
        user_intent = input_data.get("intent", "")
        if not user_intent:
            return {"error": "User intent is required"}

        system_prompt = """
        You are an expert Prompt Engineer. Your goal is to convert a user's vague intent into a STRUCTURED SYSTEM PROMPT.
        
        Follow this standard structure:
        # ROLE
        [Role Name and Description]
        
        # OBJECTIVE
        [Clear goal]
        
        # CONTEXT
        [Necessary background info]
        
        # INSTRUCTIONS
        [Step-by-step rules]
        
        # CONSTRAINTS
        [What NOT to do]
        
        # OUTPUT FORMAT
        [JSON/Markdown/Text]
        
        Return ONLY the raw prompt content. Do not include markdown code block ticks around it.
        """
        
        draft = await self.run_llm(system_prompt, f"User Intent: {user_intent}")
        return {"draft_prompt": draft}
