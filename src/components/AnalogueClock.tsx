"use client";

interface AnalogueClockProps {
  hours: number;   // 1-12
  minutes: number; // 0-59
  size?: number;
}

export default function AnalogueClock({ hours, minutes, size = 200 }: AnalogueClockProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.42;

  // Calculate angles
  const minuteAngle = (minutes / 60) * 360 - 90;
  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30 - 90;

  // Hand endpoints
  const minuteLength = radius * 0.82;
  const hourLength = radius * 0.55;

  const minuteX = cx + minuteLength * Math.cos((minuteAngle * Math.PI) / 180);
  const minuteY = cy + minuteLength * Math.sin((minuteAngle * Math.PI) / 180);
  const hourX = cx + hourLength * Math.cos((hourAngle * Math.PI) / 180);
  const hourY = cy + hourLength * Math.sin((hourAngle * Math.PI) / 180);

  // Number positions
  const numbers = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const angle = ((num / 12) * 360 - 90) * (Math.PI / 180);
    const numRadius = radius * 0.78;
    return {
      num,
      x: cx + numRadius * Math.cos(angle),
      y: cy + numRadius * Math.sin(angle),
    };
  });

  // Tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = ((i / 60) * 360 - 90) * (Math.PI / 180);
    const isHour = i % 5 === 0;
    const outerR = radius * 0.95;
    const innerR = isHour ? radius * 0.85 : radius * 0.9;
    return {
      x1: cx + innerR * Math.cos(angle),
      y1: cy + innerR * Math.sin(angle),
      x2: cx + outerR * Math.cos(angle),
      y2: cy + outerR * Math.sin(angle),
      isHour,
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Clock face */}
      <circle cx={cx} cy={cy} r={radius + 8} fill="#6366f1" />
      <circle cx={cx} cy={cy} r={radius + 4} fill="#818cf8" />
      <circle cx={cx} cy={cy} r={radius} fill="white" />

      {/* Tick marks */}
      {ticks.map((tick, i) => (
        <line
          key={i}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke={tick.isHour ? "#4338ca" : "#c7d2fe"}
          strokeWidth={tick.isHour ? 2.5 : 1}
          strokeLinecap="round"
        />
      ))}

      {/* Numbers */}
      {numbers.map(({ num, x, y }) => (
        <text
          key={num}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#4338ca"
          fontSize={size * 0.09}
          fontWeight="800"
          fontFamily="Nunito, sans-serif"
        >
          {num}
        </text>
      ))}

      {/* Hour hand */}
      <line
        x1={cx}
        y1={cy}
        x2={hourX}
        y2={hourY}
        stroke="#4338ca"
        strokeWidth={size * 0.04}
        strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1={cx}
        y1={cy}
        x2={minuteX}
        y2={minuteY}
        stroke="#7c3aed"
        strokeWidth={size * 0.025}
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={size * 0.03} fill="#4338ca" />
      <circle cx={cx} cy={cy} r={size * 0.015} fill="#fbbf24" />
    </svg>
  );
}
