import React from "react";
import { cn } from "@/lib/cn";

type Props = React.HTMLAttributes<HTMLSpanElement>;

export default function Pill({ className, children, ...rest }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm",
        "backdrop-blur",
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
