from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class Memory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    
    content: str
    embedding_id: Optional[str] = None # Link to ChromaDB UUID
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    importance: int = Field(default=1, description="1-5 rating of memory importance")
    policy: str = Field(default="auto", description="Retention policy: auto, explicit, strategic")
    
    user: Optional["User"] = Relationship(back_populates="memories")
