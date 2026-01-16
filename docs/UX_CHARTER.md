# UX CHARTER: Lexi Prime (Voice-First)

> **This document is LOCKED. Any changes require explicit user approval.**

## Core Philosophy
Lexi is the **only actor**. The user speaks. Lexi does.

## Non-Negotiable Principles

### 1. Voice-First, Always On
- Microphone is **always active** (no push-to-talk).
- User can only: (1) mute mic in settings, (2) close popups manually, (3) drag/move popups.
- All navigation, creation, and editing happens via voice.

### 2. No Buttons for Actions
- UI may **show** information, previews, and status.
- UI may **never require** clicks for actions.
- Keyboard shortcuts (`Esc`, `Cmd+K`) are allowed as escape hatches.

### 3. Lexi Controls UI
- Popups are opened by Lexi, not the user.
- User says "Visa projekt X" → Lexi opens popup.
- Popups are **read-only** views of data.

### 4. Project-Driven Context
- Lexi always has exactly **one active project**.
- All actions (docs, mail, bookings) attach to active project.
- If no project is active, Lexi asks: "Vilket projekt arbetar vi med?"

### 5. Preview-First for Destructive Actions
- Delete, Archive, and other destructive actions:
  - Show preview in popup.
  - Wait for voice confirmation ("Ja, godkänn").
  - 10-second timeout → Lexi asks "Ska jag fortsätta?"

## Screens (Minimal, Premium)

### 1. Project List (Background Canvas)
- Always visible behind everything.
- Shows: Project name, status, last activity.
- Tabs: Active | Archived | Trash (voice-controlled).
- **Read-only.** Clicks do nothing.

### 2. Project Popup (Foreground Detail)
- Opened by Lexi via voice command.
- Shows: Title, Key, Description, Activity Log.
- **Read-only.** Closes via `Esc` or "Stäng popup".

### 3. Orb (Central Indicator)
- **Idle:** Slow pulse (listening).
- **Thinking:** Fast pulse (processing).
- **Speaking:** Glow expand (Lexi responds).
- **Alert:** Red blink (awaiting confirmation).

## Implementation Rules

```
❌ onClick={() => performAction()}
✅ useEffect(() => listenToLexiCommand())
```

- No UI logic may initiate actions.
- UI reacts **only** to state changes from Lexi.
- Lexi is the **sole initiator** of all mutations.

---

*Last Updated: 2026-01-16*
