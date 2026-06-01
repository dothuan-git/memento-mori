# Memento Mori

A life visualization tool that maps how your daily habits consume your finite time. Enter your birthday, configure how many hours per day you spend on sleep, work, eating, commuting, and social media — then watch a proportional grid fill with how those commitments accumulate over a lifetime.

## Features

- **Life Tapestry Grid** — visual grid (5×5 to 20×20) where each cell represents a proportional slice of your life, colored by category
- **Daily Hours Allocation** — sliders for sleep, work (with configurable retirement age), eating, commuting, and social media
- **Custom Habits** — add and name your own daily habit categories with custom colors
- **Whole Lifespan Ledger** — summary cards showing years and percentage allocated to each category
- **Overcommitment Warning** — flags when daily hour totals exceed 24 hours and scales proportionally
- **Contemplative Quotes** — rotating footer quotes

## Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Motion (Framer Motion) for animations
- Lucide React for icons

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Type-check with `tsc --noEmit` |

## Environment

Copy `.env.example` to `.env` and fill in any required API keys before running.
