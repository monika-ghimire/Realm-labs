// MainPage.tsx
import { useState, useEffect } from "react";
import Page from "../components/Chatbot";
import type { Message } from "../components/Chatbot";
import Lottie from "lottie-react";

import robotAnimation from "../assets/Robot Futuristic Ai.json";
import typingAnimation from "../assets/aiaia.json";
import digitalAnimation from "../assets/Digital.json";

const AI_ANIMATIONS = [robotAnimation, digitalAnimation]; // random moods after typing

export default function MainPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMood, setCurrentMood] = useState<unknown>(robotAnimation);
  const [isTyping, setIsTyping] = useState(false);

  // Random mood after bot finishes typing
  useEffect(() => {
  if (messages.length === 0) return;
  const last = messages[messages.length - 1];

  if (last.role === "bot" && !isTyping) {
    // defer to next tick to avoid synchronous setState warning
    setTimeout(() => {
      let nextMood;
      do {
        nextMood = AI_ANIMATIONS[Math.floor(Math.random() * AI_ANIMATIONS.length)];
      } while (nextMood === currentMood);
      setCurrentMood(nextMood);
    }, 0);
  }
}, [messages, isTyping, currentMood]);
  // Idle animation after 10 sec
  useEffect(() => {
    if (isTyping) return;
    const idleTimer = setTimeout(() => {
      setCurrentMood(digitalAnimation);
    }, 10000);
    return () => clearTimeout(idleTimer);
  }, [messages, isTyping]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950 p-4 grid grid-cols-3 gap-4 relative text-white">
      
      {/* Left Column: Chatbot */}
      <div className="col-span-1 relative flex flex-col items-center justify-center">
        <Page
          messages={messages}
          setMessages={setMessages}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
        />
      </div>

      {/* Right Column: Lottie animation panel */}
      <div className="col-span-2 flex items-center justify-center relative">
        <div className="w-full max-w-md">
          <Lottie
            animationData={isTyping ? typingAnimation : currentMood}
            loop
            autoplay
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}