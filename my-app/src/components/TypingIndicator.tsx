// TypingIndicator.tsx
import { motion } from "framer-motion";

export default function TypingIndicator() {
  const dot = {
    hidden: { opacity: 0.3, y: 0 },
    visible: { opacity: 1, y: -3 },
  };

  return (
    <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl shadow-lg shadow-white/5 flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          variants={dot}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.15,
          }}
          className="h-2 w-2 rounded-full bg-cyan-400"
        />
      ))}
    </div>
  );
}