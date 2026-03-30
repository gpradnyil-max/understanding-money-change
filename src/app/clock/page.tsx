"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AnalogueClock from "@/components/AnalogueClock";
import StarBurst from "@/components/StarBurst";
import ScoreDisplay from "@/components/ScoreDisplay";

interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  emoji: string;
  clockHours?: number;
  clockMinutes?: number;
  showClock: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(hours: number, minutes: number): string {
  const h = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const m = minutes.toString().padStart(2, "0");
  return `${h}:${m}`;
}

function formatTimeWords(hours: number, minutes: number): string {
  const h = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  if (minutes === 0) return `${h} o'clock`;
  if (minutes === 15) return `quarter past ${h}`;
  if (minutes === 30) return `half past ${h}`;
  if (minutes === 45) {
    const nextH = h === 12 ? 1 : h + 1;
    return `quarter to ${nextH}`;
  }
  return `${h}:${minutes.toString().padStart(2, "0")}`;
}

function randomHour(): number {
  return Math.floor(Math.random() * 12) + 1;
}

// Minutes suitable for an 8-year-old: o'clock, quarter, half, 5-min intervals
function randomMinutes(): number {
  const options = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  return options[Math.floor(Math.random() * options.length)];
}

function addMinutes(h: number, m: number, addMins: number): { hours: number; minutes: number } {
  let totalMins = h * 60 + m + addMins;
  if (totalMins >= 12 * 60) totalMins -= 12 * 60;
  if (totalMins < 0) totalMins += 12 * 60;
  return {
    hours: Math.floor(totalMins / 60) || 12,
    minutes: totalMins % 60,
  };
}

function generateWrongTimes(correctH: number, correctM: number): string[] {
  const wrongs: string[] = [];
  const offsets = shuffle([1, -1, 2, -2, 3]);
  for (const off of offsets) {
    if (wrongs.length >= 3) break;
    // Shift hours
    let wH = correctH + off;
    if (wH > 12) wH -= 12;
    if (wH <= 0) wH += 12;
    const candidate = formatTime(wH, correctM);
    if (candidate !== formatTime(correctH, correctM) && !wrongs.includes(candidate)) {
      wrongs.push(candidate);
    }
  }
  // Shift minutes if needed
  const minuteOffsets = shuffle([5, -5, 15, -15, 30]);
  for (const off of minuteOffsets) {
    if (wrongs.length >= 3) break;
    const result = addMinutes(correctH, correctM, off);
    const candidate = formatTime(result.hours, result.minutes);
    if (candidate !== formatTime(correctH, correctM) && !wrongs.includes(candidate)) {
      wrongs.push(candidate);
    }
  }
  return wrongs.slice(0, 3);
}

