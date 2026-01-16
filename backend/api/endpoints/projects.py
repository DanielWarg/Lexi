from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from pydantic import BaseModel

from backend.core.database import get_session
from backend.models.project import Project, ProjectStatus, AuditLog, AuditAction, generate_project_key

router = APIRouter()

# --- Request/Response Schemas ---

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    archived: Optional[bool] = None

# --- Endpoints ---

@router.get("/", response_model=List[Project])
async def list_projects(
    status: Optional[ProjectStatus] = Query(default=ProjectStatus.ACTIVE),
    session: AsyncSession = Depends(get_session)
):
    """List projects, filtered by status. Excludes soft-deleted by default."""
    query = select(Project).where(Project.deleted_at == None)
    
    if status:
        query = query.where(Project.status == status)
    
    result = await session.execute(query)
    return result.scalars().all()

@router.post("/", response_model=Project, status_code=201)
async def create_project(
    project_data: ProjectCreate,
    session: AsyncSession = Depends(get_session)
):
    """Create a new project with deterministic key."""
    key = await generate_project_key(session)
    
    project = Project(
        name=project_data.name,
        description=project_data.description,
        key=key,
        workspace_id=1  # Single-user assumption
    )
    
    session.add(project)
    await session.commit()
    await session.refresh(project)
    
    # Log creation
    audit = AuditLog(
        action=AuditAction.CREATE_PROJECT,
        actor_id=1,  # Single-user
        target_id=project.id,
        extra_data=f'{{"name": "{project.name}"}}'
    )
    session.add(audit)
    await session.commit()
    
    return project

@router.get("/{project_id}", response_model=Project)
async def get_project(
    project_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Get a single project by ID."""
    result = await session.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project

@router.patch("/{project_id}", response_model=Project)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    session: AsyncSession = Depends(get_session)
):
    """Update project fields or archive it."""
    result = await session.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project_update.name is not None:
        project.name = project_update.name
    if project_update.description is not None:
        project.description = project_update.description
    if project_update.archived is not None:
        project.status = ProjectStatus.ARCHIVED if project_update.archived else ProjectStatus.ACTIVE
        
        # Log archive/unarchive
        audit = AuditLog(
            action=AuditAction.ARCHIVE_PROJECT if project_update.archived else AuditAction.UPDATE_PROJECT,
            actor_id=1,
            target_id=project.id
        )
        session.add(audit)
    
    project.updated_at = datetime.utcnow()
    session.add(project)
    await session.commit()
    await session.refresh(project)
    
    return project

@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Soft delete a project."""
    result = await session.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.status = ProjectStatus.DELETED
    project.deleted_at = datetime.utcnow()
    
    # Log deletion
    audit = AuditLog(
        action=AuditAction.DELETE_PROJECT,
        actor_id=1,
        target_id=project.id
    )
    session.add(audit)
    session.add(project)
    await session.commit()

@router.post("/{project_id}/restore", response_model=Project)
async def restore_project(
    project_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Restore a soft-deleted project."""
    result = await session.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.status != ProjectStatus.DELETED:
        raise HTTPException(status_code=400, detail="Project is not deleted")
    
    project.status = ProjectStatus.ACTIVE
    project.deleted_at = None
    project.updated_at = datetime.utcnow()
    
    # Log restoration
    audit = AuditLog(
        action=AuditAction.RESTORE_PROJECT,
        actor_id=1,
        target_id=project.id
    )
    session.add(audit)
    session.add(project)
    await session.commit()
    await session.refresh(project)
    
    return project
