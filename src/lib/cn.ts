/**
 * Minimal className joiner to replace `clsx` without adding a dependency.
 * Filters out falsy values and joins the rest with spaces.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
