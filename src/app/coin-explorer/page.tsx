"use client";

import { useState } from "react";
import Link from "next/link";
import { COINS, formatMoney } from "@/lib/coins";
import type { Coin } from "@/lib/coins";
import CoinButton from "@/components/CoinButton";

export default function CoinExplorer() {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-110 transition-transform font-bold text-gray-600"
        >
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">
            🔍 Coin Explorer
          </h1>
          <p className="text-gray-500 font-medium">
            Tap a coin to learn about it!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Coin grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-blue-100 mb-8">
          <h2 className="text-lg font-bold text-blue-600 mb-6 text-center">
            Tap any coin!
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {COINS.map((coin) => (
              <div key={coin.name} className="flex flex-col items-center gap-2">
                <CoinButton
                  coin={coin}
                  onClick={setSelectedCoin}
                  size="lg"
                />
                <span className="text-xs font-bold text-gray-400">
                  {coin.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected coin detail */}
        {selectedCoin && (
          <div className="animate-bounce-in bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-yellow-200 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="animate-coin-spin">
                <CoinButton coin={selectedCoin} size="lg" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-3xl font-extrabold text-gray-800 mb-2">
                  {selectedCoin.name}
                </h3>
                <p className="text-xl text-gray-600 font-semibold mb-3">
                  {selectedCoin.description}
                </p>
                <div className="text-lg text-gray-500 font-medium space-y-1">
                  <p>
                    💰 Worth:{" "}
                    <span className="text-green-600 font-bold">
                      {formatMoney(selectedCoin.value)}
                    </span>
                  </p>
                  <p>
                    🔢 That&apos;s{" "}
                    <span className="text-blue-600 font-bold">
                      {selectedCoin.value} {selectedCoin.value === 1 ? "penny" : "pennies"}
                    </span>
                  </p>
                  {selectedCoin.value >= 100 && (
                    <p>
                      📝 £{selectedCoin.value / 100} = {selectedCoin.value}p
                    </p>
                  )}
                </div>

                {/* Equivalents */}
                <div className="mt-4 bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-bold text-blue-600 mb-2">
                    Same as:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {COINS.filter(
                      (c) =>
                        c.value < selectedCoin.value &&
                        selectedCoin.value % c.value === 0
                    ).map((c) => (
                      <span
                        key={c.name}
                        className="bg-white rounded-full px-3 py-1 text-sm font-bold text-gray-600 shadow-sm border"
                      >
                        {selectedCoin.value / c.value} × {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Did you know section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-purple-100">
          <h3 className="text-lg font-bold text-purple-600 mb-3">
            🧠 Did You Know?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 font-medium">
            <div className="bg-purple-50 rounded-xl p-3">
              🟤 The 1p and 2p coins are <strong>copper coloured</strong>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              ⚪ The 5p, 10p, 20p and 50p are <strong>silver coloured</strong>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              🟡 The £1 and £2 coins are <strong>gold coloured</strong>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              🔷 The 20p and 50p have <strong>7 sides</strong> (heptagonal)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
