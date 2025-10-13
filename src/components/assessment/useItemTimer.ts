import { useEffect, useState } from "react";

export function useItemTimer(trigger: unknown) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [startedAt, setStartedAt] = useState<Date>(new Date());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const start = performance.now();
    setStartedAt(new Date());
    setElapsedMs(0);

    const interval = window.setInterval(() => {
      setElapsedMs(performance.now() - start);
    }, 100);

    return () => {
      window.clearInterval(interval);
    };
  }, [trigger]);

  return { elapsedMs, startedAt };
}
