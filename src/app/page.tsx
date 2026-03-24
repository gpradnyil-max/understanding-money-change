"use client";

import Link from "next/link";

const games = [
  {
    title: "Coin Explorer",
    description: "Learn all the coins and what they're worth!",
    emoji: "🔍",
    href: "/coin-explorer",
    gradient: "from-blue-400 to-blue-600",
    shadowColor: "shadow-blue-200",
    delay: "0s",
  },
  {
    title: "Piggy Bank",
    description: "Add coins and count your money!",
    emoji: "🐷",
    href: "/piggy-bank",
    gradient: "from-pink-400 to-pink-600",
    shadowColor: "shadow-pink-200",
    delay: "0.1s",
  },
  {
    title: "Shop & Change",
    description: "Buy things and work out the change!",
    emoji: "🛒",
    href: "/shop",
    gradient: "from-green-400 to-green-600",
    shadowColor: "shadow-green-200",
    delay: "0.2s",
  },
  {
    title: "Quiz Challenge",
    description: "Test what you've learned and win stars!",
    emoji: "🏆",
    href: "/quiz",
    gradient: "from-purple-400 to-purple-600",
    shadowColor: "shadow-purple-200",
    delay: "0.3s",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="text-center mb-10 pt-6">
        <div className="text-6xl mb-4 animate-float">💰</div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 mb-3">
          Money Magic!
        </h1>
        <p className="text-xl text-gray-600 font-semibold">
          Learn all about pounds and pence
        </p>
        <div className="flex justify-center gap-2 mt-3">
          {["🪙", "💷", "🪙", "💷", "🪙"].map((e, i) => (
            <span
              key={i}
              className="text-2xl animate-float"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>

      {/* Game Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {games.map((game) => (
          <Link key={game.href} href={game.href}>
            <div
              className={`card-hover bg-white rounded-3xl p-8 shadow-xl ${game.shadowColor} border-2 border-white/50 cursor-pointer`}
              style={{ animationDelay: game.delay }}
            >
              <div className="text-5xl mb-4">{game.emoji}</div>
              <h2
                className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${game.gradient} mb-2`}
              >
                {game.title}
              </h2>
              <p className="text-gray-500 font-medium">{game.description}</p>
              <div
                className={`mt-4 inline-block bg-gradient-to-r ${game.gradient} text-white font-bold px-5 py-2 rounded-full text-sm shadow-md`}
              >
                Let&apos;s Play! →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Fun fact footer */}
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
          <div className="text-2xl mb-2">💡</div>
          <p className="text-gray-600 font-semibold">
            <span className="text-yellow-600">Fun Fact:</span> There are 100
            pence in 1 pound! So £1 = 100p
          </p>
        </div>
      </div>
    </div>
  );
}
