from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from enum import Enum

class ProjectStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    DELETED = "deleted"

class ProjectBase(SQLModel):
    name: str = Field(index=True)
    key: str = Field(unique=True, index=True)  # LEXI-1, LEXI-2, etc.
    description: Optional[str] = None
    status: ProjectStatus = Field(default=ProjectStatus.ACTIVE)

class Project(ProjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    workspace_id: int = Field(default=1, foreign_key="user.id")  # Single-user: User = Workspace
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None
    
    # Relationships
    audit_logs: List["AuditLog"] = Relationship(back_populates="project")

class AuditAction(str, Enum):
    CREATE_PROJECT = "CREATE_PROJECT"
    UPDATE_PROJECT = "UPDATE_PROJECT"
    ARCHIVE_PROJECT = "ARCHIVE_PROJECT"
    DELETE_PROJECT = "DELETE_PROJECT"
    RESTORE_PROJECT = "RESTORE_PROJECT"

class AuditLogBase(SQLModel):
    action: AuditAction
    actor_id: int = Field(foreign_key="user.id")
    target_id: int = Field(foreign_key="project.id")
    extra_data: Optional[str] = None  # JSON string for extra context (renamed from 'metadata')

class AuditLog(AuditLogBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    project: Optional[Project] = Relationship(back_populates="audit_logs")

# --- Helper Functions ---

async def generate_project_key(session) -> str:
    """Generate deterministic project key: LEXI-1, LEXI-2, etc."""
    from sqlmodel import select, func
    
    result = await session.execute(select(func.count(Project.id)))
    count = result.scalar_one()
    return f"LEXI-{count + 1}"
