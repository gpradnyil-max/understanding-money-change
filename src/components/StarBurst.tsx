"use client";

import { useEffect, useState } from "react";

interface StarBurstProps {
  show: boolean;
  message?: string;
}

export default function StarBurst({ show, message = "Well Done!" }: StarBurstProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      const pieces = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"][
          Math.floor(Math.random() * 6)
        ],
        delay: Math.random() * 0.5,
      }));
      setConfetti(pieces);
    } else {
      setConfetti([]);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 w-3 h-3 rounded-sm"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animation: `confetti-fall 2s ease-in ${piece.delay}s forwards`,
          }}
        />
      ))}
      <div className="animate-bounce-in bg-white/95 backdrop-blur-sm rounded-3xl px-12 py-8 shadow-2xl border-4 border-yellow-400">
        <div className="text-5xl mb-2 text-center">⭐</div>
        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500">
          {message}
        </div>
      </div>
    </div>
  );
}
