"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { COINS, formatMoney } from "@/lib/coins";
import type { Coin } from "@/lib/coins";
import CoinButton from "@/components/CoinButton";
import StarBurst from "@/components/StarBurst";
import ScoreDisplay from "@/components/ScoreDisplay";

interface ShopItem {
  name: string;
  emoji: string;
  price: number; // in pence
}

const SHOP_ITEMS: ShopItem[] = [
  { name: "Apple", emoji: "🍎", price: 30 },
  { name: "Banana", emoji: "🍌", price: 25 },
  { name: "Cookie", emoji: "🍪", price: 45 },
  { name: "Juice", emoji: "🧃", price: 60 },
  { name: "Lolly", emoji: "🍭", price: 15 },
  { name: "Cake", emoji: "🧁", price: 85 },
  { name: "Ice Cream", emoji: "🍦", price: 75 },
  { name: "Crisps", emoji: "🥨", price: 40 },
  { name: "Sandwich", emoji: "🥪", price: 120 },
  { name: "Teddy Bear", emoji: "🧸", price: 150 },
  { name: "Sticker Book", emoji: "📒", price: 99 },
  { name: "Bouncy Ball", emoji: "🔴", price: 35 },
  { name: "Pencil", emoji: "✏️", price: 20 },
  { name: "Rubber Duck", emoji: "🦆", price: 110 },
  { name: "Toy Car", emoji: "🚗", price: 165 },
  { name: "Puzzle", emoji: "🧩", price: 137 },
  { name: "Notebook", emoji: "📓", price: 78 },
  { name: "Yo-yo", emoji: "🪀", price: 55 },
  { name: "Balloon", emoji: "🎈", price: 12 },
  { name: "Comic Book", emoji: "📖", price: 185 },
  { name: "Toy Robot", emoji: "🤖", price: 195 },
  { name: "Magnet", emoji: "🧲", price: 67 },
];

function getPaymentAmount(price: number): number {
  // Single coin payments
  const singleOptions = COINS.map((c) => c.value).filter((v) => v > price);
  // Combined payments for trickier change (e.g. £2+50p, £1+£1, £2+£1)
  const comboOptions = [250, 300, 350, 400].filter((v) => v > price && v <= 400);
  const allOptions = [...singleOptions, ...comboOptions];
  if (allOptions.length === 0) return 200;
  return allOptions[Math.floor(Math.random() * allOptions.length)];
}

function generateRound(): { item: ShopItem; payment: number } {
  const item = SHOP_ITEMS[Math.floor(Math.random() * SHOP_ITEMS.length)];
  const payment = getPaymentAmount(item.price);
  return { item, payment };
}

