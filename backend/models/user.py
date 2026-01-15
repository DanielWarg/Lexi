from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class UserBase(SQLModel):
    name: str = Field(index=True)
    role: str = "Executive"
    leadership_style: Optional[str] = "Collaborative"
    communication_style: Optional[str] = "Direct"
    values: Optional[str] = None
    
    face_encoding: Optional[str] = Field(default=None, description="Native Auth Token / ID")
    system_prompt_override: Optional[str] = None
    bio: Optional[str] = Field(default=None, description="User biography/context")
    is_onboarded: bool = Field(default=False)
    
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    memories: List["Memory"] = Relationship(back_populates="user")
