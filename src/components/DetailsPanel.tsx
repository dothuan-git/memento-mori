import { motion } from 'motion/react';
import { AlertTriangle, Clock, Sparkles } from 'lucide-react';
import { LifespanStats } from '../types';

interface DetailsPanelProps {
  stats: LifespanStats;
  lifespan: number;
}

export default function DetailsPanel({ stats, lifespan }: DetailsPanelProps) {
  const {
    age,
    remainingYears,
    remainingDays,
    remainingWakingHours,
    freeHoursTotal,
    isOverworked,
    categoriesList,
  } = stats;

  // Let's compute free-time details:
  const freeYears = (freeHoursTotal / 24) / 365.25;
  const freeDays = freeHoursTotal / 24;
  const freeWeeks = freeDays / 7;

  // Social media metrics to show dynamic alert warning
  const socialCat = categoriesList.find((c) => c.key === 'social');
  const socialHoursPerDay = socialCat ? socialCat.originalHours : 0;
  // social media years = remainingDays * socialHoursPerDay / 24 / 365.25
  const socialYearsTotal = remainingDays * (socialHoursPerDay / 24) / 365.25;

  return (
    <div className="space-y-6" id="details-panel-container">
      {/* 1. Dynamic Metric Dashboard Accent */}
      <div className="relative p-6 rounded-2xl border border-[#2c2a29]/10 bg-[#fbfaf7] select-none overflow-hidden">
        {/* Soft circle light backdrop if free time > 0 */}
        {!isOverworked && freeHoursTotal > 0 && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d2b48c]/10 pointer-events-none rounded-full blur-2xl" />
        )}
        
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#73706c] font-serif font-light">
            <Sparkles className="w-3.5 h-3.5 text-[#d2b48c]" />
            <span>Uncommitted Potential Remainder</span>
          </div>

          {isOverworked ? (
            <div className="space-y-2 p-3 rounded-xl bg-[#b8483f]/5 border border-[#b8483f]/20">
              <div className="flex items-center gap-2 text-[#b8483f]">
                <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0" />
                <h4 className="font-serif text-sm font-semibold uppercase tracking-wider">
                  Time Overdrawn
                </h4>
              </div>
              <p className="text-xs text-[#2c2a29] leading-relaxed font-serif italic">
                Your future habits, sleep, and work require more waking hours than exist in your remaining lifespan. Clear some space.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl font-light text-[#c8563f] tracking-tight">
                  ≈ {freeYears.toFixed(1)} years
                </span>
                <span className="text-[#595757] font-serif font-light text-sm italic">
                  of pure free time remaining
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#2c2a29]/5 font-mono text-[10px] sm:text-xs text-[#595757]">
                <div className="space-y-0.5">
                  <span className="text-[#73706c] block font-serif uppercase tracking-wider">DAYS</span>
                  <strong className="text-[#2c2a29]">{Math.floor(freeDays).toLocaleString()} days</strong>
                </div>
                <div className="space-y-0.5 border-l border-[#2c2a29]/10 pl-3">
                  <span className="text-[#73706c] block font-serif uppercase tracking-wider">WEEKS</span>
                  <strong className="text-[#2c2a29]">{Math.floor(freeWeeks).toLocaleString()} weeks</strong>
                </div>
                <div className="space-y-0.5 border-l border-[#2c2a29]/10 pl-3">
                  <span className="text-[#73706c] block font-serif uppercase tracking-wider">WAKING HOURS</span>
                  <strong className="text-[#2c2a29]">{Math.floor(freeHoursTotal).toLocaleString()} hrs</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Habit Warnings & Life Impact Insights */}
      {socialHoursPerDay > 0 && (
        <div className={`p-4 rounded-xl border transition-colors duration-300 ${
          socialHoursPerDay >= 3
            ? 'bg-[#b8483f]/5 border-[#b8483f]/20 text-[#2c2a29]'
            : 'bg-[#fbfaf7] border-[#2c2a29]/10 text-[#595757]'
        }`}>
          <div className="flex items-start gap-3">
            <Clock className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
              socialHoursPerDay >= 3 ? 'text-[#b8483f]' : 'text-[#8a7b6b]'
            }`} />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#73706c] block">
                Screen & Social Footprint
              </span>
              <p className="text-xs leading-relaxed font-serif text-[#2c2a29]">
                At <strong className="text-[#2c2a29]">{socialHoursPerDay.toFixed(1)} hrs/day</strong> on screen scrolling, you will spend exactly <strong className={`${
                  socialHoursPerDay >= 3 ? 'text-[#b8483f] font-semibold' : 'text-[#8a7b6b]'
                }`}>{socialYearsTotal.toFixed(1)} years</strong> of your remaining waking life on these platforms.
              </p>
              {socialHoursPerDay >= 3 && (
                <span className="text-[9.5px] font-serif text-[#b8483f] block uppercase tracking-wider pt-1">
                  ⚠ TIPPING POINT: Screens are quietly consuming your unallocated golden years.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
