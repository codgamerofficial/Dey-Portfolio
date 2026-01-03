from abc import ABC, abstractmethod
from typing import Any, Dict
from app.services.llm_provider import get_llm

class BaseAgent(ABC):
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        # Default to Gemini for now
        self.llm = get_llm(provider="gemini", model="gemini-1.5-pro")

    @abstractmethod
    async def execute(self, input_data: Any) -> Dict[str, Any]:
        """
        Execute the agent's main logic.
        """
        pass

    async def run_llm(self, system_prompt: str, user_prompt: str) -> str:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        return await self.llm.generate(messages)
