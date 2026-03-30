"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { COINS, formatMoney } from "@/lib/coins";
import StarBurst from "@/components/StarBurst";
import ScoreDisplay from "@/components/ScoreDisplay";

interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  emoji: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(): Question[] {
  const questions: Question[] = [];

  // Type 1: What is this coin worth?
  const coin1 = COINS[Math.floor(Math.random() * COINS.length)];
  const wrongValues = COINS.filter((c) => c.value !== coin1.value)
    .map((c) => formatMoney(c.value));
  const shuffledWrong1 = shuffle(wrongValues).slice(0, 3);
  const options1 = shuffle([formatMoney(coin1.value), ...shuffledWrong1]);
  questions.push({
    text: `How much is a ${coin1.name} coin worth?`,
    options: options1,
    correctIndex: options1.indexOf(formatMoney(coin1.value)),
    emoji: "🪙",
  });

  // Type 2: Adding two coins
  const c1 = COINS[Math.floor(Math.random() * 6)];
  const c2 = COINS[Math.floor(Math.random() * 6)];
  const sum = c1.value + c2.value;
  const correctAnswer2 = formatMoney(sum);
  const wrong2 = [
    formatMoney(sum + 5),
    formatMoney(Math.max(1, sum - 5)),
    formatMoney(sum + 10),
  ];
  const options2 = shuffle([correctAnswer2, ...wrong2]);
  questions.push({
    text: `${c1.name} + ${c2.name} = ?`,
    options: options2,
    correctIndex: options2.indexOf(correctAnswer2),
    emoji: "➕",
  });

  // Type 3: How many pennies in X?
  const coin3 = COINS.filter((c) => c.value >= 5)[
    Math.floor(Math.random() * COINS.filter((c) => c.value >= 5).length)
  ];
  const correctAnswer3 = `${coin3.value}p`;
  const wrong3 = [
    `${coin3.value + 10}p`,
    `${Math.max(1, coin3.value - 10)}p`,
    `${coin3.value * 2}p`,
  ];
  const options3 = shuffle([correctAnswer3, ...wrong3]);
  questions.push({
    text: `How many pennies are in ${coin3.name}?`,
    options: options3,
    correctIndex: options3.indexOf(correctAnswer3),
    emoji: "🔢",
  });

  // Type 4: Making change
  const prices = [20, 30, 35, 40, 50, 60, 75, 80];
  const price = prices[Math.floor(Math.random() * prices.length)];
  const payments = COINS.filter((c) => c.value > price);
  const payment = payments[Math.floor(Math.random() * payments.length)];
  const change = payment.value - price;
  const correctAnswer4 = formatMoney(change);
  const wrong4 = [
    formatMoney(change + 5),
    formatMoney(Math.max(1, change - 5)),
    formatMoney(change + 10),
  ];
  const options4 = shuffle([correctAnswer4, ...wrong4]);
  questions.push({
    text: `An item costs ${formatMoney(price)}. You pay with ${payment.name}. What's the change?`,
    options: options4,
    correctIndex: options4.indexOf(correctAnswer4),
    emoji: "🛒",
  });

  // Type 5: Which is more?
  const [coinA, coinB] = shuffle([...COINS]).slice(0, 2);
  const moreExpensive = coinA.value > coinB.value ? coinA : coinB;
  const sameValue = coinA.value === coinB.value;
  const correctAnswer5 = sameValue ? "They're the same" : moreExpensive.name;
  const options5 = shuffle([coinA.name, coinB.name, "They're the same"]);
  questions.push({
    text: `Which is worth more: ${coinA.name} or ${coinB.name}?`,
    options: options5,
    correctIndex: options5.indexOf(correctAnswer5),
    emoji: "⚖️",
  });

  // Type 6: Equivalence
  const coin6 = COINS.filter((c) => c.value >= 10)[
    Math.floor(Math.random() * COINS.filter((c) => c.value >= 10).length)
  ];
  const smallerCoin = COINS.filter(
    (c) => c.value < coin6.value && coin6.value % c.value === 0
  );
  if (smallerCoin.length > 0) {
    const sc = smallerCoin[Math.floor(Math.random() * smallerCoin.length)];
    const count = coin6.value / sc.value;
    const correctAnswer6 = `${count}`;
    const wrong6 = [
      `${count + 1}`,
      `${Math.max(1, count - 1)}`,
      `${count + 2}`,
    ];
    const options6 = shuffle([correctAnswer6, ...wrong6]);
    questions.push({
      text: `How many ${sc.name} coins make ${coin6.name}?`,
      options: options6,
      correctIndex: options6.indexOf(correctAnswer6),
      emoji: "🧮",
    });
  }

  // Type 7: Adding THREE coins (harder)
  const t7coins = shuffle([...COINS].filter(c => c.value <= 100)).slice(0, 3);
  const sum7 = t7coins[0].value + t7coins[1].value + t7coins[2].value;
  const correctAnswer7 = formatMoney(sum7);
  const wrong7 = [
    formatMoney(sum7 + 10),
    formatMoney(Math.max(1, sum7 - 10)),
    formatMoney(sum7 + 20),
  ];
  const options7 = shuffle([correctAnswer7, ...wrong7]);
  questions.push({
    text: `${t7coins[0].name} + ${t7coins[1].name} + ${t7coins[2].name} = ?`,
    options: options7,
    correctIndex: options7.indexOf(correctAnswer7),
    emoji: "🔥",
  });

  // Type 8: Buying multiples (word problem)
  const itemNames = [
    { name: "apple", emoji: "🍎", price: 20 },
    { name: "banana", emoji: "🍌", price: 15 },
    { name: "sweet", emoji: "🍬", price: 10 },
    { name: "sticker", emoji: "⭐", price: 25 },
    { name: "pencil", emoji: "✏️", price: 30 },
  ];
  const item8 = itemNames[Math.floor(Math.random() * itemNames.length)];
  const qty8 = Math.floor(Math.random() * 4) + 2; // 2 to 5
  const total8 = item8.price * qty8;
  const correctAnswer8 = formatMoney(total8);
  const wrong8 = [
    formatMoney(total8 + item8.price),
    formatMoney(Math.max(1, total8 - item8.price)),
    formatMoney(item8.price),
  ];
  const options8 = shuffle([correctAnswer8, ...wrong8]);
  questions.push({
    text: `${item8.emoji} One ${item8.name} costs ${formatMoney(item8.price)}. How much do ${qty8} cost?`,
    options: options8,
    correctIndex: options8.indexOf(correctAnswer8),
    emoji: "🧠",
  });

  // Type 9: Change from buying TWO items
  const shopItems9 = [
    { name: "lolly", price: 15 },
    { name: "apple", price: 30 },
    { name: "pencil", price: 20 },
    { name: "cookie", price: 25 },
    { name: "sticker", price: 35 },
  ];
  const [itemA9, itemB9] = shuffle(shopItems9).slice(0, 2);
  const totalCost9 = itemA9.price + itemB9.price;
  const payCoins9 = COINS.filter((c) => c.value > totalCost9);
  if (payCoins9.length > 0) {
    const payCoin9 = payCoins9[Math.floor(Math.random() * payCoins9.length)];
    const change9 = payCoin9.value - totalCost9;
    const correctAnswer9 = formatMoney(change9);
    const wrong9 = [
      formatMoney(change9 + 5),
      formatMoney(Math.max(1, change9 - 5)),
      formatMoney(payCoin9.value - itemA9.price),
    ];
    const options9 = shuffle([correctAnswer9, ...wrong9]);
    questions.push({
      text: `You buy a ${itemA9.name} (${formatMoney(itemA9.price)}) and a ${itemB9.name} (${formatMoney(itemB9.price)}). You pay with ${payCoin9.name}. What's the change?`,
      options: options9,
      correctIndex: options9.indexOf(correctAnswer9),
      emoji: "🛍️",
    });
  }

  // Type 10: Subtraction with money
  const bigCoin10 = COINS.filter(c => c.value >= 50)[
    Math.floor(Math.random() * COINS.filter(c => c.value >= 50).length)
  ];
  const smallCoin10 = COINS.filter(c => c.value < bigCoin10.value && c.value >= 5)[
    Math.floor(Math.random() * COINS.filter(c => c.value < bigCoin10.value && c.value >= 5).length)
  ];
  if (smallCoin10) {
    const diff10 = bigCoin10.value - smallCoin10.value;
    const correctAnswer10 = formatMoney(diff10);
    const wrong10 = [
      formatMoney(diff10 + 10),
      formatMoney(Math.max(1, diff10 - 10)),
      formatMoney(bigCoin10.value + smallCoin10.value),
    ];
    const options10 = shuffle([correctAnswer10, ...wrong10]);
    questions.push({
      text: `${bigCoin10.name} − ${smallCoin10.name} = ?`,
      options: options10,
      correctIndex: options10.indexOf(correctAnswer10),
      emoji: "➖",
    });
  }

  // Pick 10 random questions from the pool (or all if fewer)
  return shuffle(questions).slice(0, 10);
}

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(true);

  // Generate questions on mount
  useEffect(() => {
    setQuestions(generateQuestions());
  }, []);

  // Timer
  useEffect(() => {
    if (!timerActive || gameOver || showResult || questions.length === 0) return;
    if (timeLeft <= 0) {
      setShowResult(true);
      setTimerActive(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, gameOver, showResult, questions.length]);

  const handleSelect = useCallback(
    (index: number) => {
      if (showResult || questions.length === 0) return;
      setSelected(index);
      setShowResult(true);
      setTimerActive(false);

      if (index === questions[currentQ].correctIndex) {
        setScore((s) => s + 1);
        setShowStar(true);
        setTimeout(() => setShowStar(false), 1500);
      }
    },
    [showResult, currentQ, questions]
  );

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setGameOver(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowResult(false);
      setTimeLeft(15);
      setTimerActive(true);
    }
  };

  const handleRestart = () => {
    setQuestions(generateQuestions());
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setGameOver(false);
    setTimeLeft(15);
    setTimerActive(true);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-purple-600 animate-pulse">
          Loading quiz...
        </div>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="min-h-screen p-6">
      <StarBurst show={showStar} message="Correct!" />

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
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700">
              🏆 Quiz Challenge
            </h1>
            <p className="text-gray-500 font-medium">
              Test your money knowledge!
            </p>
          </div>
        </div>
        <ScoreDisplay score={score} total={questions.length} />
      </div>

      <div className="max-w-2xl mx-auto">
        {gameOver ? (
          /* Game Over Screen */
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border-2 border-purple-200 text-center">
            <div className="text-6xl mb-4">
              {score === questions.length
                ? "🏆"
                : score >= questions.length / 2
                  ? "🌟"
                  : "💪"}
            </div>
            <h2 className="text-3xl font-extrabold text-purple-700 mb-2">
              Quiz Complete!
            </h2>
            <p className="text-xl text-gray-600 font-semibold mb-2">
              You got{" "}
              <span className="text-purple-600 font-extrabold">
                {score}/{questions.length}
              </span>{" "}
              correct!
            </p>
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: questions.length }, (_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${i < score ? "" : "opacity-20"}`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-lg text-gray-500 font-medium mb-6">
              {score === questions.length
                ? "Perfect score! You're a money genius! 🎉"
                : score >= questions.length / 2
                  ? "Great job! Keep practising! 👏"
                  : "Good try! Play again to learn more! 💪"}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                Play Again! 🔄
              </button>
              <Link
                href="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold px-8 py-3 rounded-full text-lg transition-colors"
              >
                Home 🏠
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 bg-white/60 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQ + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-bold text-purple-600">
                {currentQ + 1}/{questions.length}
              </span>
            </div>

            {/* Timer */}
            <div className="flex justify-center mb-6">
              <div
                className={`bg-white/80 rounded-full px-5 py-2 shadow-md font-extrabold text-lg ${
                  timeLeft <= 5
                    ? "text-red-500 animate-pulse"
                    : "text-gray-600"
                }`}
              >
                ⏱️ {timeLeft}s
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-purple-100 mb-6">
              <div className="text-4xl text-center mb-4">{question.emoji}</div>
              <h2 className="text-xl font-extrabold text-gray-800 text-center mb-6">
                {question.text}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((option, index) => {
                  let btnClass =
                    "bg-white hover:bg-purple-50 border-2 border-purple-200 text-gray-700";

                  if (showResult) {
                    if (index === question.correctIndex) {
                      btnClass =
                        "bg-green-100 border-2 border-green-400 text-green-700";
                    } else if (
                      index === selected &&
                      index !== question.correctIndex
                    ) {
                      btnClass =
                        "bg-red-100 border-2 border-red-400 text-red-700";
                    } else {
                      btnClass =
                        "bg-gray-50 border-2 border-gray-200 text-gray-400";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(index)}
                      disabled={showResult}
                      className={`${btnClass} rounded-2xl p-4 font-bold text-lg transition-all duration-200 ${
                        !showResult ? "hover:scale-105 cursor-pointer" : ""
                      }`}
                    >
                      {option}
                      {showResult && index === question.correctIndex && " ✓"}
                      {showResult &&
                        index === selected &&
                        index !== question.correctIndex &&
                        " ✗"}
                    </button>
                  );
                })}
              </div>

              {/* Result message */}
              {showResult && (
                <div className="mt-6 text-center">
                  <p
                    className={`text-lg font-bold mb-4 ${
                      selected === question.correctIndex
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {selected === question.correctIndex
                      ? "🎉 Correct! Well done!"
                      : selected === null
                        ? "⏰ Time's up!"
                        : `Not quite! The answer is ${question.options[question.correctIndex]}`}
                  </p>
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    {currentQ + 1 >= questions.length
                      ? "See Results! 🏆"
                      : "Next Question →"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
