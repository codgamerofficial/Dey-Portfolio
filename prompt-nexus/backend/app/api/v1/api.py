from fastapi import APIRouter

api_router = APIRouter()

from app.api.v1.endpoints import agents, prompts
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(prompts.router, prefix="/prompts", tags=["prompts"])
