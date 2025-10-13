import { useCallback, useEffect, useRef, useState } from "react";

export function useItemTimer() {
  const startRef = useRef<number>(Date.now());
  const [elapsedMs, setElapsedMs] = useState(0);

  const tick = useCallback(() => {
    setElapsedMs(Date.now() - startRef.current);
  }, []);

  const reset = useCallback(() => {
    startRef.current = Date.now();
    setElapsedMs(0);
  }, []);

  useEffect(() => {
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [tick]);

  return {
    elapsedMs,
    reset,
    get startedAt() {
      return startRef.current;
    },
  };
}
