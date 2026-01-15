# AGENTS.md - Lexi AI Assistant

> Guidelines for AI agents working in this codebase.

## Project Overview

Lexi is a macOS desktop AI assistant built with:
- **Frontend**: Electron + React + Vite + TailwindCSS
- **Backend**: Python 3.11 + FastAPI + Socket.IO
- **AI**: Google Gemini 2.5 Live API (real-time voice/vision)

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/DanielWarg/Lexi.git && cd Lexi
npm install
pip install -r requirements.txt
playwright install chromium

# 2. Configure API key
echo "GEMINI_API_KEY=your_key_here" > .env

# 3. Run development
npm run dev
```

---

## Build & Run Commands

### Development
```bash
npm run dev          # Start Vite + Electron (auto-starts Python backend)
python backend/server.py  # Run backend separately (for debugging)
```

### Production Build
```bash
npm run build        # Build Vite frontend to dist/
```

### Python Backend (standalone)
```bash
cd backend
python server.py     # Starts FastAPI on http://localhost:8000
```

### Testing
```bash
# Python tests
pytest tests/                    # Run all tests
pytest tests/test_file.py        # Run single test file
pytest tests/test_file.py::test_name  # Run single test function

# No frontend tests currently exist
```

---

## Project Structure

```
Lexi/
├── backend/           # Python backend
│   ├── server.py      # FastAPI + Socket.IO server
│   ├── lexi.py        # Gemini Live API integration
│   ├── memory_manager.py  # User memory (SQLite)
│   ├── voice/         # Voice pipeline
│   │   ├── stt.py     # Swedish speech-to-text (Whisper)
│   │   └── tts.py     # English text-to-speech (Edge TTS)
│   ├── web_agent.py   # Browser automation
│   └── kasa_agent.py  # Smart home
├── src/               # React frontend
│   ├── App.jsx        # Main component
│   └── components/    # UI components
├── skills/            # Modular skills framework
│   ├── base_skill.py  # BaseSkill abstract class
│   ├── skill_dispatcher.py  # Intent routing
│   ├── powerpoint_skill.py  # PPT generation
│   ├── report_skill.py      # Report generation
│   ├── linkedin_skill.py    # LinkedIn posts
│   ├── web_skill.py         # Web automation
│   └── kasa_skill.py        # Smart home
├── memory/            # User memory data
│   └── schema.sql     # SQLite schema
├── electron/          # Electron main process
└── requirements.txt   # Python dependencies
```

---

## Code Style Guidelines

### Python (Backend)

- **Python version**: 3.11+
- **Framework**: FastAPI with async/await
- **Imports**: Standard library → third-party → local, one blank line between groups
- **Naming**:
  - `snake_case` for functions, variables, files
  - `PascalCase` for classes
  - `SCREAMING_SNAKE_CASE` for constants
- **Type hints**: Use for function signatures
- **Async**: Prefer `async def` for I/O-bound operations
- **Error handling**: Use try/except with specific exceptions, log with print for now
- **Debug logs**: Use `print(f"[LEXI DEBUG] ...")` format

```python
# Example
async def handle_request(data: dict) -> dict:
    """Process incoming request."""
    try:
        result = await process(data)
        return {"status": "ok", "data": result}
    except ValueError as e:
        print(f"[LEXI DEBUG] [ERR] Invalid data: {e}")
        return {"status": "error", "message": str(e)}
```

### JavaScript/React (Frontend)

- **Framework**: React 18 with hooks
- **Styling**: TailwindCSS (utility classes)
- **State**: useState/useRef for local, no Redux
- **Imports**: React → third-party → components → local
- **Naming**:
  - `camelCase` for variables, functions
  - `PascalCase` for components
  - Refs with `...Ref` suffix
- **Socket.IO**: Use `socket.emit()` / `socket.on()` for backend communication
- **Comments**: JSDoc for complex functions

```jsx
// Example
const [isActive, setIsActive] = useState(false);
const videoRef = useRef(null);

useEffect(() => {
    socket.on('status', (data) => {
        if (data.msg === 'Lexi Started') {
            setIsActive(true);
        }
    });
    return () => socket.off('status');
}, []);
```

---

## Important Patterns

### Socket.IO Events (Frontend ↔ Backend)

| Event | Direction | Purpose |
|-------|-----------|---------|
| `start_audio` | F→B | Initialize Gemini session |
| `status` | B→F | System status messages |
| `transcription` | B→F | Real-time speech-to-text |
| `user_input` | F→B | Text messages from user |
| `video_frame` | F→B | Camera frames (JPEG blob) |

### Adding New Skills

```python
# skills/my_skill.py
from skills.base_skill import BaseSkill, SkillContext, SkillResult

class MySkill(BaseSkill):
    name = "my_skill"
    display_name = "Min Skill"
    description = "Beskrivning för LLM"
    triggers = ["kör min skill", "run my skill"]
    
    async def execute(self, context: SkillContext) -> SkillResult:
        # context.user_input - användarens text
        # context.on_status - callback för statusuppdatering
        return SkillResult(success=True, data={"result": "Done"})
```

Skills auto-upptäcks från `skills/` vid namnmönstret `*_skill.py`.

---

## Language Policy (Critical)

| Context | Language |
|---------|----------|
| UI text | Swedish 🇸🇪 |
| Documentation | Swedish 🇸🇪 |
| Voice output | English 🇬🇧 |
| Voice input | Swedish 🇸🇪 |
| Code/comments | English 🇬🇧 |

---

## Key Files to Know

- `backend/lexi.py` - Core AI loop, Gemini integration
- `backend/server.py` - All Socket.IO event handlers
- `backend/memory_manager.py` - User memory persistence
- `skills/base_skill.py` - Skill framework
- `src/App.jsx` - Main React component
- `script.md` - Source of truth for product vision

---

## Common Pitfalls

1. **Gemini API**: Requires `GEMINI_API_KEY` in `.env`
2. **Port 8000**: Backend runs here, Electron auto-starts it
3. **Port 5173**: Vite dev server
4. **macOS only**: Electron configured for darwin target
5. **Audio**: PyAudio requires `portaudio` (`brew install portaudio`)

---

## Git Workflow

```bash
git add -A
git commit -m "Type: Brief description"
git push origin main
```

Commit prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
