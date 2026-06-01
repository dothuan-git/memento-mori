import { useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ActiveCategory } from '../types';
// @ts-ignore
import { animate, stagger, remove } from 'animejs';

interface LifeGridProps {
  lifespan: number;
  age: number;
  activeCategories: ActiveCategory[];
  activePouringField: string | null;
  squaresCount: number;
}

export default function LifeGrid({ 
  lifespan, 
  age, 
  activeCategories, 
  activePouringField,
  squaresCount
 }: LifeGridProps) {
  const gridSize = Math.round(Math.sqrt(squaresCount));
  // Let's compute which square contains the current age (the "NOW" square)
  const nowIndex = Math.floor((age / lifespan) * squaresCount);

  const gridContainerRef = useRef<HTMLDivElement>(null);
  // Per-cell fill fraction (0–1) we last animated TO, so we can pour only the delta.
  const prevHeightsRef = useRef<number[]>([]);
  // Structural signature; when it changes the whole grid remaps and we replay in full.
  const prevLayoutRef = useRef<string>('');

  // Trigger anime.js staggered fill animation whenever gridData changes.
  // Append behaviour: only the cells whose fill actually changed are (re)animated,
  // and the stagger starts at the first changed cell — so the pour continues from
  // the moving frontier instead of draining and refilling the entire tapestry.
  useEffect(() => {
    const container = gridContainerRef.current;
    if (!container) return;

    const targets = container.querySelectorAll<HTMLElement>('.grid-cell-fill');
    if (!targets || targets.length === 0) return;

    // A change to cell count / lifespan invalidates per-cell indices — replay from scratch.
    // age is intentionally excluded so age changes append via the per-cell delta below.
    const layoutKey = `${squaresCount}|${lifespan}`;
    if (layoutKey !== prevLayoutRef.current) {
      prevHeightsRef.current = [];
      prevLayoutRef.current = layoutKey;
    }

    // Pouring water sequence effect!
    // e.g. for 100 squares, total duration is ~7 seconds, meaning ~70ms per square.
    const singleDuration = Math.max(35, Math.min(500, 7000 / squaresCount));

    const prevHeights = prevHeightsRef.current;
    const changed: HTMLElement[] = [];
    const oldByIndex = new Map<number, number>();
    let minChanged = Infinity;

    targets.forEach((el) => {
      const idx = parseInt(el.getAttribute('data-index') || '0');
      const newTarget = parseFloat(el.getAttribute('data-target-height') || '0') / 100;
      const oldTarget = prevHeights[idx] ?? 0;
      if (Math.abs(newTarget - oldTarget) > 0.001) {
        changed.push(el);
        oldByIndex.set(idx, oldTarget);
        if (idx < minChanged) minChanged = idx;
      }
      prevHeights[idx] = newTarget;
    });

    // Nothing grew or drained (e.g. only a gradient/color shifted) — React already
    // repainted the background; no height animation needed.
    if (changed.length === 0) return;

    // Halt any active animation on the cells we are about to re-pour.
    remove(changed);

    // Each square starts filling exactly as the previous changed one finishes,
    // mimicking water cascading sequentially from glass to glass.
    animate(changed, {
      height: [
        (el: HTMLElement) => `${((oldByIndex.get(parseInt(el.getAttribute('data-index') || '0')) ?? 0) * 100).toFixed(1)}%`,
        (el: HTMLElement) => el.getAttribute('data-target-height') || '0%'
      ],
      opacity: [
        (el: HTMLElement) => ((oldByIndex.get(parseInt(el.getAttribute('data-index') || '0')) ?? 0) > 0 ? 1 : 0),
        (el: HTMLElement) => (el.getAttribute('data-target-height') === '0%' ? 0 : 1)
      ],
      duration: singleDuration,
      delay: (el: HTMLElement) => {
        const idx = parseInt(el.getAttribute('data-index') || '0');
        return (idx - minChanged) * singleDuration;
      },
      ease: 'linear' // Perfect for steady water level rising
    });
  }, [activeCategories, age, lifespan, squaresCount]);

  // Helper to generate the background style and heights for a square
  const getSquareBackgroundAndTooltip = (idx: number, totalSquares: number) => {
    const L = (idx / totalSquares) * 100;
    const R = ((idx + 1) / totalSquares) * 100;
    const segments: { name: string; color: string; width: number; key: string }[] = [];

    activeCategories.forEach((cat) => {
      const start = Math.max(L, cat.cumulativeStart);
      const end = Math.min(R, cat.cumulativeEnd);
      if (start < end) {
        const width = end - start; // Fraction within this square
        segments.push({ name: cat.name, color: cat.color, width, key: cat.key });
      }
    });

    const intervalWidth = R - L;

    const filledFraction = segments
      .filter((s) => s.color !== 'transparent')
      .reduce((sum, s) => sum + s.width, 0) / (intervalWidth || 1);

    if (filledFraction === 0) {
      return { filledFraction: 0, liquidBackground: 'transparent', segments };
    }

    const nonTransparentSegments = segments.filter((s) => s.color !== 'transparent');

    if (nonTransparentSegments.length === 1) {
      return {
        filledFraction,
        liquidBackground: nonTransparentSegments[0].color,
        segments
      };
    }

    // Build gradient stops, normalized to 100% of the filled portion (bottom to top)
    let curr = 0;
    const stops: string[] = [];
    nonTransparentSegments.forEach((seg) => {
      const normWidth = (seg.width / intervalWidth) / filledFraction;
      const startPct = (curr * 100).toFixed(1);
      curr += normWidth;
      const endPct = (curr * 100).toFixed(1);
      stops.push(`${seg.color} ${startPct}%`);
      stops.push(`${seg.color} ${endPct}%`);
    });

    return {
      filledFraction,
      liquidBackground: `linear-gradient(to top, ${stops.join(', ')})`,
      segments
    };
  };

  const gridData = useMemo(() => {
    return Array.from({ length: squaresCount }, (_, i) => {
      const { filledFraction, liquidBackground, segments } = getSquareBackgroundAndTooltip(i, squaresCount);
      const startAge = (i * lifespan) / squaresCount;
      const endAge = ((i + 1) * lifespan) / squaresCount;
      const isPast = endAge <= age;
      const isFuture = startAge > age;
      const isNow = i === nowIndex;

      return {
        index: i,
        filledFraction,
        liquidBackground,
        segments,
        startAge,
        endAge,
        isPast,
        isFuture,
        isNow
      };
    });
  }, [lifespan, age, activeCategories, nowIndex, squaresCount]);

  return (
    <div className="flex flex-col space-y-5" id="life-grid-container">
      {/* Grid Dashboard Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c8563f] animate-[pulse_2s_infinite]" />
          <span className="text-xs uppercase font-serif tracking-[0.25em] font-medium text-[#2c2a29]">
            Tapestry of Days ({squaresCount} Squares)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#73706c] font-serif">
          <span>1 square = {(100 / squaresCount).toFixed(1)}% of raw time (~{(lifespan / squaresCount).toFixed(1)} yrs)</span>
        </div>
      </div>

      {/* Pristine Interactive Color Legend Row */}
      <div className="flex flex-wrap gap-2 p-2.5 bg-[#eae6db]/15 border border-[#2c2a29]/5 rounded-xl select-none" id="color-legend-row">
        {activeCategories.map((cat) => (
          <div 
            key={cat.key} 
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#fbfaf7]/80 border border-[#2c2a29]/10 shadow-[0_1px_2px_rgba(44,42,41,0.02)] text-[11.5px] font-serif transition-all hover:scale-[1.03] duration-200"
            title={cat.desc}
          >
            <span 
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                cat.color === 'transparent' ? 'border border-dashed border-[#2c2a29]/40 bg-transparent' : ''
              }`} 
              style={{ 
                backgroundColor: cat.color === 'transparent' ? undefined : cat.color,
                boxShadow: cat.color === 'transparent' ? 'none' : `0 1px 4px ${cat.color}40`
              }} 
            />
            <span className="text-[#2c2a29] font-medium">{cat.name}</span>
            <span className="text-[10px] text-[#73706c] font-mono font-semibold">({cat.percentage.toFixed(0)}%)</span>
          </div>
        ))}
      </div>

      {/* Dynamic N x N Grid representation */}
      <div className="relative">
        <div 
          ref={gridContainerRef}
          className="relative grid gap-1.5 sm:gap-2 p-5 bg-[#eae6db]/20 border border-[#2c2a29]/10 rounded-2xl select-none"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {gridData.map((cell, idx) => {
            const isNow = cell.isNow;

            // Is this cell actively receiving a "pour" from the active sliding category?
            const isPouringCell = activePouringField && cell.segments.some(s => s.key === activePouringField && s.width > 0.05);

            return (
              <motion.div
                key={cell.index}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.005, ease: "easeOut" }}
                whileHover={{ 
                  scale: 1.15, 
                  zIndex: 30,
                  boxShadow: '0 4px 12px rgba(44, 42, 41, 0.12)'
                }}
                className={`aspect-square w-full rounded-[4px] relative cursor-pointer group transition-all duration-300 border border-[#2c2a29]/15 bg-[#2c2a29]/5 hover:border-[#2c2a29]/30 ${
                  isNow ? 'ring-2 ring-[#c8563f] ring-offset-2 ring-offset-[#fbfaf7] z-25' : ''
                }`}
                id={`grid-cell-${idx}`}
                title={`Square ${idx + 1}: Ages ${cell.startAge.toFixed(1)} – ${cell.endAge.toFixed(1)}`}
              >
                {/* Clean, beautifully animejs-animated Horizontal Fill block matching precise lifetime percent occupied */}
                <div 
                  className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-[3px] grid-cell-fill origin-bottom"
                  data-target-height={`${(cell.filledFraction * 100).toFixed(1)}%`}
                  data-index={idx}
                  style={{ 
                    background: cell.liquidBackground || 'transparent',
                    height: `${(cell.filledFraction * 100).toFixed(1)}%`,
                  }}
                />

{/* Now square indicator highlight */}
                {isNow && (
                  <div className="absolute inset-0 rounded-[4px] border border-[#c8563f] animate-[pulse_1.5s_infinite] pointer-events-none z-30" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