function generateClockQuestions(): Question[] {
  const questions: Question[] = [];

  // Type 1: Read the clock (show analogue, ask what time)
  {
    const h = randomHour();
    const m = randomMinutes();
    const correct = formatTime(h, m);
    const wrongs = generateWrongTimes(h, m);
    const options = shuffle([correct, ...wrongs]);
    questions.push({
      text: "What time does this clock show?",
      options,
      correctIndex: options.indexOf(correct),
      emoji: "🕐",
      clockHours: h,
      clockMinutes: m,
      showClock: true,
    });
  }

  // Type 2: Read the clock with words (quarter past, half past, etc.)
  {
    const specialMins = [0, 15, 30, 45];
    const m = specialMins[Math.floor(Math.random() * specialMins.length)];
    const h = randomHour();
    const correct = formatTimeWords(h, m);
    const wrongOptions: string[] = [];
    const otherHours = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(x => x !== h));
    // Wrong hour same minute pattern
    wrongOptions.push(formatTimeWords(otherHours[0], m));
    // Same hour wrong minute pattern
    const otherMins = specialMins.filter(x => x !== m);
    wrongOptions.push(formatTimeWords(h, otherMins[Math.floor(Math.random() * otherMins.length)]));
    wrongOptions.push(formatTimeWords(otherHours[1], otherMins[Math.floor(Math.random() * otherMins.length)]));
    const options = shuffle([correct, ...wrongOptions.slice(0, 3)]);
    questions.push({
      text: "What time does this clock show?",
      options,
      correctIndex: options.indexOf(correct),
      emoji: "🕑",
      clockHours: h,
      clockMinutes: m,
      showClock: true,
    });
  }

  // Type 3: Read the clock (another random time for practice)
  {
    const h = randomHour();
    const m = randomMinutes();
    const correct = formatTime(h, m);
    const wrongs = generateWrongTimes(h, m);
    const options = shuffle([correct, ...wrongs]);
    questions.push({
      text: "Can you read this clock?",
      options,
      correctIndex: options.indexOf(correct),
      emoji: "🕐",
      clockHours: h,
      clockMinutes: m,
      showClock: true,
    });
  }

  // Type 4: Time addition (easy - add 30 min or 1 hour)
  {
    const h = randomHour();
    const m = [0, 15, 30][Math.floor(Math.random() * 3)];
    const addAmounts = [15, 30, 60];
    const addAmount = addAmounts[Math.floor(Math.random() * addAmounts.length)];
    const result = addMinutes(h, m, addAmount);
    const correct = formatTime(result.hours, result.minutes);
    const wrongs = generateWrongTimes(result.hours, result.minutes);
    const options = shuffle([correct, ...wrongs]);
    const addText = addAmount === 60 ? "1 hour" : `${addAmount} minutes`;
    questions.push({
      text: `It is ${formatTime(h, m)}. What time will it be in ${addText}?`,
      options,
      correctIndex: options.indexOf(correct),
      emoji: "⏩",
      clockHours: h,
      clockMinutes: m,
      showClock: true,
    });
  }

  // Type 5: Time addition (harder - add 25, 35, 45 mins)
  {
    const h = randomHour();
    const m = randomMinutes();
    const addAmounts = [20, 25, 35, 40, 45];
    const addAmount = addAmounts[Math.floor(Math.random() * addAmounts.length)];
    const result = addMinutes(h, m, addAmount);
    const correct = formatTime(result.hours, result.minutes);
    const wrongs = generateWrongTimes(result.hours, result.minutes);
    const options = shuffle([correct, ...wrongs]);
    questions.push({
      text: `It is ${formatTime(h, m)}. What time will it be in ${addAmount} minutes?`,
      options,
      correctIndex: options.indexOf(correct),
      emoji: "🔥",
      clockHours: h,
      clockMinutes: m,
      showClock: true,
    });
  }

  // Type 6: Time subtraction (easy - go back 15, 30, or 60 mins)
  {
    const h = randomHour();
    const m = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const subAmounts = [15, 30, 60];
    const subAmount = subAmounts[Math.floor(Math.random() * subAmounts.length)];
    const result = addMinutes(h, m, -subAmount);
    const correct = formatTime(result.hours, result.minutes);
    const wrongs = generateWrongTimes(result.hours, result.minutes);
    const options = shuffle([correct, ...wrongs]);
    const subText = subAmount === 60 ? "1 hour" : `${subAmount} minutes`;
    questions.push({
      text: `It is ${formatTime(h, m)}. What time was it ${subText} ago?`,
      options,
      correctIndex: options.indexOf(correct),
      emoji: "⏪",
      clockHours: h,
      clockMinutes: m,
      showClock: true,
    });
  }

  // Type 7: Time subtraction (harder)
  {
    const h = randomHour();
    const m = randomMinutes();
    const subAmounts = [20, 25, 35, 40, 45];
    const subAmount = subAmounts[Math.floor(Math.random() * subAmounts.length)];
    const result = addMinutes(h, m, -subAmount);
    const correct = formatTime(result.hours, result.minutes);
    const wrongs = generateWrongTimes(result.hours, result.minutes);
    const options = shuffle([correct, ...wrongs]);
    questions.push({
      text: `It is ${formatTime(h, m)}. What time was it ${subAmount} minutes ago?`,
      options,
      correctIndex: options.indexOf(correct),
      emoji: "🧠",
      clockHours: h,
      clockMinutes: m,
      showClock: true,
    });
  }

  // Type 8: How many minutes between two times?
  {
    const h1 = randomHour();
    const m1 = [0, 15, 30][Math.floor(Math.random() * 3)];
    const gaps = [15, 20, 25, 30, 45, 60];
    const gap = gaps[Math.floor(Math.random() * gaps.length)];
    const t2 = addMinutes(h1, m1, gap);
    const correct = gap === 60 ? "1 hour" : `${gap} minutes`;
    const wrongGaps = shuffle(gaps.filter(g => g !== gap)).slice(0, 3);
    const wrongs = wrongGaps.map(g => g === 60 ? "1 hour" : `${g} minutes`);
    const options = shuffle([correct, ...wrongs]);
    questions.push({
      text: `How long is it from ${formatTime(h1, m1)} to ${formatTime(t2.hours, t2.minutes)}?`,
      options,
      correctIndex: options.indexOf(correct),
      emoji: "⏱️",
      showClock: false,
    });
  }

  // Type 9: What does the hour hand point to?
  {
    const h = randomHour();
    const correct = `${h}`;
    const wrongs = shuffle(
      Array.from({ length: 12 }, (_, i) => `${i + 1}`).filter(x => x !== correct)
    ).slice(0, 3);
    const options = shuffle([correct, ...wrongs]);
    questions.push({
      text: "What number does the short (hour) hand point to?",
      options,
      correctIndex: options.indexOf(correct),
      emoji: "👆",
      clockHours: h,
      clockMinutes: 0,
      showClock: true,
    });
  }

  // Type 10: Minutes past the hour
  {
    const h = randomHour();
    const m = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][
      Math.floor(Math.random() * 11)
    ];
    const correct = `${m} minutes`;
    const wrongMins = shuffle(
      [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].filter(x => x !== m)
    ).slice(0, 3);
    const wrongs = wrongMins.map(x => `${x} minutes`);
    const options = shuffle([correct, ...wrongs]);
    questions.push({
      text: `This clock shows ${formatTime(h, m)}. How many minutes past ${h} is it?`,
      options,
      correctIndex: options.indexOf(correct),
      emoji: "🔢",
      clockHours: h,
      clockMinutes: m,
      showClock: true,
    });
  }

  return shuffle(questions).slice(0, 10);
}

