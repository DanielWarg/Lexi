"""
Lexi Memory Manager
===================
Manages user memory, preferences, and context using local JSON files.

NO external services - completely local/offline.

Memory structure:
- ~/.lexi/memory.json - Main memory file
- ~/.lexi/preferences.json - User preferences
"""

import asyncio
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, asdict, field


@dataclass
class MemoryEntry:
    """A single memory entry."""
    id: str
    content: str
    category: str = "general"  # work_style, preferences, facts, context
    importance: int = 1  # 1-5
    created_at: str = ""
    updated_at: str = ""
    
    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()
        if not self.updated_at:
            self.updated_at = self.created_at


@dataclass
class MemoryStore:
    """Complete memory store structure."""
    version: int = 1
    entries: List[Dict] = field(default_factory=list)
    preferences: Dict[str, Any] = field(default_factory=dict)
    last_updated: str = ""


class MemoryManager:
    """
    Manages Lexi's memory of the user.
    
    Uses local JSON files - NO external services.
    
    Memory is:
    - Summarized (not raw dialog)
    - Versioned (can undo changes)
    - Editable (user can modify/delete)
    - Categorized (for efficient retrieval)
    """
    
    def __init__(self, data_dir: str = None):
        if data_dir is None:
            self.data_dir = Path.home() / ".lexi"
        else:
            self.data_dir = Path(data_dir)
        
        self.memory_file = self.data_dir / "memory.json"
        self.preferences_file = self.data_dir / "preferences.json"
        self._store: Optional[MemoryStore] = None
        self._initialized = False
    
    async def initialize(self):
        """Initialize the memory system."""
        if self._initialized:
            return
        
        # Create directory if needed
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        # Load or create memory store
        await asyncio.to_thread(self._load_store)
        self._initialized = True
        print(f"[MEMORY] Initialized at {self.data_dir}")
    
    def _load_store(self):
        """Load memory store from file."""
        if self.memory_file.exists():
            try:
                with open(self.memory_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self._store = MemoryStore(
                        version=data.get('version', 1),
                        entries=data.get('entries', []),
                        preferences=data.get('preferences', {}),
                        last_updated=data.get('last_updated', '')
                    )
            except (json.JSONDecodeError, KeyError) as e:
                print(f"[MEMORY] Error loading memory file: {e}")
                self._store = MemoryStore()
        else:
            self._store = MemoryStore()
    
    def _save_store(self):
        """Save memory store to file."""
        if self._store is None:
            return
        
        self._store.last_updated = datetime.now().isoformat()
        
        data = {
            'version': self._store.version,
            'entries': self._store.entries,
            'preferences': self._store.preferences,
            'last_updated': self._store.last_updated
        }
        
        with open(self.memory_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    async def add_memory(
        self,
        content: str,
        category: str = "general",
        importance: int = 1
    ) -> str:
        """
        Add a new memory entry.
        
        Returns the ID of the new entry.
        """
        await self.initialize()
        
        entry_id = f"mem_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
        
        entry = MemoryEntry(
            id=entry_id,
            content=content,
            category=category,
            importance=min(max(importance, 1), 5)
        )
        
        self._store.entries.append(asdict(entry))
        await asyncio.to_thread(self._save_store)
        
        return entry_id
    
    async def get_memories(
        self,
        category: str = None,
        limit: int = 20,
        min_importance: int = 1
    ) -> List[Dict]:
        """Get memory entries, optionally filtered."""
        await self.initialize()
        
        entries = self._store.entries
        
        # Filter by category
        if category:
            entries = [e for e in entries if e.get('category') == category]
        
        # Filter by importance
        if min_importance > 1:
            entries = [e for e in entries if e.get('importance', 1) >= min_importance]
        
        # Sort by importance (desc) then by updated_at (desc)
        entries = sorted(
            entries,
            key=lambda x: (-x.get('importance', 1), x.get('updated_at', '')),
            reverse=False
        )
        
        return entries[:limit]
    
    async def update_memory(self, memory_id: str, content: str):
        """Update a memory entry."""
        await self.initialize()
        
        for entry in self._store.entries:
            if entry.get('id') == memory_id:
                entry['content'] = content
                entry['updated_at'] = datetime.now().isoformat()
                break
        
        await asyncio.to_thread(self._save_store)
    
    async def delete_memory(self, memory_id: str):
        """Delete a memory entry."""
        await self.initialize()
        
        self._store.entries = [
            e for e in self._store.entries if e.get('id') != memory_id
        ]
        
        await asyncio.to_thread(self._save_store)
    
    async def set_preference(self, key: str, value: Any):
        """Set a user preference."""
        await self.initialize()
        
        self._store.preferences[key] = value
        await asyncio.to_thread(self._save_store)
    
    async def get_preference(self, key: str, default: Any = None) -> Any:
        """Get a user preference."""
        await self.initialize()
        return self._store.preferences.get(key, default)
    
    async def get_context_for_llm(self, max_entries: int = 10) -> str:
        """
        Generate a context string for the LLM.
        
        Returns important memories formatted for system prompt injection.
        """
        memories = await self.get_memories(limit=max_entries, min_importance=2)
        
        if not memories:
            return ""
        
        lines = ["Användarkontext (saker jag minns om användaren):"]
        
        for mem in memories:
            category_emoji = {
                "work_style": "💼",
                "preferences": "⭐",
                "facts": "📌",
                "context": "💭",
                "general": "📝"
            }.get(mem.get('category', 'general'), "📝")
            
            lines.append(f"{category_emoji} {mem.get('content', '')}")
        
        return "\n".join(lines)
    
    async def export_memory(self) -> Dict:
        """Export all memory data (for backup/editing)."""
        await self.initialize()
        return {
            'version': self._store.version,
            'entries': self._store.entries,
            'preferences': self._store.preferences,
            'exported_at': datetime.now().isoformat()
        }
    
    async def import_memory(self, data: Dict):
        """Import memory data (from backup)."""
        await self.initialize()
        
        self._store.entries = data.get('entries', [])
        self._store.preferences = data.get('preferences', {})
        
        await asyncio.to_thread(self._save_store)


# Global memory manager instance
_manager: Optional[MemoryManager] = None


def get_memory_manager() -> MemoryManager:
    """Get or create the global memory manager."""
    global _manager
    if _manager is None:
        _manager = MemoryManager()
    return _manager
