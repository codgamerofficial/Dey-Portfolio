from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from app.agents.architect import ArchitectAgent
from app.agents.optimizer import OptimizerAgent
from app.agents.tester import TesterAgent
from app.agents.evaluator import EvaluatorAgent

router = APIRouter()

# Instantiate agents (Singleton pattern via module scope for now)
architect = ArchitectAgent()
optimizer = OptimizerAgent()
tester = TesterAgent()
evaluator = EvaluatorAgent()

# Request Models
class ArchitectRequest(BaseModel):
    intent: str

class OptimizerRequest(BaseModel):
    current_prompt: str

class TesterRequest(BaseModel):
    prompt: str

class EvaluatorRequest(BaseModel):
    prompt: str

@router.post("/architect")
async def run_architect(request: ArchitectRequest):
    result = await architect.execute(request.dict())
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@router.post("/optimize")
async def run_optimizer(request: OptimizerRequest):
    result = await optimizer.execute(request.dict())
    return result

@router.post("/test")
async def run_tester(request: TesterRequest):
    result = await tester.execute(request.dict())
    return result

@router.post("/evaluate")
async def run_evaluator(request: EvaluatorRequest):
    result = await evaluator.execute(request.dict())
    return result
