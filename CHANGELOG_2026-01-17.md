# Changelog 2026-01-17

## Sammanfattning
Idag har fokus varit på att städa upp projektet, optimera prestanda och byta identitet från A.D.A till Lexi. Vi har också genomfört en "Safe Clean" av CAD-agenten.

### 🧹 Code Cleanup & Safety
*   **Safe CAD Removal:**
    *   Successfully removed `cad_agent.py`, `temp_cad_gen.py`, `verify_cad.py` after disabling backend logic first to prevent audio crashes.
    *   Updated `ada.py` and `server.py` to stub out CAD endpoints.
    *   **Tag:** `stable-voice-restore-point` created before this cleanup.
*   **Documentation:**
    *   Removed obsolete plan files (`cad_removal_plan.md`, `gesture_removal_notes.md`).
    *   Updated `AGENTS.md` to reflect current removed status of Printer and CAD agents.
*   **Hand Gestures:** Inaktiverat (Kommenterat ut kod för enkel återställning).
*   **3D Printer:** Inaktiverat (Agent borttagen, UI-fönster borttaget).
*   **Browser Agent:** Behållen som kärnfunktionalitet.

### 🎭 Persona & Identitet
*   **Nytt Namn:** Lexi (ersätter A.D.A).
*   **Ny System Prompt:** "Tänkpartner" (Ann-Christin) - Alltid svenska, varm och professionell.
*   **UI:** Uppdaterat alla synliga texter till "Lexi".

### ⚡ Prestanda & Upplevelse
*   **Audio Lag Fix:** Implementerat `is_speaking`-flagga som tystar mikrofonen medan Lexi pratar (löser eko/feedback-loop).
*   **GPU-Animeringar:** Bytt ut tunga JS-canvas animeringar (Visualizer, Voice Wave) mot CSS-baserade, hårdvaruaccelererade animationer.
*   **Throttling:** Begränsat mikrofon-datauppdateringar till 15fps för att spara CPU.

### 🐛 Bug Fixes
*   **Black Screen:** Fixat startproblem relaterat till React prop-dependencies vid borttagning av gester.
*   **Audio Input:** Återställt fungerande ljudinmatning genom att rulla tillbaka till stabil version (`088b1ba`) och göra om CAD-städningen säkert.

---
*Created by Antigravity*
