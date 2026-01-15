# Lexi Prime (v4) - Executive Sparring Partner

Lexi Prime is a local-first, privacy-focused AI assistant customized for Executive & Strategic workflows.
She acts as a "Sparring Partner" rather than a passive chatbot—proactively offering tools for leadership, communication, and strategy.

## 🚀 Key Features (Vertical Slice A0)
*   **Native & Secure:** Protected by macOS TouchID/FaceID via Electron Bridge. API keys stored in System Keychain.
*   **Identity-Aware:** Knows your leadership style, values, and goals (via "The Interview").
*   **Local-First Memory:** Uses `SQLite` (Structured) and `ChromaDB` (Vector) for fast, private recall.
*   **Executive Tools:**
    *   **LinkedIn Drafter:** Turns raw thoughts into viral, high-level posts.
    *   **Report Generator:** Creates rigorous PDF reports from chat context.

## 🛠️ Architecture
*   **Backend:** Python (FastAPI, SQLModel, google-genai).
*   **Frontend:** React (Vite, Tailwind, Lucide).
*   **Desktop:** Electron (IPC Bridge for Native Auth).
*   **Testing:** Pytest + Async Fixtures.

## ⚡ Quick Start

### 1. Prerequisites
*   Python 3.9+
*   Node.js 18+
*   macOS (for TouchID/FaceID features)

### 2. Setup
```bash
# 1. Backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
./setup_keys.py # (Or set GEMINI_API_KEY env var)

# 2. Frontend
cd frontend
npm install
npm run build
cd ..

# 3. Run Dev Mode
# Terminal 1:
uvicorn backend.main:app --reload

# Terminal 2:
npm start # (Runs Electron wrapper + Frontend)
```

## 🧪 Testing
```bash
# Run backend test suite
.venv/bin/pytest backend/tests/
```

## 📂 Project Structure
*   `backend/core/` - Config, Security, Database
*   `backend/tools/` - Modular Tool Registry (Add new tools here)
*   `backend/models/` - SQLModel Definitions (User, Memory)
*   `frontend/src/` - React UI
*   `desktop/` - Electron Main Process

## 📜 License
Private & Confidential.
