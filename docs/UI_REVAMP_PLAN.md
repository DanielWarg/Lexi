# Lexi UI Revamp — Implementation Plan

## Priorities
1. **Keep Everything Functional** — No breaking changes
2. **Lexi Sphere** — Breathing 3D visualization
3. **Compact Bottom Menu** — TARS-inspired, ~50% smaller
4. **Unified Popups** — Consistent design language

---

## Prio 2: Lexi Sphere

Replace the current ring visualizer with a living, breathing 3D sphere.

### States
| State | Visual |
|-------|--------|
| **Sleep** (muted) | Slow 4s breathing cycle, dim glow |
| **Listen** (unmuted) | Faster pulse, particle activation |
| **Speak** (audio) | Audio-reactive deformation, expanding rings |

### Implementation
- Use `@react-three/fiber` (already installed)
- Shader-based glow + deformation
- Connect `aiAudioData` to shader uniforms

### File: `src/components/Visualizer.jsx`

---

## Prio 3: Compact Bottom Menu

Reduce toolbar to ~50% width with TARS-inspired design.

### Specs
| Property | Value |
|----------|-------|
| Width | ~280px (from ~500px) |
| Height | 48px |
| Icons | 24px |
| Gap | 12px |
| Separator | Vertical line between primary/secondary |

### Layout
```
┌─────────────────────────┐
│ ⚡ 🎤 📹 ⚙️ │ 💡 🖨 🌐 │
└─────────────────────────┘
```

### File: `src/components/ToolsModule.jsx`

---

## Prio 4: Unified Popups

### Global Changes
- Consistent header: icon + title + close (X)
- Enhanced glass effect (`backdrop-blur-xl`)
- Entry animation: fade + scale from 95%
- Hover glow on close button

### Per Popup

| Popup | Size | Changes |
|-------|------|---------|
| **BrowserWindow** | **90% viewport** | Major resize, header update |
| **SettingsWindow** | Current | Header update |
| **PrinterWindow** | Current | Header update |
| **KasaWindow** | Current | Header update |
| **ConfirmationPopup** | Small modal | Pulsing border |
| **Video feed** | Fixed bottom-right | Frame update |

### Files
- `src/components/BrowserWindow.jsx`
- `src/components/SettingsWindow.jsx`
- `src/components/PrinterWindow.jsx`
- `src/components/KasaWindow.jsx`
- `src/components/ConfirmationPopup.jsx`

---

## File Summary

| File | Change |
|------|--------|
| `Visualizer.jsx` | Complete rewrite → 3D sphere |
| `ToolsModule.jsx` | Compact layout, new animations |
| `BrowserWindow.jsx` | Resize to 90%, header update |
| `SettingsWindow.jsx` | Header update |
| `PrinterWindow.jsx` | Header update |
| `KasaWindow.jsx` | Header update |
| `ConfirmationPopup.jsx` | Pulsing style |
| `App.jsx` | Position adjustments |
| `index.css` | New keyframe animations |

---

## Time Estimate

| Prio | Task | Time |
|------|------|------|
| 2 | Lexi Sphere | 3-4h |
| 3 | Bottom Menu | 1.5h |
| 4 | Popup updates | 2h |
| — | Test & Polish | 1h |
| **Total** | | **~8h** |

---

## Build Order
1. [x] Lexi Sphere (Visualizer.jsx)
2. [x] Bottom Menu (ToolsModule.jsx)
3. [x] BrowserWindow (90% size)
4. [ ] Other popup headers
5. [ ] Test all states
6. [ ] Polish animations
