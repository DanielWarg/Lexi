# Lexi Prime: Agent Guidelines (`AGENTS.md`)

Non-negotiable quality policy
Läs AGENTS.md och docs/QUALITY_CHARTER.md och följ dem strikt.

We optimize for correctness and readability over speed.

If output is not correct AND readable, it must be blocked (fail-closed). Never “almost correct”.

Prefer deterministic code fixes (normalize/layout/gates) over prompt tweaks.

Every PR must include: (1) tests updated/added, (2) before/after evidence, (3) risk/tradeoff note.

No new features until golden-path + render-gates are stable.

This document guides AI agents (and humans) working on Lexi Prime.
**Strictly follow these rules.** This is a "Vertical Slice" architecture (Local-First).

---

## 🚀 Build, Test & Run

### Backend (Python/FastAPI)
*   **Run Dev Server:** `uvicorn backend.main:app --reload` (or `.venv/bin/uvicorn ...`)
*   **Run Tests:** `.venv/bin/pytest backend/tests/` (Unit & Integration)
*   **Run Env Check:** `.venv/bin/python backend/test_a0_env.py`
*   **Install Dependencies:** `.venv/bin/pip install -r requirements.txt`

### How to Add a New Tool
1.  **Define Model:** Create a Pydantic model for input params in `backend/tools/your_tool.py`.
2.  **Implement:** Write the function and decorate with `@registry.register`.
3.  **Import:** Add `import backend.tools.your_tool` in `backend/api/endpoints/tools.py`.
4.  **Test:** Add a test case in `backend/tests/test_tools.py`.
5.  **Restart:** The Dashboard automatically discovers the new tool via Schema.

### Frontend (React/Vite)
*   **Run Dev Server:** `npm run dev` (in `frontend/`)
*   **Build:** `npm run build`
*   **Lint:** `npm run lint`
*   **Install:** `npm install`

### Native (Electron) - *Upcoming*
*   (Placeholder for future Electron commands)

---

## 📐 Code Style & Conventions

### General
*   **Architecture:** Monolithic for now. `backend/` is the brain. `frontend/` starts as a "dumb" view.
*   **Philosophy:** "Local First" & "Native Security". Do NOT introduce Docker or Cloud DBs without asking.
*   **Language:**
    *   **Code/Comments:** English.
    *   **UI/Persona:** Swedish (`sv-SE`).

### Python (Backend)
*   **Type Hinting:** Mandatory. Use `typing.Optional`, `List`, `Dict`.
*   **Models:** Use `SQLModel` for both Database and Pydantic validation.
*   **Async:** Use `async/await` for all I/O (DB, AI, File).
*   **Imports:** Absolute imports preferred: `from backend.core.config import settings`.
*   **Error Handling:** Use `fastapi.HTTPException`. Log errors via `print` (for now) or structured logger.
*   **Naming:** `snake_case` for variables/functions. `PascalCase` for classes.

### JavaScript/React (Frontend)
*   **Framework:** React 18+ (Functional Components + Hooks).
*   **Styling:** Tailwind CSS **only**. No separate `.css` files (except `index.css` global).
    *   Use `clsx` or `tailwind-merge` for conditional classes.
*   **Icons:** `lucide-react`.
*   **Naming:** `PascalCase` for Components (`Visualizer.jsx`). `camelCase` for functions/vars.
*   **Structure:**
    *   `src/components/` - Reusable UI chunks.
    *   `src/services/` - API clients (Socket.IO / Fetch).

---

## 🛡️ Vertical Slice (A0) Rules
1.  **Dependency Diet:** Do not add new libs unless essential. Ask first.
2.  **No Mocking:** Connect real SQLite/Chroma immediately.
3.  **Memory Contracts:**
    *   `policy="auto"` -> Routine logs.
    *   `policy="explicit"` -> User asked to remember.
    *   `policy="strategic"` -> Long-term profile data (Never delete).

## 🤖 Context for Agents
*   **Project:** "Lexi Prime" - An Executive Assistant / Organizational Psychologist.
*   **User:** A high-level executive who needs a "Sparring Partner", not a chatbot.
*   **Tone:** The AI persona is professional, challenging, and insightful (Swedish).
*   **Current Phase:** A0 (Infrastructure & Core). We are building the native bridge.

---

## 🛠️ Common Tasks
*   **Add a new Tool:**
    1.  Create `backend/tools/my_tool.py`.
    2.  Register in `ToolRegistry` (to be created).
    3.  Define Input/Output Schema Pydantic models.
*   **Update Database:**
    *   Modify `backend/models/`.
    *   (Future) Run Alembic migrations. For now, `SQLModel.metadata.create_all` on startup.

---

*(End of instructions)*
