# AGENTS.md

## 1. Build, Lint, and Test Commands

### Backend (`backend/`)
- **Environment:** Python 3.x (Active in `.venv`)
- **Install Info:** `requirements.txt`
- **Run Server:** `.venv/bin/uvicorn backend.server:app_socketio --host 0.0.0.0 --port 8000 --reload`
- **Test:**
  - Run all: `.venv/bin/pytest backend/tests/`
  - Run single file: `.venv/bin/pytest backend/tests/test_filename.py`
  - Run single test: `.venv/bin/pytest backend/tests/test_filename.py::test_function_name`

### Frontend (`frontend/`)
- **Stack:** React + Vite + Electron
- **Install:** `cd frontend && npm install`
- **Dev Server:** `cd frontend && npm run dev`
- **Lint:** `cd frontend && npm run lint` (if configured in package.json)
- **Build:** `cd frontend && npm run build`

---

## 2. Code Style & Guidelines

### Python (Backend)
- **Formatting:** Adhere to PEP 8. Use `snake_case` for functions/variables, `PascalCase` for classes.
- **Imports:** Group standard libs, third-party, then local modules.
  - Example: `from backend.agent import MyAgent` (absolute imports preferred).
- **Type Hinting:** Use `typing` (List, Dict, Optional) for all function signatures.
- **AsyncIO:** The server is heavily async. Use `async def` and `await` for I/O operations.
- **Error Handling:**
  - Use `try/except` blocks in agent loops.
  - Log errors with context: `print(f"[Module DEBUG] Error: {e}")`.
  - Do not swallow exceptions silently unless intended.

### JavaScript/React (Frontend)
- **Formatting:** Use 4-space indentation (matching existing files). Semicolons required.
- **Components:** Functional components with Hooks (`useState`, `useEffect`).
- **State Management:** Local state preferred; lift state up to `App.jsx` for global access (SocketIO data).
- **Socket.IO:**
  - Listeners: `socket.on('event', data => ...)` inside `useEffect`.
  - Emitters: `socket.emit('event', payload)`.
  - Clean up listeners in `useEffect` return function.
- **Naming:** `PascalCase` for Components, `camelCase` for functions/variables.

### Project Structure
- `backend/` - All Python logic, agents `(printer_agent.py, cad_agent.py)`, and server.
- `frontend/src/components/` - React UI components.
- `frontend/electron/` - Electron main process.

### Special Rules (Agentic Context)
- **Surgical Changes:** When debugging, create a reproduction script or minimal test case first.
- **File Operations:** Always use absolute paths or resolve relative paths safely.
- **Safety:** Do not delete user data without confirmation.
