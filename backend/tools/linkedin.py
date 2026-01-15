from pydantic import BaseModel, Field
from typing import Dict, Any
from backend.tools.registry import registry
import google.generativeai as genai
from backend.core.config import settings

# Configure GenAI
genai.configure(api_key=settings.GEMINI_API_KEY)
# Use 1.5-flash as gemini-pro (1.0) is deprecated/sunset
model = genai.GenerativeModel('gemini-1.5-flash')

class LinkedInDraftRequest(BaseModel):
    topic: str = Field(..., description="The main topic or subject of the post")
    key_points: str = Field(..., description="Bullet points or rough thoughts to include")
    tone: str = Field("Professional", description="Tone: Professional, Provocative, Personal, Visionary")
    audience: str = Field("Network", description="Target audience")

@registry.register(
    tool_id="linkedin_drafter",
    name="LinkedIn Drafter",
    description="Drafts viral, high-engagement LinkedIn posts based on raw thoughts.",
    input_model=LinkedInDraftRequest
)
async def draft_linkedin_post(params: Dict[str, Any]) -> Dict[str, str]:
    # Validate input (basic)
    req = LinkedInDraftRequest(**params)
    
    prompt = f"""
    You are an expert Ghostwriter for a C-Level Executive.
    Draft a LinkedIn post about: {req.topic}
    
    Key Points to include:
    {req.key_points}
    
    Tone: {req.tone}
    Audience: {req.audience}
    
    Rules:
    1. Use short paragraphs.
    2. Start with a "Hook" (first line).
    3. Include a call to action at the end.
    4. NO hashtags in the middle of text. 3-5 hashtags at the bottom.
    5. Language: Swedish (Professional but conversational).
    """
    
    response = await model.generate_content_async(prompt)
    return {"content": response.text}
