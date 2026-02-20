// NumberGuessGame.tsx
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatBubble from "../components/ChatBubble";
import TypingIndicator from "../components/TypingIndicator";

const uid = () => crypto.randomUUID();

export default function NumberGuessGame() {
  const [messages, setMessages] = useState<{ id: string; role: "user" | "bot"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [secretNumber, setSecretNumber] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll smoothly when new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // Initialize number
  useEffect(() => {
    const number = Math.floor(Math.random() * 100) + 1;
    setSecretNumber(number);
    setMessages([{ id: uid(), role: "bot", content: "🎮 Welcome to Number Guess! Guess a number between 1 and 100." }]);
  }, []);

  const typeBotMessage = async (text: string) => {
    setIsTyping(true);
    const id = uid();
    setMessages((m) => [...m, { id, role: "bot", content: "" }]);
    for (let i = 0; i < text.length; i++) {
      await new Promise((r) => setTimeout(r, 18));
      setMessages((m) =>
        m.map((msg) => (msg.id === id ? { ...msg, content: msg.content + text[i] } : msg))
      );
    }
    setIsTyping(false);
  };

  const handleGuess = (content: string) => {
    if (!secretNumber) return;
    const guess = parseInt(content);
    if (isNaN(guess)) {
      setMessages((m) => [...m, { id: uid(), role: "bot", content: "Please enter a valid number!" }]);
      return;
    }
    setMessages((m) => [...m, { id: uid(), role: "user", content }]);

    if (guess === secretNumber) {
      setTimeout(() => {
        typeBotMessage(`🎉 Correct! The number was ${secretNumber}. Starting a new game...`);
        setSecretNumber(Math.floor(Math.random() * 100) + 1);
      }, 300);
    } else if (guess < secretNumber) {
      setTimeout(() => typeBotMessage("⬆️ Too low! Try again."), 300);
    } else {
      setTimeout(() => typeBotMessage("⬇️ Too high! Try again."), 300);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;
    handleGuess(input);
    setInput("");
  };

  return (
    <div className="relative w-full h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto hide-scroll-bar p-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ChatBubble role={m.role} content={m.content} />
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              🤖
            </div>
            <TypingIndicator />
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Guess a number..."
          className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/40"
        />
        <button
          onClick={sendMessage}
          className="rounded-2xl px-4 py-3 bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30 transition shadow-lg shadow-cyan-500/20"
        >
          ➤
        </button>
      </div>
    </div>
  );
}