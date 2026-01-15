# Lexi

**Personlig AI-assistent för macOS**

Lexi är en installerbar desktop-applikation som kombinerar röst, text och kamera för att utföra riktigt arbete – inte bara prata.

---

## ✨ Funktioner

- 🎙️ **Röstinteraktion** – Prata på svenska, få svar på engelska
- � **Textgränssnitt** – All skriven kommunikation på svenska
- 📷 **Kameraåtkomst** – Objektidentifiering och visuell kontext
- 🔌 **Smart Home** – Kasa-integration för smarta enheter
- 🌐 **Webbagent** – Automatiserad webbläsare (Playwright)

### Planerade Skills (Core)
- 📊 PowerPoint-skapare (.pptx)
- 📄 Rapport-sammanställare
- 💼 LinkedIn-assistent

---

## 🚀 Snabbstart

### Förutsättningar
- macOS
- Python 3.11+
- Node.js 18+
- Gemini API-nyckel

### Installation

```bash
# Klona och installera
git clone https://github.com/DanielWarg/Lexi.git
cd Lexi

# Frontend
npm install

# Backend
pip install -r requirements.txt
playwright install chromium

# Konfigurera API-nyckel
echo "GEMINI_API_KEY=din_nyckel_här" > .env
```

### Kör utvecklingsmiljö

```bash
npm run dev
```

Detta startar:
- Vite dev server (port 5173)
- Electron-app
- Python backend (port 8000)

---

## 🏗️ Arkitektur

```
┌─────────────────────────────────────────┐
│           Electron Shell                │
│  ┌─────────────────────────────────┐   │
│  │     React UI (Svenska)          │   │
│  │  - Chat, Kamera, Inställningar  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↕ Socket.IO
┌─────────────────────────────────────────┐
│     Python Backend (FastAPI)            │
│  ┌──────────┐  ┌──────────┐            │
│  │ lexi.py  │  │ Skills   │            │
│  │ Gemini   │  │ Web/Kasa │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

---

## � Projektstruktur

```
Lexi/
├── backend/           # Python-server
│   ├── server.py      # FastAPI + Socket.IO
│   ├── lexi.py        # Gemini Live API
│   ├── web_agent.py   # Webbautomation
│   └── kasa_agent.py  # Smart home
├── src/               # React-frontend
│   ├── App.jsx        # Huvudkomponent
│   └── components/    # UI-komponenter
├── electron/          # Electron main process
└── skills/            # Moduler (planerat)
```

---

## 🔧 Bygga för distribution

```bash
npm run build:mac
```

Skapar en `.dmg`-fil i `dist/`-mappen.

---

## 🌐 Språkpolicy

| Kontext | Språk |
|---------|-------|
| UI/Text | Svenska 🇸🇪 |
| Röst-output | Engelska 🇬🇧 |
| Röst-input | Svenska 🇸🇪 |
| Kod/Kommentarer | Engelska 🇬🇧 |

---

## 📄 Licens

MIT
