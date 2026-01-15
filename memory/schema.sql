-- Lexi User Memory Schema
-- SQLite database for storing user preferences, context, and memory

-- User preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Memory entries (summarized, not raw conversation)
CREATE TABLE IF NOT EXISTS memory_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',  -- 'work_style', 'preferences', 'facts', 'context'
    importance INTEGER DEFAULT 1,     -- 1-5, higher = more important
    source TEXT DEFAULT 'conversation',
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP              -- Optional expiry for temporary context
);

-- Memory versions (for undo/history)
CREATE TABLE IF NOT EXISTS memory_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memory_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    version INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (memory_id) REFERENCES memory_entries(id) ON DELETE CASCADE
);

-- Conversation summaries (daily/session summaries)
CREATE TABLE IF NOT EXISTS conversation_summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    summary TEXT NOT NULL,
    key_points TEXT,           -- JSON array of key points
    topics TEXT,               -- JSON array of topics discussed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_memory_category ON memory_entries(category);
CREATE INDEX IF NOT EXISTS idx_memory_active ON memory_entries(is_active);
CREATE INDEX IF NOT EXISTS idx_memory_importance ON memory_entries(importance);
CREATE INDEX IF NOT EXISTS idx_prefs_key ON user_preferences(key);
CREATE INDEX IF NOT EXISTS idx_summaries_session ON conversation_summaries(session_id);
