"""
Lexi Skill Dispatcher
=====================
Routes user intents to the appropriate skill.
"""

from typing import Optional, Dict, Any, Callable
from skills import get_skill_loader, SkillContext, SkillResult, BaseSkill


class SkillDispatcher:
    """
    Dispatches user requests to the appropriate skill.
    
    The dispatcher:
    1. Receives user input
    2. Matches it to a skill (by triggers or LLM classification)
    3. Executes the skill
    4. Returns the result
    """
    
    def __init__(
        self,
        on_status: Callable[[str], None] = None,
        on_progress: Callable[[int, str], None] = None,
        on_output: Callable[[Any], None] = None
    ):
        self.loader = get_skill_loader()
        self.on_status = on_status
        self.on_progress = on_progress
        self.on_output = on_output
        
        self._active_skill: Optional[BaseSkill] = None
        self._cancelled = False
    
    async def dispatch(
        self,
        user_input: str,
        session_id: str = "default",
        user_preferences: Dict[str, Any] = None,
        conversation_history: list = None,
        skill_name: str = None
    ) -> SkillResult:
        """
        Dispatch a request to the appropriate skill.
        
        Args:
            user_input: The user's text input
            session_id: Current session identifier
            user_preferences: User's saved preferences
            conversation_history: Recent conversation for context
            skill_name: Optional explicit skill name to use
            
        Returns:
            SkillResult from the executed skill
        """
        self._cancelled = False
        
        # Find the skill to use
        if skill_name:
            skill = self.loader.get_skill(skill_name)
            if not skill:
                return SkillResult(
                    success=False,
                    error=f"Skill '{skill_name}' not found"
                )
        else:
            skill = self.loader.find_matching_skill(user_input)
            if not skill:
                return SkillResult(
                    success=False,
                    error="No matching skill found for this request"
                )
        
        # Create context
        context = SkillContext(
            user_input=user_input,
            session_id=session_id,
            user_preferences=user_preferences or {},
            conversation_history=conversation_history or [],
            on_status=self.on_status,
            on_progress=self.on_progress,
            on_output=self.on_output
        )
        
        # Validate
        is_valid, error_msg = await skill.validate(context)
        if not is_valid:
            return SkillResult(success=False, error=error_msg)
        
        # Execute
        self._active_skill = skill
        
        if self.on_status:
            self.on_status(f"Running {skill.display_name}...")
        
        try:
            result = await skill.execute(context)
            
            if self._cancelled:
                return SkillResult(
                    success=False,
                    error="Skill execution was cancelled"
                )
            
            return result
            
        except Exception as e:
            return SkillResult(
                success=False,
                error=f"Skill execution failed: {str(e)}"
            )
        finally:
            self._active_skill = None
    
    def cancel(self):
        """Cancel the currently running skill."""
        self._cancelled = True
    
    def get_available_skills(self) -> list[Dict]:
        """Get metadata for all available skills."""
        return self.loader.get_skills_context()
    
    def get_skills_prompt(self) -> str:
        """Generate a prompt describing available skills for the LLM."""
        skills = self.loader.get_all_skills()
        
        if not skills:
            return "No skills are currently available."
        
        lines = ["Available skills:"]
        for skill in skills:
            triggers = ", ".join(f'"{t}"' for t in skill.triggers[:3])
            lines.append(f"- {skill.display_name}: {skill.description}")
            lines.append(f"  Triggers: {triggers}")
        
        return "\n".join(lines)
