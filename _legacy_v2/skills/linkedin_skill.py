"""
Lexi LinkedIn Skill
===================
Creates professional LinkedIn posts.
"""

from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict
from skills.base_skill import BaseSkill, SkillContext, SkillResult


class LinkedInSkill(BaseSkill):
    """
    Skill for creating LinkedIn posts.
    
    Features:
    - Professional tone
    - Swedish language
    - Hook + content + CTA structure
    - Hashtag suggestions
    - Remembers user's writing style
    """
    
    name = "linkedin"
    display_name = "LinkedIn-assistent"
    description = "Skapar professionella LinkedIn-inlägg på svenska"
    triggers = [
        "skriv linkedin",
        "linkedin inlägg",
        "linkedin post",
        "skapa linkedin",
        "write linkedin",
        "skriv ett inlägg"
    ]
    
    requires_confirmation = False
    
    def __init__(self):
        super().__init__()
        self.output_dir = Path.home() / "Documents" / "Lexi" / "LinkedIn"
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    async def execute(self, context: SkillContext) -> SkillResult:
        """Generate a LinkedIn post."""
        try:
            if context.on_status:
                context.on_status("Analyserar ämne...")
            
            # Extract topic from input
            topic = self._extract_topic(context.user_input)
            
            # Get user preferences for tone
            tone = context.user_preferences.get("linkedin_tone", "professionell")
            
            if context.on_progress:
                context.on_progress(30, "Skriver inlägg...")
            
            # Generate post content
            # In production, this would use LLM with user's style preferences
            post_content = self._generate_post(topic, tone, context)
            
            if context.on_progress:
                context.on_progress(70, "Genererar hashtags...")
            
            # Add hashtags
            hashtags = self._generate_hashtags(topic)
            full_post = f"{post_content}\n\n{hashtags}"
            
            # Save to file
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            safe_topic = "".join(c for c in topic if c.isalnum() or c in " -_")[:20]
            filename = f"LinkedIn_{safe_topic}_{timestamp}.txt"
            filepath = self.output_dir / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(full_post)
            
            if context.on_status:
                context.on_status("Inlägg skapat!")
            
            if context.on_progress:
                context.on_progress(100, "Klart!")
            
            # Also return the content for immediate use
            if context.on_output:
                context.on_output(full_post)
            
            return SkillResult(
                success=True,
                data={
                    "topic": topic,
                    "post": full_post,
                    "hashtags": hashtags,
                    "character_count": len(full_post)
                },
                file_path=str(filepath),
                message=f"LinkedIn-inlägg skapat ({len(full_post)} tecken)"
            )
            
        except Exception as e:
            return SkillResult(
                success=False,
                error=f"LinkedIn-fel: {str(e)}"
            )
    
    def _extract_topic(self, text: str) -> str:
        """Extract the post topic from user input."""
        triggers = ["skriv linkedin", "linkedin inlägg", "linkedin om", "inlägg om"]
        result = text.lower()
        for trigger in triggers:
            result = result.replace(trigger, "")
        return result.strip() or "professionell utveckling"
    
    def _generate_post(self, topic: str, tone: str, context: SkillContext) -> str:
        """
        Generate LinkedIn post content.
        In production, this would use LLM with user's historical writing style.
        """
        # Template structure: Hook → Story/Value → CTA
        post = f"""🎯 {topic.title()}

Jag har funderat mycket på detta ämne senaste tiden.

Det som slog mig är att vi ofta underskattar vikten av:

• Att vara konsekvent i vårt arbete
• Att lyssna mer än vi pratar
• Att fira små framgångar

Vad är dina tankar om {topic}?

Dela gärna i kommentarerna! 👇"""
        
        return post
    
    def _generate_hashtags(self, topic: str) -> str:
        """Generate relevant hashtags."""
        # Base hashtags
        hashtags = ["#LinkedIn", "#Karriär", "#Utveckling"]
        
        # Topic-specific
        topic_lower = topic.lower()
        if "ledar" in topic_lower:
            hashtags.extend(["#Ledarskap", "#Management"])
        elif "tech" in topic_lower or "ai" in topic_lower:
            hashtags.extend(["#Tech", "#AI", "#Innovation"])
        elif "försälj" in topic_lower:
            hashtags.extend(["#Försäljning", "#Sales"])
        else:
            hashtags.extend(["#Inspiration", "#Tips"])
        
        return " ".join(hashtags[:5])
