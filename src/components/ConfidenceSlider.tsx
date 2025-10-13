import React from "react";

type ConfidenceSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function ConfidenceSlider({ value, onChange }: ConfidenceSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">How confident are you?</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-indigo-500"
      />
      <div className="flex justify-between text-xs text-slate-500">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}
