import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Leaf } from 'lucide-react';

interface LandingViewProps {
  onBegin: () => void;
}

const INTRO_PROMPTS = [
  'Is there a dream you quietly carry?',
  'How many hours remain to live it?',
];

export default function LandingView({ onBegin }: LandingViewProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2800);
    // +1000ms vs t1's spacing: the 2nd prompt only starts entering after the
    // 1st finishes its 1s exit, so it needs the extra time for an equal hold.
    const t2 = setTimeout(() => setPhase(2), 6600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#fbfaf7] text-[#2c2a29] overflow-hidden px-6">
      {/* Background Zen Enso (circle of life and emptiness) representing natural completeness */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vmin] h-[70vmin] rounded-full border border-[rgba(44,42,41,0.04)] pointer-events-none flex items-center justify-center">
        <div className="w-[50vmin] h-[50vmin] rounded-full border border-[rgba(44,42,41,0.02)]" />
      </div>

      {/* Gentle water ripple glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vmax] h-[90vmax] bg-radial from-[#ebe6db]/30 via-transparent to-transparent pointer-events-none rounded-full blur-[120px]" />
      
      {/* Minimal botanical top anchor */}
      <motion.div
        initial={{ opacity: 0, y: -20, rotate: -15 }}
        animate={{ opacity: 0.35, y: 0, rotate: 0 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute top-16"
      >
        <Leaf className="w-10 h-10 text-[#6c7b64] stroke-[1]" />
      </motion.div>

      {/* Intro prompts fade in/out, then the main content enters — mode="wait"
          ensures each element fully exits before the next mounts. */}
      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.75, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="z-10 font-serif italic text-xl sm:text-2xl md:text-3xl text-[#595757] font-light tracking-wide max-w-xl text-center px-4 select-none"
          >
            {INTRO_PROMPTS[phase]}
          </motion.p>
        ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="z-10 max-w-2xl text-center space-y-10 select-none"
        >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1.5 }}
            className="text-xs uppercase tracking-[0.3em] text-[#595757] font-serif"
          >
            メメント・モリ
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.95, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-extralight tracking-[0.22em] text-[#2c2a29]"
            id="landing-title"
          >
            Memento Mori
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ delay: 1.2, duration: 2 }}
            className="font-serif italic text-sm sm:text-base md:text-lg text-[#595757] font-light tracking-wide max-w-md mx-auto"
          >
            “Mono no aware” — beautiful awareness of transience.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 1.5, type: "spring", stiffness: 35 }}
          className="pt-4"
        >
          <button
            onClick={onBegin}
            className="relative px-9 py-4 rounded-lg font-sans text-xs font-light uppercase tracking-[0.25em] border border-[#2c2a29]/10 bg-[#fbfaf7] hover:bg-[#2c2a29] text-[#2c2a29] hover:text-[#fbfaf7] group transition-all duration-700 cursor-pointer"
            id="btn-landing-begin"
          >
            <span className="relative z-10 flex items-center gap-2.5 justify-center">
              Step Inside
            </span>
          </button>
        </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle bottom accent representing zen dry garden raking */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ delay: 3.5, duration: 1.5 }}
        className="absolute bottom-10 flex items-center gap-6"
      >
        <div className="w-16 h-px bg-[#2c2a29]" />
        <span className="text-[9px] uppercase tracking-[0.4em] font-sans font-light text-[#2c2a29]">
          Wabi-Sabi Flow
        </span>
        <div className="w-16 h-px bg-[#2c2a29]" />
      </motion.div>
    </div>
  );
}
