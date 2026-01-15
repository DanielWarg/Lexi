"""
Lexi Report Skill
=================
Compiles reports from documents and notes.
"""

import os
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict
from skills.base_skill import BaseSkill, SkillContext, SkillResult


class ReportSkill(BaseSkill):
    """
    Skill for creating reports from multiple sources.
    
    Supports:
    - Text documents
    - Notes
    - URLs
    - Voice transcriptions
    """
    
    name = "report"
    display_name = "Rapport-sammanställare"
    description = "Sammanställer rapporter från dokument, anteckningar och länkar"
    triggers = [
        "skriv rapport",
        "sammanställ rapport",
        "skapa rapport",
        "gör en rapport",
        "write report",
        "compile report",
        "sammanfatta"
    ]
    
    requires_confirmation = False
    
    def __init__(self):
        super().__init__()
        self.output_dir = Path.home() / "Documents" / "Lexi" / "Reports"
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    async def execute(self, context: SkillContext) -> SkillResult:
        """Generate a report from provided content."""
        try:
            if context.on_status:
                context.on_status("Analyserar innehåll...")
            
            # Extract topic and content from input
            topic = self._extract_topic(context.user_input)
            
            if context.on_progress:
                context.on_progress(20, "Strukturerar rapport...")
            
            # Generate report content
            # In production, this would use LLM for intelligent summarization
            report_content = self._generate_report(topic, context)
            
            if context.on_progress:
                context.on_progress(60, "Skriver rapport...")
            
            # Save as Markdown (readable and convertible)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            safe_topic = "".join(c for c in topic if c.isalnum() or c in " -_")[:30]
            filename = f"Rapport_{safe_topic}_{timestamp}.md"
            filepath = self.output_dir / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(report_content)
            
            if context.on_status:
                context.on_status("Rapport sparad!")
            
            if context.on_progress:
                context.on_progress(100, "Klart!")
            
            return SkillResult(
                success=True,
                data={
                    "topic": topic,
                    "format": "markdown",
                    "words": len(report_content.split())
                },
                file_path=str(filepath),
                message=f"Rapport skapad: {filename}"
            )
            
        except Exception as e:
            return SkillResult(
                success=False,
                error=f"Rapport-fel: {str(e)}"
            )
    
    def _extract_topic(self, text: str) -> str:
        """Extract the report topic from user input."""
        triggers = ["skriv rapport", "sammanställ rapport", "rapport om", "rapport över"]
        result = text.lower()
        for trigger in triggers:
            result = result.replace(trigger, "")
        return result.strip() or "Rapport"
    
    def _generate_report(self, topic: str, context: SkillContext) -> str:
        """
        Generate report content.
        In production, this would use LLM for intelligent synthesis.
        """
        date = datetime.now().strftime("%Y-%m-%d")
        
        report = f"""# {topic.title()}

**Datum:** {date}  
**Skapad av:** Lexi AI-assistent

---

## Sammanfattning

Detta är en automatiskt genererad rapport om {topic}. I en fullständig implementation 
skulle Lexi analysera tillhandahållna dokument, anteckningar och källor för att 
skapa en omfattande sammanställning.

## Bakgrund

Rapporten behandlar ämnet {topic} och dess relevans för användaren.

## Huvudpunkter

1. **Punkt 1**: Beskrivning av första huvudpunkten
2. **Punkt 2**: Beskrivning av andra huvudpunkten
3. **Punkt 3**: Beskrivning av tredje huvudpunkten

## Analys

Baserat på tillgänglig information kan följande slutsatser dras:

- Slutsats A
- Slutsats B
- Slutsats C

## Rekommendationer

1. Rekommendation 1
2. Rekommendation 2
3. Rekommendation 3

## Referenser

*Inga externa källor tillhandahållna.*

---

*Denna rapport genererades automatiskt av Lexi.*
"""
        return report
