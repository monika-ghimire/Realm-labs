// Page.tsx
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatBubble from "../components/ChatBubble";
import TypingIndicator from "../components/TypingIndicator";

export type Role = "user" | "bot";

export interface Message {
  id: string;
  role: Role;
  content: string;
}

interface PageProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}
const PREDEFINED_QA: { q: string; a: string }[] = [
  { q: "What can you help me with?", a: "I can help you design UI, write code, debug issues, and brainstorm ideas." },
  { q: "How do I structure a React app?", a: "Break it into reusable components, colocate logic, and keep state close to where it's used." },
  { q: "What is glassmorphism?", a: "A UI style using translucent surfaces, blur, subtle borders, and soft glows for depth." },
  { q: "How do I improve UX?", a: "Focus on clarity, feedback, accessibility, and smooth micro-interactions." },
  { q: "Best practices for TypeScript?", a: "Use strict types, define interfaces for data, and avoid any whenever possible." },
  { q: "How to animate UI smoothly?", a: "Use Framer Motion for layout and presence animations with easing and staggered transitions." },
  { q: "How to manage forms in React?", a: "Use controlled inputs, validate early, and provide instant feedback." },
  { q: "What makes a UI feel premium?", a: "Consistent spacing, soft shadows, subtle glows, smooth animations, and thoughtful colors." },
];

const uid = () => crypto.randomUUID();

export default function Page({ messages, setMessages, isTyping, setIsTyping }: PageProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

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

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;
    setMessages((m) => [...m, { id: uid(), role: "user", content }]);
    setInput("");

    const found = PREDEFINED_QA.find((x) => x.q === content);
    const reply =
      found?.a ||
      "That’s a great question. I can help you break it down and find a solid approach.";

    await new Promise((r) => setTimeout(r, 500));
    await typeBotMessage(reply);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950 text-white flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-[90vh] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            🤖
          </div>
          <div className="font-semibold tracking-wide">Realm AI</div>
          {isTyping && <span className="ml-auto text-xs text-cyan-400">AI is typing...</span>}
        </div>

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

        <div className="p-3 border-t border-white/10 space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {PREDEFINED_QA.map((q) => (
              <button
                key={q.q}
                disabled={isTyping}
                onClick={() => sendMessage(q.q)}
                className="text-xs rounded-xl px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition disabled:opacity-40"
              >
                {q.q}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Type your message..."
              className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isTyping}
              className="rounded-2xl px-4 py-3 bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30 transition disabled:opacity-40 shadow-lg shadow-cyan-500/20"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}