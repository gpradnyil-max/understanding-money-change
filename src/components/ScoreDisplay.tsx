"use client";

interface ScoreDisplayProps {
  score: number;
  total?: number;
  label?: string;
}

export default function ScoreDisplay({ score, total, label = "Score" }: ScoreDisplayProps) {
  const stars = Math.min(5, Math.floor(score / 2));

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border-2 border-purple-200 flex items-center gap-3">
      <div className="text-sm font-bold text-purple-600">{label}</div>
      <div className="text-2xl font-extrabold text-purple-700">
        {score}{total !== undefined && `/${total}`}
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`text-lg ${i < stars ? "opacity-100" : "opacity-20"}`}>
            ⭐
          </span>
        ))}
      </div>
    </div>
  );
}
