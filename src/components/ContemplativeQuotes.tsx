import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw } from 'lucide-react';

const QUOTES = [
  { text: "The moon goes through the clear water, but the water has no mind.", textJa: "明月に心なし 清水に影あり", author: "Ryōkan" },
  { text: "Life is like a dewdrop on the tip of a leaf, shimmering and transient.", textJa: "露の世は 露の世ながら 露の世に", author: "Kobayashi Issa" },
  { text: "No flower is so beautiful as the one which is allowed to follow its own natural seasonal course.", author: "Sen no Rikyū" },
  { text: "Do not seek to follow in the footsteps of the wise. Seek what they sought.", author: "Matsuo Bashō" },
  { text: "The most beautiful things in the world are those that are incomplete, impermanent, and imperfect.", author: "Kakuzō Okakura, The Book of Tea" },
  { text: "To study the Way is to study the self. To study the self is to forget the self.", author: "Eihei Dōgen" },
  { text: "If we should never fade, but always exist, how many things would lose their power to move us?", author: "Yoshida Kenkō, Tsurezuregusa" },
  { text: "In the raw space of silence, one gains the clarity to appreciate the fleeting.", author: "Zen Maxim" }
];

export default function ContemplativeQuotes() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * QUOTES.length));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 12000); // Gentle 12 second rotation
    return () => clearInterval(interval);
  }, []);

  const nextQuote = () => {
    setIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const currentQuote = QUOTES[index];

  return (
    <div className="relative py-6 px-8 border-t border-[#2c2a29]/10 bg-[#fbfaf7]/40 text-center select-none overflow-hidden rounded-b-2xl">
      <div className="absolute inset-0 bg-radial from-[#d2b48c]/5 to-transparent pointer-events-none" />
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="relative z-10 max-w-lg mx-auto"
        >
          {currentQuote.textJa && (
            <p className="text-[10px] font-serif tracking-[0.25em] text-[#73706c]/70 uppercase mb-2">
              {currentQuote.textJa}
            </p>
          )}
          <p className="font-serif italic text-base sm:text-lg text-[#2c2a29] leading-relaxed tracking-wide">
            “{currentQuote.text}”
          </p>
          <div className="mt-3.5 flex items-center justify-center gap-3">
            <span className="w-1 h-1 rounded-full bg-[#c8563f]/30" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#73706c] font-sans font-medium">
              {currentQuote.author}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#c8563f]/30" />
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={nextQuote}
        className="absolute bottom-2 right-4 text-[#73706c]/60 hover:text-[#2c2a29] transition-colors duration-300 group flex items-center gap-1.5"
        title="Contemplate another quote"
        id="btn-next-quote"
      >
        <span className="text-[9px] uppercase font-serif tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Reflect
        </span>
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
