import React from "react";
import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "gradient";
  loading?: boolean;
};

export default function Button({
  className,
  variant = "primary",
  loading = false,
  children,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants: Record<NonNullable<Props["variant"]>, string> = {
    primary:
      "bg-slate-900 text-white hover:shadow-lg hover:shadow-slate-900/20 focus:ring-slate-900",
    secondary:
      "bg-white text-slate-900 border border-slate-200 hover:shadow-lg hover:shadow-slate-200/60 focus:ring-slate-300",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-300",
    gradient:
      "text-white bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 shadow-md hover:shadow-lg focus:ring-fuchsia-400",
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      aria-busy={loading ? "true" : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}
