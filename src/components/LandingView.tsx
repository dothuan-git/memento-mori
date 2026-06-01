import { motion } from 'motion/react';
import { Compass, Leaf } from 'lucide-react';

interface LandingViewProps {
  onBegin: () => void;
}

export default function LandingView({ onBegin }: LandingViewProps) {
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

      {/* Main Calligraphy-spirited Content */}
      <div className="z-10 max-w-2xl text-center space-y-10 select-none">
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
            initial={{ opacity: 0, letterSpacing: "0.15em", y: 15 }}
            animate={{ opacity: 0.95, letterSpacing: "0.22em", y: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2, duration: 2 }}
          className="text-xs font-sans font-light tracking-[0.18em] uppercase text-[#73706c] max-w-sm mx-auto leading-relaxed border-t border-[rgba(44,42,41,0.08)] pt-6"
        >
          An interactive, pristine life tapestry to guide you toward deliberate days and quiet focus.
        </motion.p>

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
      </div>

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
