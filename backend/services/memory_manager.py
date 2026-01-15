import chromadb
from chromadb.config import Settings
from sqlmodel import Session, select
from backend.core.config import settings
from backend.models.memory import Memory
from backend.models.user import User

class MemoryManager:
    def __init__(self):
        # Local Vector Store (ChromaDB)
        # Using persist_directory to keep data on disk without Docker
        self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
        
        # Collections:
        # 'memories' -> General knowledge / conversational history worth keeping
        self.collection = self.chroma_client.get_or_create_collection(name="lexi_memories")
        
        # Session State (In-Memory for now, can be SQLite backed later)
        self.session_history = [] 

    async def add_memory(self, user_id: int, content: str, importance: int = 1, policy: str = "auto"):
        """
        Adds a memory to the vector store and SQL database.
        Policy: 'auto' (routine info) vs 'explicit' (user requested) vs 'strategic' (forever).
        """
        # 1. Embed and Store in Vector DB
        # Chroma handles embedding automatically if no embedding function is provided (uses default)
        # For better quality, we might swap this later, but default is fine for A0.
        
        # We need a unique ID for the vector
        import uuid
        vector_id = str(uuid.uuid4())
        
        self.collection.add(
            documents=[content],
            metadatas=[{"importance": importance, "user_id": user_id, "policy": policy}],
            ids=[vector_id]
        )
        
        # 2. Store Metadata in SQL (for relationship and modification)
        # logic to insert into Memory table would go here if we pass a session
        return vector_id

    async def retrieve_relevant(self, query: str, k: int = 3):
        results = self.collection.query(
            query_texts=[query],
            n_results=k
        )
        return results['documents'][0] if results['documents'] else []

    async def add_chat_history(self, role: str, content: str):
        self.session_history.append({"role": role, "content": content})
        # TODO: Implement "Memory Consolidator" here? 
        # i.e., every 10 turns, summarize and call add_memory()

    def get_chat_history(self):
        return self.session_history

memory_service = MemoryManager()
