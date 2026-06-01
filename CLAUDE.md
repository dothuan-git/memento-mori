# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server on http://localhost:3000
npm run build      # production build to dist/
npm run preview    # serve dist/ locally
npm run lint       # type-check only (tsc --noEmit) — no test suite exists
```

There are no automated tests. Type-checking is the only static verification step.

## Architecture

### View flow

The app has two views toggled by a single `view` state string in `App.tsx`:

1. **`LandingView`** — animated splash screen, single "Step Inside" button
2. **Main dashboard** — rendered inline in `App.tsx`

No router library is used.

### State and computation

All state lives in `App.tsx`. The core of the app is a `useMemo` that produces a `LifespanStats` object (typed in `src/types.ts`) from the raw input state. This object drives every visual:

- `categoriesList` — ordered array of all categories with percentages of total lifetime hours
- `activeCategories` — filtered + cumulative-offset version used by `LifeGrid` to map categories onto grid cells
- Scalar outputs (`remainingYears`, `freeHoursTotal`, etc.) used by `DetailsPanel`

The calculation is a closed-loop system: sleep deducts from all hours, work deducts only up to `retirementAge`, all other habits deduct from remaining waking future time. If total daily hours exceed 24, a `scaleFactor` normalizes all future activities proportionally and `isOverworked` is set.

### Component responsibilities

| Component | Role |
|---|---|
| `LifeGrid` | Renders the N×N tapestry grid. Per-cell fill fractions and gradient colors are computed via `useMemo` from `activeCategories`. Anime.js drives the staggered bottom-to-top fill animation on every `activeCategories` change. The `activePouringField` prop highlights cells belonging to the currently-focused slider. |
| `HabitSlider` | Generic controlled input card used for all sliders (built-in and custom). Custom habits additionally expose name editing, color picker, and a delete button. `onStartPour`/`onEndPour` propagate back to App to set `activePouringField`. |
| `DetailsPanel` | Displays free-time summary and social media impact warning derived from `LifespanStats`. |
| `ContemplativeQuotes` | Self-contained rotating quotes footer. |

### Styling

Tailwind CSS v4 loaded via the `@tailwindcss/vite` plugin — there is no `tailwind.config.js` or PostCSS config. All colors are defined inline as hex literals; the palette centers on `#fbfaf7` (background), `#2c2a29` (text), and `#c8563f` (accent).

### Path alias

`@` resolves to the repo root (configured in `vite.config.ts`).

### Environment variables

`GEMINI_API_KEY` and `APP_URL` are defined in `.env.example`. `DISABLE_HMR=true` disables Vite HMR and file watching (used in AI Studio environments).
