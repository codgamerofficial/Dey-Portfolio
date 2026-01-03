from typing import List, Optional, Any, Dict
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

# Shared properties
class PromptBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class PromptCreate(PromptBase):
    title: str
    project_id: UUID

class PromptUpdate(PromptBase):
    pass

class PromptInDBBase(PromptBase):
    id: UUID
    project_id: UUID
    created_at: datetime

    class Config:
        orm_mode = True

class Prompt(PromptInDBBase):
    pass

# Version Schemas
class PromptVersionBase(BaseModel):
    content: str
    variables: Dict[str, Any] = {}
    model_config: Dict[str, Any] = {}
    blueprint_used: Optional[str] = None
    commit_message: Optional[str] = None

class PromptVersionCreate(PromptVersionBase):
    prompt_id: UUID
    version_number: int

class PromptVersion(PromptVersionBase):
    id: UUID
    prompt_id: UUID
    version_number: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Full Response with versions
class PromptWithVersions(Prompt):
    versions: List[PromptVersion] = []
