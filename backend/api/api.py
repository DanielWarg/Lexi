from fastapi import APIRouter
from backend.api.endpoints import user, onboarding, projects

api_router = APIRouter()

api_router.include_router(user.router, prefix="/user", tags=["user"])
api_router.include_router(onboarding.router, prefix="/onboarding", tags=["onboarding"])
from backend.api.endpoints import tools
api_router.include_router(tools.router, prefix="/tools", tags=["tools"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
