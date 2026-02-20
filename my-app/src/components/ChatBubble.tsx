// ChatBubble.tsx
import type { Role } from "./Chatbot"
import { motion } from "framer-motion";

interface ChatBubbleProps {
  role: Role;
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shadow-md shadow-cyan-500/20">
          🤖
        </div>
      )}

      <motion.div
        layout
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed backdrop-blur-xl border
          ${isUser
            ? "bg-cyan-500/20 border-cyan-400/30 shadow-lg shadow-cyan-500/20"
            : "bg-white/10 border-white/10 shadow-lg shadow-white/5"}`}
      >
        {content}
      </motion.div>
    </div>
  );
}