import React from "react";
import { cn } from "@/lib/cn";

type Props = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export default function ConfidenceSlider({ value, onChange, disabled = false }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">How confident are you?</span>
        <span className="text-slate-500">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className={cn(
          "w-full appearance-none rounded-lg bg-gradient-to-r from-indigo-200 via-fuchsia-200 to-amber-200",
          "accent-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50"
        )}
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}
