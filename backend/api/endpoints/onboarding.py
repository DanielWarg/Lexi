from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.database import get_session
from backend.models.user import User
from backend.services.onboarding import onboarding_service
from sqlmodel import select

router = APIRouter()

class AnswerRequest(BaseModel):
    step: int
    answer: str

class OnboardingResponse(BaseModel):
    message: str
    next_step: int
    complete: bool

@router.post("/answer", response_model=OnboardingResponse)
async def submit_answer(request: AnswerRequest, session: AsyncSession = Depends(get_session)):
    # Get User
    result = await session.execute(select(User))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not initialized")

    # Process Answer
    await onboarding_service.process_answer(user, request.step, request.answer)
    
    # Get Next Question
    next_step = request.step + 1
    question = await onboarding_service.get_next_question(user, next_step)
    
    # Check completion
    is_complete = next_step >= len(onboarding_service.INTERVIEW_QUESTIONS)
    if is_complete:
        user.is_onboarded = True
        session.add(user)
        await session.commit()
    
    return OnboardingResponse(
        message=question,
        next_step=next_step,
        complete=is_complete
    )

@router.get("/start")
async def start_interview(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User))
    user = result.scalars().first()
    if not user:
         # Create default user if none exists
        user = User(name="Executive", role="Executive")
        session.add(user)
        await session.commit()
        await session.refresh(user)

    question = await onboarding_service.get_next_question(user, 0)
    return {"message": question, "step": 0}
