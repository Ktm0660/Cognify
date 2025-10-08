import React from "react";
import { cn } from "@/lib/cn";

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...rest }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
        "hover:shadow-md transition-shadow",
        className
      )}
      {...rest}
    />
  );
}
