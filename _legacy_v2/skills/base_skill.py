"""
Lexi Skills Framework
=====================
Base classes and utilities for creating modular skills.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Optional, List, Dict
from enum import Enum
import asyncio


class SkillStatus(Enum):
    """Status of a skill execution."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class SkillContext:
    """Context passed to skill execution."""
    user_input: str
    session_id: str
    user_preferences: Dict[str, Any] = field(default_factory=dict)
    conversation_history: List[Dict[str, str]] = field(default_factory=list)
    
    # Callbacks for UI updates
    on_status: Optional[callable] = None
    on_progress: Optional[callable] = None
    on_output: Optional[callable] = None


@dataclass
class SkillResult:
    """Result returned from skill execution."""
    success: bool
    data: Optional[Any] = None
    message: str = ""
    file_path: Optional[str] = None
    error: Optional[str] = None


class BaseSkill(ABC):
    """
    Abstract base class for all Lexi skills.
    
    To create a new skill:
    1. Inherit from BaseSkill
    2. Set name, display_name, description, triggers
    3. Implement execute() method
    
    Example:
        class MySkill(BaseSkill):
            name = "my_skill"
            display_name = "My Skill"
            description = "Does something useful"
            triggers = ["do something", "run my skill"]
            
            async def execute(self, context: SkillContext) -> SkillResult:
                # Your implementation here
                return SkillResult(success=True, data="Done!")
    """
    
    # Required class attributes (override in subclass)
    name: str = ""
    display_name: str = ""
    description: str = ""
    triggers: List[str] = []
    
    # Optional settings
    requires_confirmation: bool = False
    max_execution_time: int = 300  # seconds
    
    def __init__(self):
        if not self.name:
            raise ValueError(f"Skill {self.__class__.__name__} must define 'name'")
    
    @abstractmethod
    async def execute(self, context: SkillContext) -> SkillResult:
        """
        Execute the skill with the given context.
        
        Args:
            context: SkillContext with user input and callbacks
            
        Returns:
            SkillResult with success status and data
        """
        pass
    
    async def validate(self, context: SkillContext) -> tuple[bool, str]:
        """
        Validate if the skill can be executed with the given context.
        Override to add custom validation.
        
        Returns:
            Tuple of (is_valid, error_message)
        """
        return True, ""
    
    def matches_trigger(self, text: str) -> bool:
        """Check if the input text matches any of the skill's triggers."""
        text_lower = text.lower()
        return any(trigger.lower() in text_lower for trigger in self.triggers)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert skill metadata to dictionary for LLM context."""
        return {
            "name": self.name,
            "display_name": self.display_name,
            "description": self.description,
            "triggers": self.triggers,
            "requires_confirmation": self.requires_confirmation
        }
    
    def __repr__(self):
        return f"<Skill:{self.name}>"
