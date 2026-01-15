import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Lexi Prime"
    API_V1_STR: str = "/api/v1"
    
    # Database (Pure SQLite)
    DATABASE_URL: str = "sqlite+aiosqlite:///./lexi.db"
    
    # Security
    SECRET_KEY: str = "changeme_in_production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 
    
    # AI Keys (Loaded from Env or Keychain)
    GEMINI_API_KEY: str = None
    
    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    CHROMA_PERSIST_DIR: str = os.path.join(BASE_DIR, "data", "chroma")
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        from backend.core.security import get_api_key
        if not self.GEMINI_API_KEY:
            self.GEMINI_API_KEY = get_api_key("GEMINI_API_KEY")

settings = Settings()
