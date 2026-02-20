// MainPage.tsx
import { useState, useEffect } from "react";
import Page from "../components/Chatbot";
import type { Message } from "../components/Chatbot";
import Lottie from "lottie-react";

import robotAnimation from "../assets/Robot Futuristic Ai.json";
import typingAnimation from "../assets/aiaia.json";
import digitalAnimation from "../assets/Digital.json";

const AI_ANIMATIONS = [robotAnimation, digitalAnimation]; // animations to cycle

export default function MainPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMood, setCurrentMood] = useState<unknown>(robotAnimation);
  const [isTyping, setIsTyping] = useState(false);

 // Cycle animations every 10 sec (idle)
useEffect(() => {
  if (isTyping) return; // don't cycle while typing

  const interval = setInterval(() => {
    setCurrentMood((prev: unknown) => {
      let next: unknown;
      do {
        next = AI_ANIMATIONS[Math.floor(Math.random() * AI_ANIMATIONS.length)];
      } while (next === prev);
      return next;
    });
  }, 10000); // 10 seconds

  return () => clearInterval(interval);
}, [isTyping]);

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