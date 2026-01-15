from typing import List, Dict
from backend.models.user import User

class OnboardingService:
    """
    Manages "The Interview" - the first-run experience to establish the Executive Persona.
    """
    
    INTERVIEW_QUESTIONS = [
        "Välkommen. Jag är Lexi. För att jag ska kunna vara din strategiska partner behöver jag förstå dig. Vad är din nuvarande roll och vad är din största utmaning just nu?",
        "Hur skulle du beskriva din ledarskapsstil? Är du mer visionär eller operativ?",
        "Hur föredrar du att ta emot information? Korta sammanfattningar eller djupgående analyser?",
        "Vilka är dina viktigaste värderingar i arbetet? (t.ex. transparens, effektivitet, innovation)"
    ]

    async def get_next_question(self, user: User, current_step: int) -> str:
        if current_step < len(self.INTERVIEW_QUESTIONS):
            return self.INTERVIEW_QUESTIONS[current_step]
        return "Tack. Jag har nu en bild av vem du är och hur vi ska arbeta. Låt oss börja."

    async def process_answer(self, user: User, step: int, answer: str):
        # In a real implementation, we would use an LLM to analyze the answer
        # and extract structured data (Style, Values) to update the User model.
        # For A0, we just map basic answers or log them.
        
        # TODO: Call LLM here to analyze answer.
        # For now, we assume linear progression.
        pass

    async def generate_system_prompt(self, user: User) -> str:
        """
        Generates the personalized System Prompt based on the User Profile.
        """
        base_prompt = (
            "Du är Lexi, en senior organisationspsykolog och strategisk rådgivare.\n"
            f"Din användare har rollen: {user.role}.\n"
            f"Ledarskapsstil: {user.leadership_style}.\n"
            f"Kommunikationsstil: {user.communication_style}.\n"
            "Ditt uppdrag är att vara en 'Sparringpartner' - utmana, stötta och analysera."
        )
        return base_prompt

onboarding_service = OnboardingService()
