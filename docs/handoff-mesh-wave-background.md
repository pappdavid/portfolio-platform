# Handoff: Mesh Wave Background

**Status:** Ready to implement
**Replaces:** `BackgroundBeams` (Aceternity) in `src/components/landing/landing-content.tsx`
**Preview:** `bg-preview.html` → "⌇ Mesh Wave" tab

---

## What it looks like

A grid of vertices that physically distort using overlapping sine waves. Green horizontal lines, cyan vertical lines. Nodes at intersections brighten where displacement peaks. Slow, organic movement — techy but not busy.

---

## Implementation steps

### 1. Create the component

**File:** `src/components/ui/mesh-wave.tsx`

- `'use client'` component
- Renders a `<canvas>` inside a `fixed inset-0 pointer-events-none z-0` div
- Uses `useEffect` + `useRef` for canvas setup and RAF loop
- Cleans up RAF and resize listener on unmount

**Key parameters to copy from `bg-preview.html` → `drawMeshWave()`:**

| Param | Value | Notes |
|-------|-------|-------|
| `MESH_COLS` | `28` | Horizontal vertex count |
| `MESH_ROWS` | `18` | Vertical vertex count |
| `AMP` | `22` | Max displacement in px |
| `FREQ` | `0.0038` | Spatial wave frequency |
| `SPEED` | `0.00055` | Time speed multiplier |
| Horizontal line color | `rgba(34,197,94, a)` | Green, alpha `0.06–0.18` |
| Vertical line color | `rgba(6,182,212, a)` | Cyan, alpha `0.05–0.13` |
| Node color | `rgba(34,197,94, a)` | Alpha scales with displacement |
| Vignette | radial, `rgba(4,4,8,0.78)` at edge | Darkens corners |

**Displacement formula (per vertex):**
```ts
const wave =
  Math.sin(bx * FREQ + t * SPEED) * Math.cos(by * FREQ * 1.3 + t * SPEED * 0.7)
  + Math.sin(bx * FREQ * 0.6 - by * FREQ * 0.8 + t * SPEED * 1.1) * 0.5;

pt.x = baseX + wave * AMP * 0.5;
pt.y = baseY + wave * AMP;
```

**Line alpha (horizontal lines):**
```ts
const norm = Math.min(1, Math.abs(midY / H - 0.5) * 2);
const alpha = 0.06 + norm * 0.12;
```

**Line alpha (vertical lines):**
```ts
const alpha = 0.05 + 0.08 * Math.abs(Math.sin(c * 0.4 + t * SPEED * 2));
```

**Node radius + alpha:**
```ts
const disp = Math.sqrt((x - bx)**2 + (y - by)**2) / AMP;
radius = 0.9 + disp * 1.5;
alpha  = 0.12 + disp * 0.35;
```

---

### 2. Wire it into the landing page

**File:** `src/components/landing/landing-content.tsx`

```diff
- import { BackgroundBeams } from '@/components/ui/background-beams';
+ import { MeshWave } from '@/components/ui/mesh-wave';

- <div className='pointer-events-none fixed inset-0 z-0'>
-   <BackgroundBeams className='opacity-50' />
- </div>
+ <MeshWave />
```

The `MeshWave` component handles its own `fixed inset-0` positioning internally.

---

### 3. Performance notes

- `requestAnimationFrame` loop — cancel on unmount via returned ID
- `O(COLS × ROWS)` per frame — 28×18 = 504 vertices, well within budget
- No external dependencies (pure canvas)
- Add `will-change: transform` to the canvas element

---

### 4. Optional tweaks

- **Slower / more subtle:** reduce `SPEED` to `0.00035`, `AMP` to `14`
- **More dramatic:** increase `AMP` to `32`, `FREQ` to `0.005`
- **Denser grid:** increase `MESH_COLS` to `36`, `MESH_ROWS` to `24`
- **Pure green (no cyan):** replace vertical line color with same green as horizontal

---

## Source reference

Full working implementation lives in:
`/Users/davidpapp/portfolio-platform/bg-preview.html` → `drawMeshWave()` function
