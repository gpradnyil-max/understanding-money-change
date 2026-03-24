"use client";

import { useState } from "react";
import type { Coin } from "@/lib/coins";

interface CoinButtonProps {
  coin: Coin;
  onClick?: (coin: Coin) => void;
  showValue?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function CoinButton({
  coin,
  onClick,
  showValue = true,
  disabled = false,
  size = "md",
}: CoinButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: "w-12 h-12 text-xs",
    md: "w-16 h-16 text-sm",
    lg: "w-20 h-20 text-base",
  };

  const isCopper = coin.value <= 2;
  const isGold = coin.value >= 100;
  const isSilver = !isCopper && !isGold;

  const bgGradient = isCopper
    ? "from-amber-500 to-amber-700"
    : isGold
      ? "from-yellow-300 to-yellow-500"
      : "from-gray-200 to-gray-400";

  const textColor = isCopper
    ? "text-amber-900"
    : isGold
      ? "text-yellow-900"
      : "text-gray-700";

  // Two-tone ring for £2
  const ringClass =
    coin.value === 200
      ? "ring-4 ring-gray-400"
      : "";

  return (
    <button
      onClick={() => {
        if (!disabled && onClick) {
          setIsPressed(true);
          onClick(coin);
          setTimeout(() => setIsPressed(false), 300);
        }
      }}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${ringClass}
        bg-gradient-to-br ${bgGradient}
        ${textColor}
        rounded-full
        font-extrabold
        coin-shadow
        border-2 ${coin.borderColor}
        flex items-center justify-center
        select-none
        transition-all duration-150
        ${isPressed ? "animate-pop" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-110 active:scale-95"}
        ${isSilver && coin.value === 20 || coin.value === 50 ? "rounded-[40%]" : ""}
      `}
      title={coin.description}
    >
      {showValue ? coin.display : "?"}
    </button>
  );
}
