import * as React from "react";

const SIZE = 280;
const PADDING = 32;

type Value = {
  label: string;
  value: number;
};

type Props = {
  values: Value[];
};

function polarToCartesian(
  index: number,
  count: number,
  radius: number,
  center: number
): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  const x = center + radius * Math.cos(angle);
  const y = center + radius * Math.sin(angle);
  return { x, y };
}

export default function RadarSix({ values }: Props) {
  const count = values.length;
  if (count === 0) {
    return null;
  }
  const center = SIZE / 2;
  const radius = center - PADDING;

  const ringLevels = [1 / 3, 2 / 3, 1];

  const polygonPoints = (scale: number) =>
    values
      .map((_, index) => {
        const { x, y } = polarToCartesian(index, count, radius * scale, center);
        return `${x},${y}`;
      })
      .join(" ");

  const filledPoints = values
    .map((value, index) => {
      const scaledRadius = radius * Math.max(0, Math.min(1, value.value));
      const { x, y } = polarToCartesian(index, count, scaledRadius, center);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="inline-flex flex-col items-center">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="text-slate-300"
        role="img"
        aria-label="Pillar accuracy radar chart"
      >
        <title>Pillar accuracy radar chart</title>
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.7" />
          </radialGradient>
        </defs>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.2} />
        {ringLevels.map((level) => (
          <polygon
            key={`grid-${level}`}
            points={polygonPoints(level)}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.3}
          />
        ))}
        {values.map((value, index) => {
          const { x, y } = polarToCartesian(index, count, radius, center);
          return (
            <line
              key={`axis-${value.label}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth={1}
              opacity={0.3}
            />
          );
        })}
        <polygon points={filledPoints} fill="url(#radarGradient)" stroke="none" opacity={0.9} />
        {values.map((value, index) => {
          const scaledRadius = radius * Math.max(0, Math.min(1, value.value));
          const { x, y } = polarToCartesian(index, count, scaledRadius, center);
          return (
            <circle
              key={`point-${value.label}`}
              cx={x}
              cy={y}
              r={4}
              fill="#1e293b"
              stroke="white"
              strokeWidth={1.5}
            />
          );
        })}
        {values.map((value, index) => {
          const { x, y } = polarToCartesian(index, count, radius + 16, center);
          const anchor = Math.abs(x - center) < 10 ? "middle" : x > center ? "start" : "end";
          return (
            <text
              key={`label-${value.label}`}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline={y < center ? "baseline" : "hanging"}
              className="fill-slate-600 text-xs"
            >
              {value.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
