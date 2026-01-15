"""
Lexi Skills Package
===================
Auto-discovers and loads all skills from this directory.
"""

import os
import importlib
import inspect
from pathlib import Path
from typing import Dict, List, Type

from .base_skill import BaseSkill, SkillContext, SkillResult, SkillStatus


class SkillLoader:
    """
    Automatically discovers and loads skills from the skills directory.
    """
    
    def __init__(self):
        self._skills: Dict[str, BaseSkill] = {}
        self._load_skills()
    
    def _load_skills(self):
        """Scan the skills directory and load all skill classes."""
        skills_dir = Path(__file__).parent
        
        for file in skills_dir.glob("*_skill.py"):
            module_name = file.stem
            try:
                module = importlib.import_module(f".{module_name}", package="skills")
                
                # Find all BaseSkill subclasses in the module
                for name, obj in inspect.getmembers(module, inspect.isclass):
                    if issubclass(obj, BaseSkill) and obj is not BaseSkill:
                        try:
                            skill_instance = obj()
                            self._skills[skill_instance.name] = skill_instance
                            print(f"[SKILLS] Loaded: {skill_instance.name}")
                        except Exception as e:
                            print(f"[SKILLS] Failed to instantiate {name}: {e}")
                            
            except Exception as e:
                print(f"[SKILLS] Failed to load module {module_name}: {e}")
    
    def get_skill(self, name: str) -> BaseSkill | None:
        """Get a skill by name."""
        return self._skills.get(name)
    
    def get_all_skills(self) -> List[BaseSkill]:
        """Get all loaded skills."""
        return list(self._skills.values())
    
    def find_matching_skill(self, text: str) -> BaseSkill | None:
        """Find a skill that matches the given input text."""
        for skill in self._skills.values():
            if skill.matches_trigger(text):
                return skill
        return None
    
    def get_skills_context(self) -> List[Dict]:
        """Get skill metadata for LLM context injection."""
        return [skill.to_dict() for skill in self._skills.values()]


# Global skill loader instance
_loader: SkillLoader | None = None


def get_skill_loader() -> SkillLoader:
    """Get or create the global skill loader."""
    global _loader
    if _loader is None:
        _loader = SkillLoader()
    return _loader


def reload_skills():
    """Reload all skills (useful during development)."""
    global _loader
    _loader = SkillLoader()
    return _loader


# Export public API
__all__ = [
    "BaseSkill",
    "SkillContext", 
    "SkillResult",
    "SkillStatus",
    "SkillLoader",
    "get_skill_loader",
    "reload_skills"
]
