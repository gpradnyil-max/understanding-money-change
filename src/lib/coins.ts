export interface Coin {
  name: string;
  value: number; // in pence
  display: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  size: string; // tailwind width class
  description: string;
}

export const COINS: Coin[] = [
  {
    name: "1p",
    value: 1,
    display: "1p",
    emoji: "🪙",
    color: "#CD7F32",
    bgColor: "bg-amber-600",
    borderColor: "border-amber-700",
    size: "w-14 h-14",
    description: "One penny - the smallest coin!",
  },
  {
    name: "2p",
    value: 2,
    display: "2p",
    emoji: "🪙",
    color: "#CD7F32",
    bgColor: "bg-amber-700",
    borderColor: "border-amber-800",
    size: "w-16 h-16",
    description: "Two pence - a bigger copper coin!",
  },
  {
    name: "5p",
    value: 5,
    display: "5p",
    emoji: "🪙",
    color: "#C0C0C0",
    bgColor: "bg-gray-300",
    borderColor: "border-gray-400",
    size: "w-14 h-14",
    description: "Five pence - small and silver!",
  },
  {
    name: "10p",
    value: 10,
    display: "10p",
    emoji: "🪙",
    color: "#C0C0C0",
    bgColor: "bg-gray-300",
    borderColor: "border-gray-400",
    size: "w-16 h-16",
    description: "Ten pence - bigger silver coin!",
  },
  {
    name: "20p",
    value: 20,
    display: "20p",
    emoji: "🪙",
    color: "#C0C0C0",
    bgColor: "bg-gray-200",
    borderColor: "border-gray-400",
    size: "w-16 h-16",
    description: "Twenty pence - it has 7 sides!",
  },
  {
    name: "50p",
    value: 50,
    display: "50p",
    emoji: "🪙",
    color: "#C0C0C0",
    bgColor: "bg-gray-200",
    borderColor: "border-gray-300",
    size: "w-18 h-18",
    description: "Fifty pence - also has 7 sides!",
  },
  {
    name: "£1",
    value: 100,
    display: "£1",
    emoji: "🪙",
    color: "#FFD700",
    bgColor: "bg-yellow-400",
    borderColor: "border-yellow-500",
    size: "w-18 h-18",
    description: "One pound - gold and round!",
  },
  {
    name: "£2",
    value: 200,
    display: "£2",
    emoji: "🪙",
    color: "#FFD700",
    bgColor: "bg-yellow-300",
    borderColor: "border-yellow-500",
    size: "w-20 h-20",
    description: "Two pounds - gold and silver!",
  },
];

export function formatMoney(pence: number): string {
  if (pence >= 100) {
    const pounds = Math.floor(pence / 100);
    const remainingPence = pence % 100;
    if (remainingPence === 0) return `£${pounds}`;
    return `£${pounds}.${remainingPence.toString().padStart(2, "0")}`;
  }
  return `${pence}p`;
}