export default function Shop() {
  const [round, setRound] = useState(() => generateRound());
  const [selectedCoins, setSelectedCoins] = useState<Array<{ id: number; coin: Coin }>>([]);
  const [nextId, setNextId] = useState(0);
  const [showStar, setShowStar] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "hint">("hint");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const correctChange = round.payment - round.item.price;
  const currentTotal = selectedCoins.reduce((sum, sc) => sum + sc.coin.value, 0);

  const handleAddCoin = (coin: Coin) => {
    setSelectedCoins((prev) => [...prev, { id: nextId, coin }]);
    setNextId((n) => n + 1);
    setFeedback(null);
  };

  const handleRemoveLast = () => {
    setSelectedCoins((prev) => prev.slice(0, -1));
    setFeedback(null);
  };

  const handleCheck = useCallback(() => {
    if (currentTotal === correctChange) {
      setFeedback("Brilliant! That's the right change! 🎉");
      setFeedbackType("success");
      setScore((s) => s + 1);
      setAttempts((a) => a + 1);
      setShowStar(true);
      setTimeout(() => setShowStar(false), 2500);
    } else if (currentTotal < correctChange) {
      setFeedback(
        `Almost! You've given ${formatMoney(currentTotal)} but the change should be ${formatMoney(correctChange)}. Try adding more coins!`
      );
      setFeedbackType("error");
    } else {
      setFeedback(
        `Oops! You've given ${formatMoney(currentTotal)} but the change should be ${formatMoney(correctChange)}. That's a bit too much!`
      );
      setFeedbackType("error");
    }
  }, [currentTotal, correctChange]);

  const handleNext = () => {
    setRound(generateRound());
    setSelectedCoins([]);
    setFeedback(null);
    setNextId(0);
  };

  const handleHint = () => {
    setFeedback(
      `💡 The item costs ${formatMoney(round.item.price)} and you paid with ${formatMoney(round.payment)}. The change is ${formatMoney(round.payment)} - ${formatMoney(round.item.price)} = ${formatMoney(correctChange)}`
    );
    setFeedbackType("hint");
  };

  const handleSkip = () => {
    setAttempts((a) => a + 1);
    handleNext();
  };

  return (
    <div className="min-h-screen p-6">
      <StarBurst show={showStar} message="Correct Change!" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-110 transition-transform font-bold text-gray-600"
          >
            ←
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">
              🛒 Shop & Change
            </h1>
            <p className="text-gray-500 font-medium">
              Work out the correct change!
            </p>
          </div>
        </div>
        {attempts > 0 && <ScoreDisplay score={score} total={attempts} />}
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Shopping scenario */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-green-100 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-3">{round.item.emoji}</div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
              {round.item.name}
            </h2>
            <div className="text-3xl font-extrabold text-green-600 mb-4">
              {formatMoney(round.item.price)}
            </div>

            <div className="bg-green-50 rounded-2xl p-4 inline-block">
              <p className="text-gray-600 font-medium text-lg">
                You pay with{" "}
                <span className="font-extrabold text-yellow-600 text-2xl">
                  {formatMoney(round.payment)}
                </span>
              </p>
              <p className="text-gray-500 font-medium mt-1">
                How much change do you get back?
              </p>
            </div>
          </div>
        </div>

        {/* Change area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-yellow-100 mb-6">
          <h3 className="text-lg font-bold text-yellow-600 mb-3 text-center">
            Your change: {formatMoney(currentTotal)}
          </h3>

          <div className="min-h-[60px] bg-yellow-50 rounded-2xl p-4 flex flex-wrap gap-2 justify-center items-center border-2 border-dashed border-yellow-200 mb-4">
            {selectedCoins.length === 0 ? (
              <p className="text-yellow-300 font-medium">
                Pick coins for the change...
              </p>
            ) : (
              selectedCoins.map((sc) => (
                <div key={sc.id} className="animate-bounce-in">
                  <CoinButton coin={sc.coin} size="sm" />
                </div>
              ))
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={handleRemoveLast}
              disabled={selectedCoins.length === 0}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold px-4 py-2 rounded-full text-sm disabled:opacity-40 transition-colors"
            >
              Undo ↩
            </button>
            <button
              onClick={handleCheck}
              disabled={selectedCoins.length === 0}
              className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold px-6 py-2 rounded-full text-sm disabled:opacity-40 transition-colors shadow-md"
            >
              Check ✓
            </button>
            <button
              onClick={handleHint}
              className="bg-blue-100 hover:bg-blue-200 text-blue-600 font-bold px-4 py-2 rounded-full text-sm transition-colors"
            >
              Hint 💡
            </button>
            <button
              onClick={handleSkip}
              className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold px-4 py-2 rounded-full text-sm transition-colors"
            >
              Skip →
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mt-4 rounded-2xl p-4 text-center font-semibold animate-bounce-in ${
                feedbackType === "success"
                  ? "bg-green-50 text-green-700 border-2 border-green-200"
                  : feedbackType === "error"
                    ? "bg-red-50 text-red-600 border-2 border-red-200"
                    : "bg-blue-50 text-blue-600 border-2 border-blue-200"
              }`}
            >
              {feedback}
              {feedbackType === "success" && (
                <button
                  onClick={handleNext}
                  className="block mx-auto mt-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-6 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition-shadow"
                >
                  Next Item →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Coin selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-blue-100">
          <h2 className="text-lg font-bold text-blue-600 mb-4 text-center">
            Pick coins for the change
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {COINS.map((coin) => (
              <div key={coin.name} className="flex flex-col items-center gap-1">
                <CoinButton coin={coin} onClick={handleAddCoin} size="md" />
                <span className="text-xs font-bold text-gray-400">
                  {coin.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