export default function ClockQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    setQuestions(generateClockQuestions());
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
      setTimeLeft(20);
      setTimerActive(true);
    }
  };

  const handleRestart = () => {
    setQuestions(generateClockQuestions());
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setGameOver(false);
    setTimeLeft(20);
    setTimerActive(true);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-indigo-600 animate-pulse">
          Loading clock quiz...
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
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-700">
              🕐 Clock Time
            </h1>
            <p className="text-gray-500 font-medium">
              Learn to read clocks and tell the time!
            </p>
          </div>
        </div>
        <ScoreDisplay score={score} total={questions.length} />
      </div>

      <div className="max-w-2xl mx-auto">
        {gameOver ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border-2 border-indigo-200 text-center">
            <div className="text-6xl mb-4">
              {score === questions.length
                ? "🏆"
                : score >= questions.length / 2
                  ? "🌟"
                  : "💪"}
            </div>
            <h2 className="text-3xl font-extrabold text-indigo-700 mb-2">
              Quiz Complete!
            </h2>
            <p className="text-xl text-gray-600 font-semibold mb-2">
              You got{" "}
              <span className="text-indigo-600 font-extrabold">
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
                ? "Perfect score! You're a time-telling genius! 🎉"
                : score >= questions.length / 2
                  ? "Great job! Keep practising your clock skills! 👏"
                  : "Good try! Play again to get better at telling time! 💪"}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow"
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
                  className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQ + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-bold text-indigo-600">
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
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-indigo-100 mb-6">
              <div className="text-4xl text-center mb-4">{question.emoji}</div>

              {/* Analogue Clock Display */}
              {question.showClock && question.clockHours !== undefined && question.clockMinutes !== undefined && (
                <div className="flex justify-center mb-6">
                  <div className="bg-indigo-50 rounded-3xl p-4 shadow-inner">
                    <AnalogueClock
                      hours={question.clockHours}
                      minutes={question.clockMinutes}
                      size={180}
                    />
                  </div>
                </div>
              )}

              <h2 className="text-xl font-extrabold text-gray-800 text-center mb-6">
                {question.text}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((option, index) => {
                  let btnClass =
                    "bg-white hover:bg-indigo-50 border-2 border-indigo-200 text-gray-700";

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
                    className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow"
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
