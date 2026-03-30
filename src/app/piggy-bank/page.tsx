"use client";

import { useState } from "react";
import Link from "next/link";
import { COINS, formatMoney } from "@/lib/coins";
import type { Coin } from "@/lib/coins";
import CoinButton from "@/components/CoinButton";
import StarBurst from "@/components/StarBurst";

interface AddedCoin {
  id: number;
  coin: Coin;
}

export default function PiggyBank() {
  const [addedCoins, setAddedCoins] = useState<AddedCoin[]>([]);
  const [showStar, setShowStar] = useState(false);
  const [targetAmount] = useState(() => {
    const targets = [50, 75, 100, 125, 150, 200, 250, 300, 175, 225, 350, 99, 137];
    return targets[Math.floor(Math.random() * targets.length)];
  });
  const [wiggle, setWiggle] = useState(false);
  const [nextId, setNextId] = useState(0);

  const total = addedCoins.reduce((sum, ac) => sum + ac.coin.value, 0);
  const reachedTarget = total >= targetAmount;

  const handleAddCoin = (coin: Coin) => {
    setAddedCoins((prev) => [...prev, { id: nextId, coin }]);
    setNextId((n) => n + 1);
    setWiggle(true);
    setTimeout(() => setWiggle(false), 500);

    if (total + coin.value >= targetAmount && !reachedTarget) {
      setTimeout(() => {
        setShowStar(true);
        setTimeout(() => setShowStar(false), 2500);
      }, 300);
    }
  };

  const handleRemoveLast = () => {
    setAddedCoins((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    setAddedCoins([]);
    setShowStar(false);
  };

  return (
    <div className="min-h-screen p-6">
      <StarBurst show={showStar} message="Target Reached!" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-110 transition-transform font-bold text-gray-600"
        >
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-700">
            🐷 Piggy Bank
          </h1>
          <p className="text-gray-500 font-medium">
            Add coins and count your money!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Target */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-pink-100 mb-6 text-center">
          <p className="text-gray-500 font-medium">
            🎯 Try to reach:{" "}
            <span className="text-2xl font-extrabold text-pink-600">
              {formatMoney(targetAmount)}
            </span>
          </p>
          <div className="mt-3 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                reachedTarget
                  ? "bg-gradient-to-r from-green-400 to-green-600"
                  : "bg-gradient-to-r from-pink-400 to-pink-600"
              }`}
              style={{
                width: `${Math.min(100, (total / targetAmount) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Piggy Bank Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-pink-100 mb-6">
          <div className="text-center mb-4">
            <div
              className={`text-7xl inline-block ${wiggle ? "animate-wiggle" : ""}`}
            >
              🐷
            </div>
            <div className="text-4xl font-extrabold text-pink-600 mt-2">
              {formatMoney(total)}
            </div>
          </div>

          {/* Coins inside piggy bank */}
          <div className="min-h-[80px] bg-pink-50 rounded-2xl p-4 flex flex-wrap gap-2 justify-center items-center border-2 border-dashed border-pink-200">
            {addedCoins.length === 0 ? (
              <p className="text-pink-300 font-medium">
                Tap coins below to add them!
              </p>
            ) : (
              addedCoins.map((ac) => (
                <div key={ac.id} className="animate-bounce-in">
                  <CoinButton coin={ac.coin} size="sm" />
                </div>
              ))
            )}
          </div>

          {/* Breakdown */}
          {addedCoins.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {COINS.filter((c) => addedCoins.some((ac) => ac.coin.name === c.name)).map(
                (coin) => {
                  const count = addedCoins.filter(
                    (ac) => ac.coin.name === coin.name
                  ).length;
                  return (
                    <span
                      key={coin.name}
                      className="bg-white rounded-full px-3 py-1 text-sm font-bold text-gray-600 shadow border"
                    >
                      {count} × {coin.name} = {formatMoney(count * coin.value)}
                    </span>
                  );
                }
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={handleRemoveLast}
              disabled={addedCoins.length === 0}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold px-4 py-2 rounded-full text-sm disabled:opacity-40 transition-colors"
            >
              Undo ↩
            </button>
            <button
              onClick={handleReset}
              disabled={addedCoins.length === 0}
              className="bg-red-100 hover:bg-red-200 text-red-600 font-bold px-4 py-2 rounded-full text-sm disabled:opacity-40 transition-colors"
            >
              Empty 🗑️
            </button>
          </div>
        </div>

        {/* Coin selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-blue-100">
          <h2 className="text-lg font-bold text-blue-600 mb-4 text-center">
            Tap coins to add them to your piggy bank!
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
