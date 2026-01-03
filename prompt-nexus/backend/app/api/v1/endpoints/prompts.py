from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.db.session import get_db
from app.db.models import Project, Prompt, PromptVersion
from app.schemas.prompt import PromptCreate, Prompt as PromptSchema, PromptWithVersions

router = APIRouter()

# --- Projects (Simplified for MVP) ---
@router.get("/projects", response_model=List[dict])
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project))
    projects = result.scalars().all()
    # Manual conversion for now to match schema or dict
    return [{"id": str(p.id), "name": p.name} for p in projects]

@router.post("/projects")
async def create_project(name: str, db: AsyncSession = Depends(get_db)):
    new_project = Project(name=name)
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return {"id": str(new_project.id), "name": new_project.name}

# --- Prompts ---
@router.get("/{project_id}/prompts", response_model=List[PromptSchema])
async def list_prompts(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Prompt).where(Prompt.project_id == project_id))
    return result.scalars().all()

@router.post("/{project_id}/prompts", response_model=PromptSchema)
async def create_prompt(project_id: str, prompt: PromptCreate, db: AsyncSession = Depends(get_db)):
    db_prompt = Prompt(
        title=prompt.title,
        description=prompt.description,
        project_id=project_id 
    )
    db.add(db_prompt)
    await db.commit()
    await db.refresh(db_prompt)
    return db_prompt

@router.get("/detail/{prompt_id}", response_model=PromptWithVersions)
async def get_prompt_detail(prompt_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Prompt).where(Prompt.id == prompt_id))
    prompt = result.scalars().first()
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    # Fetch versions
    v_result = await db.execute(select(PromptVersion).where(PromptVersion.prompt_id == prompt_id).order_by(PromptVersion.version_number.desc()))
    versions = v_result.scalars().all()
    
    prompt.versions = versions
    return prompt
