import datetime
import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Float, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class User(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    tier = Column(String, default="free")
    
    projects = relationship("Project", back_populates="owner")

class Project(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    name = Column(String, nullable=False)
    config = Column(JSON, default={})
    
    owner = relationship("User", back_populates="projects")
    prompts = relationship("Prompt", back_populates="project")

class Prompt(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("project.id"))
    title = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    project = relationship("Project", back_populates="prompts")
    versions = relationship("PromptVersion", back_populates="prompt")
    test_cases = relationship("TestCase", back_populates="prompt")

class PromptVersion(Base):
    __tablename__ = "prompt_version"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prompt_id = Column(UUID(as_uuid=True), ForeignKey("prompt.id"))
    version_number = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    variables = Column(JSON, default={})
    model_config = Column(JSON, default={})
    blueprint_used = Column(String)
    commit_message = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    prompt = relationship("Prompt", back_populates="versions")
    evaluations = relationship("Evaluation", back_populates="version")

class TestCase(Base):
    __tablename__ = "test_case"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prompt_id = Column(UUID(as_uuid=True), ForeignKey("prompt.id"))
    input_data = Column(Text)
    expected_output = Column(Text)
    assertion_rules = Column(JSON)
    
    prompt = relationship("Prompt", back_populates="test_cases")

class Evaluation(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    version_id = Column(UUID(as_uuid=True), ForeignKey("prompt_version.id"))
    score_accuracy = Column(Float)
    score_safety = Column(Float)
    raw_results = Column(JSON)
    executed_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    version = relationship("PromptVersion", back_populates="evaluations")
