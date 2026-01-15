from fastapi import APIRouter, Depends
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.database import get_session
from backend.models.user import User

router = APIRouter()

@router.get("/me", response_model=User)
async def get_current_user(session: AsyncSession = Depends(get_session)):
    # For A0, we assume single user (ID=1) or get first
    result = await session.execute(select(User))
    user = result.scalars().first()
    
    if not user:
        # Create default user if none exists
        user = User(name="Executive", role="Executive")
        session.add(user)
        await session.commit()
        await session.refresh(user)
        
    return user

from pydantic import BaseModel

class UserSettingsUpdate(BaseModel):
    system_prompt: Optional[str] = None
    bio: Optional[str] = None
    name: Optional[str] = None

@router.put("/me/settings", response_model=User)
async def update_user_settings(settings_update: UserSettingsUpdate, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User))
    user = result.scalars().first()
    
    if not user:
        # Should create if not exists, but for settings update we expect user to be there via /me call first
        user = User(name="Executive")
        session.add(user)

    if settings_update.system_prompt is not None:
        user.system_prompt_override = settings_update.system_prompt
    if settings_update.bio is not None:
        user.bio = settings_update.bio
    if settings_update.name is not None:
        user.name = settings_update.name
        
    user.is_onboarded = True # Saving settings counts as onboarding
    
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
