from typing import List, Dict, Any, Optional
import os
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, BaseMessage
from app.core.config import settings

class LLMProvider:
    def __init__(self, provider: str = "gemini", model: str = "gemini-1.5-pro"):
        self.provider = provider
        self.model_name = model
        self.client = self._get_client()

    def _get_client(self):
        if self.provider == "openai":
            if not settings.OPENAI_API_KEY:
                # Fallback or error handling
                print("Warning: OPENAI_API_KEY not set")
            return ChatOpenAI(
                model=self.model_name,
                api_key=settings.OPENAI_API_KEY,
                temperature=0.7
            )
        elif self.provider == "gemini":
            if not settings.GEMINI_API_KEY:
                 print("Warning: GEMINI_API_KEY not set")
            return ChatGoogleGenerativeAI(
                model=self.model_name,
                google_api_key=settings.GEMINI_API_KEY,
                temperature=0.7,
                convert_system_message_to_human=True # Langchain-google-genai quirk fix
            )
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

    async def generate(self, messages: List[Dict[str, str]]) -> str:
        """
        Generic generation method.
        messages = [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}]
        """
        formatted_messages = []
        for msg in messages:
            if msg["role"] == "system":
                formatted_messages.append(SystemMessage(content=msg["content"]))
            elif msg["role"] == "user":
                formatted_messages.append(HumanMessage(content=msg["content"]))
            # Add assistant handling if needed

        try:
            response = await self.client.ainvoke(formatted_messages)
            return response.content
        except Exception as e:
            # Simple error handling for now
            return f"Error generating response: {str(e)}"

# Singleton or Factory could be used, for now simple instantiation
def get_llm(provider="gemini", model="gemini-1.5-pro"):
    return LLMProvider(provider, model)
