from typing import Dict, Any, List
from .base import BaseAgent

class TesterAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Tester", role="Adversarial Tester")

    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Input: {"prompt": "..."}
        Output: {"test_cases": ["input1", "input2"]}
        """
        prompt = input_data.get("prompt", "")
        
        system_prompt = """
        You are a Red Team Expert. Your goal is to break the given system prompt.
        Generate 3 challenging test cases (user inputs) that might cause the prompt to fail, hallucinate, or ignore constraints.
        
        Output format: JSON Dictionary {"cases": [{"input": "...", "reason": "..."}]}
        RETURN ONLY JSON.
        """
        
        raw_response = await self.run_llm(system_prompt, f"Target Prompt:\n{prompt}")
        
        # Simple cleanup if the model chats
        try:
             # Find first { and last }
             start = raw_response.find("{")
             end = raw_response.rfind("}") + 1
             json_str = raw_response[start:end]
             import json
             cases = json.loads(json_str)
             return cases
        except Exception as e:
            return {"cases": [], "error": f"Failed to parse test cases: {str(e)}", "raw": raw_response}
