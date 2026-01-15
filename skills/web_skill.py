"""
Lexi Web Agent Skill
====================
Browser automation using Playwright.
"""

import asyncio
from typing import Optional
from skills.base_skill import BaseSkill, SkillContext, SkillResult


class WebAgentSkill(BaseSkill):
    """
    Skill for web browsing and automation.
    Uses Playwright to control a browser.
    """
    
    name = "web_agent"
    display_name = "Webbagent"
    description = "Söker på webben och automatiserar webbläsaruppgifter"
    triggers = [
        "sök på webben",
        "öppna webbläsaren", 
        "gå till",
        "search the web",
        "browse to",
        "google",
        "hitta information om"
    ]
    
    requires_confirmation = True
    
    def __init__(self):
        super().__init__()
        self._browser = None
        self._page = None
    
    async def execute(self, context: SkillContext) -> SkillResult:
        """Execute web browsing task."""
        try:
            from playwright.async_api import async_playwright
            
            if context.on_status:
                context.on_status("Startar webbläsare...")
            
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=False)
                page = await browser.new_page()
                
                # Extract URL or search query from input
                user_input = context.user_input.lower()
                
                if "google" in user_input or "sök" in user_input:
                    # Search query
                    query = self._extract_search_query(context.user_input)
                    url = f"https://www.google.com/search?q={query}"
                elif user_input.startswith("http"):
                    url = context.user_input
                else:
                    # Default to Google search
                    url = f"https://www.google.com/search?q={context.user_input}"
                
                if context.on_status:
                    context.on_status(f"Navigerar till {url[:50]}...")
                
                await page.goto(url)
                await asyncio.sleep(2)
                
                # Take screenshot
                screenshot = await page.screenshot()
                
                # Get page title and content summary
                title = await page.title()
                
                await browser.close()
                
                return SkillResult(
                    success=True,
                    data={
                        "title": title,
                        "url": url,
                        "screenshot": screenshot
                    },
                    message=f"Öppnade: {title}"
                )
                
        except Exception as e:
            return SkillResult(
                success=False,
                error=f"Webbagent-fel: {str(e)}"
            )
    
    def _extract_search_query(self, text: str) -> str:
        """Extract search query from user input."""
        # Remove common trigger words
        remove_words = ["sök", "efter", "på", "webben", "google", "hitta"]
        words = text.split()
        filtered = [w for w in words if w.lower() not in remove_words]
        return " ".join(filtered)
