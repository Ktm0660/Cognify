import { Timestamp } from "firebase/firestore";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatTimestamp(value: unknown): string {
  if (!value) {
    return "—";
  }

  let date: Date | null = null;

  if (value instanceof Date) {
    date = value;
  } else if (typeof Timestamp !== "undefined" && value instanceof Timestamp) {
    date = value.toDate();
  } else if (typeof value === "number") {
    date = new Date(value);
  } else if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      date = parsed;
    }
  } else if (typeof value === "object" && value !== null) {
    const maybeSeconds = (value as { seconds?: number; toDate?: () => Date | null }).seconds;
    if (typeof maybeSeconds === "number") {
      date = new Date(maybeSeconds * 1000);
    } else if (typeof (value as { toDate?: () => Date | null }).toDate === "function") {
      try {
        const converted = (value as { toDate: () => Date }).toDate();
        if (converted instanceof Date && !Number.isNaN(converted.getTime())) {
          date = converted;
        }
      } catch {
        // ignore
      }
    }
  }

  if (!date || Number.isNaN(date.getTime())) {
    return "—";
  }

  return dateFormatter.format(date);
}
