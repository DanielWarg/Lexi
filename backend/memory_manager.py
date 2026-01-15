"""
Lexi Memory Manager
===================
Manages user memory, preferences, and context.

Features:
- Stores summarized memories (not raw conversations)
- Version history for undo
- Categories: work_style, preferences, facts, context
- Importance ranking
- Automatic summarization
"""

import sqlite3
import asyncio
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, asdict


@dataclass
class MemoryEntry:
    """A single memory entry."""
    id: Optional[int] = None
    content: str = ""
    category: str = "general"
    importance: int = 1
    source: str = "conversation"
    version: int = 1
    is_active: bool = True
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


@dataclass
class UserPreference:
    """A user preference setting."""
    key: str
    value: Any
    category: str = "general"


class MemoryManager:
    """
    Manages Lexi's memory of the user.
    
    Memory is:
    - Summarized (not raw dialog)
    - Versioned (can undo changes)
    - Editable (user can modify/delete)
    - Categorized (for efficient retrieval)
    """
    
    def __init__(self, db_path: str = None):
        if db_path is None:
            # Default to user's home directory
            data_dir = Path.home() / ".lexi" / "data"
            data_dir.mkdir(parents=True, exist_ok=True)
            db_path = str(data_dir / "memory.db")
        
        self.db_path = db_path
        self._conn: Optional[sqlite3.Connection] = None
        self._initialized = False
    
    async def initialize(self):
        """Initialize the database connection and schema."""
        if self._initialized:
            return
        
        # Run in thread pool to not block
        await asyncio.to_thread(self._init_db)
        self._initialized = True
        print(f"[MEMORY] Initialized at {self.db_path}")
    
    def _init_db(self):
        """Initialize database (sync, called from thread pool)."""
        self._conn = sqlite3.connect(self.db_path)
        self._conn.row_factory = sqlite3.Row
        
        # Load and execute schema
        schema_path = Path(__file__).parent.parent / "memory" / "schema.sql"
        if schema_path.exists():
            with open(schema_path) as f:
                self._conn.executescript(f.read())
            self._conn.commit()
    
    async def add_memory(
        self,
        content: str,
        category: str = "general",
        importance: int = 1,
        source: str = "conversation"
    ) -> int:
        """
        Add a new memory entry.
        
        Args:
            content: The memory content (should be summarized)
            category: Category for organization
            importance: 1-5, higher = more important
            source: Where the memory came from
            
        Returns:
            ID of the new memory entry
        """
        await self.initialize()
        
        def _insert():
            cursor = self._conn.execute(
                """
                INSERT INTO memory_entries (content, category, importance, source)
                VALUES (?, ?, ?, ?)
                """,
                (content, category, min(max(importance, 1), 5), source)
            )
            self._conn.commit()
            return cursor.lastrowid
        
        return await asyncio.to_thread(_insert)
    
    async def get_memories(
        self,
        category: str = None,
        limit: int = 20,
        min_importance: int = 1
    ) -> List[MemoryEntry]:
        """Get memory entries, optionally filtered."""
        await self.initialize()
        
        def _query():
            query = "SELECT * FROM memory_entries WHERE is_active = TRUE"
            params = []
            
            if category:
                query += " AND category = ?"
                params.append(category)
            
            if min_importance > 1:
                query += " AND importance >= ?"
                params.append(min_importance)
            
            query += " ORDER BY importance DESC, updated_at DESC LIMIT ?"
            params.append(limit)
            
            cursor = self._conn.execute(query, params)
            rows = cursor.fetchall()
            
            return [
                MemoryEntry(
                    id=row["id"],
                    content=row["content"],
                    category=row["category"],
                    importance=row["importance"],
                    source=row["source"],
                    version=row["version"],
                    is_active=bool(row["is_active"]),
                    created_at=row["created_at"],
                    updated_at=row["updated_at"]
                )
                for row in rows
            ]
        
        return await asyncio.to_thread(_query)
    
    async def update_memory(
        self,
        memory_id: int,
        content: str,
        save_version: bool = True
    ):
        """Update a memory entry, optionally saving the old version."""
        await self.initialize()
        
        def _update():
            if save_version:
                # Save current version first
                cursor = self._conn.execute(
                    "SELECT content, version FROM memory_entries WHERE id = ?",
                    (memory_id,)
                )
                row = cursor.fetchone()
                if row:
                    self._conn.execute(
                        """
                        INSERT INTO memory_versions (memory_id, content, version)
                        VALUES (?, ?, ?)
                        """,
                        (memory_id, row["content"], row["version"])
                    )
            
            # Update with new content
            self._conn.execute(
                """
                UPDATE memory_entries 
                SET content = ?, version = version + 1, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                """,
                (content, memory_id)
            )
            self._conn.commit()
        
        await asyncio.to_thread(_update)
    
    async def delete_memory(self, memory_id: int, soft: bool = True):
        """Delete a memory entry (soft delete by default)."""
        await self.initialize()
        
        def _delete():
            if soft:
                self._conn.execute(
                    "UPDATE memory_entries SET is_active = FALSE WHERE id = ?",
                    (memory_id,)
                )
            else:
                self._conn.execute(
                    "DELETE FROM memory_entries WHERE id = ?",
                    (memory_id,)
                )
            self._conn.commit()
        
        await asyncio.to_thread(_delete)
    
    async def set_preference(self, key: str, value: Any, category: str = "general"):
        """Set a user preference."""
        await self.initialize()
        
        def _set():
            value_json = json.dumps(value) if not isinstance(value, str) else value
            self._conn.execute(
                """
                INSERT INTO user_preferences (key, value, category)
                VALUES (?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET 
                    value = excluded.value,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (key, value_json, category)
            )
            self._conn.commit()
        
        await asyncio.to_thread(_set)
    
    async def get_preference(self, key: str, default: Any = None) -> Any:
        """Get a user preference."""
        await self.initialize()
        
        def _get():
            cursor = self._conn.execute(
                "SELECT value FROM user_preferences WHERE key = ?",
                (key,)
            )
            row = cursor.fetchone()
            if row:
                try:
                    return json.loads(row["value"])
                except (json.JSONDecodeError, TypeError):
                    return row["value"]
            return default
        
        return await asyncio.to_thread(_get)
    
    async def get_context_for_llm(self, max_entries: int = 10) -> str:
        """
        Generate a context string for the LLM.
        
        Returns important memories formatted for system prompt injection.
        """
        memories = await self.get_memories(limit=max_entries, min_importance=2)
        
        if not memories:
            return ""
        
        lines = ["User context (things I remember about the user):"]
        
        for mem in memories:
            category_emoji = {
                "work_style": "💼",
                "preferences": "⭐",
                "facts": "📌",
                "context": "💭",
                "general": "📝"
            }.get(mem.category, "📝")
            
            lines.append(f"{category_emoji} {mem.content}")
        
        return "\n".join(lines)
    
    async def save_conversation_summary(
        self,
        session_id: str,
        summary: str,
        key_points: List[str] = None,
        topics: List[str] = None
    ):
        """Save a conversation summary."""
        await self.initialize()
        
        def _save():
            self._conn.execute(
                """
                INSERT INTO conversation_summaries (session_id, summary, key_points, topics)
                VALUES (?, ?, ?, ?)
                """,
                (
                    session_id,
                    summary,
                    json.dumps(key_points or []),
                    json.dumps(topics or [])
                )
            )
            self._conn.commit()
        
        await asyncio.to_thread(_save)
    
    async def close(self):
        """Close the database connection."""
        if self._conn:
            self._conn.close()
            self._conn = None
            self._initialized = False


# Global memory manager instance
_manager: Optional[MemoryManager] = None


def get_memory_manager() -> MemoryManager:
    """Get or create the global memory manager."""
    global _manager
    if _manager is None:
        _manager = MemoryManager()
    return _manager
