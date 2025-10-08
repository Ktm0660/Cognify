import React, { useMemo } from "react";
import { useRouter } from "next/router";

export default function IceCreamResults() {
  const router = useRouter();
  const { playerTotal: playerTotalQuery, aiTotal: aiTotalQuery, rounds: roundsQuery } = router.query;

  const playerTotal = useMemo(() => {
    if (typeof playerTotalQuery === "string") {
      const parsed = parseInt(playerTotalQuery, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }, [playerTotalQuery]);

  const aiTotal = useMemo(() => {
    if (typeof aiTotalQuery === "string") {
      const parsed = parseInt(aiTotalQuery, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }, [aiTotalQuery]);

  const rounds = useMemo(() => {
    if (typeof roundsQuery === "string") {
      const parsed = parseInt(roundsQuery, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }, [roundsQuery]);

  const maxCombined = rounds * 600; // Both charge $5 each round
  const combinedTotal = playerTotal + aiTotal;
  const percentOfMax = maxCombined ? Math.round((combinedTotal / maxCombined) * 100) : 0;

  return (
    <div className="icecream-results">
      <div className="results-box">
        <h2>🏁 Game Over</h2>
        <p><strong>Your Profit:</strong> ${playerTotal}</p>
        <p><strong>AI Profit:</strong> ${aiTotal}</p>
        <p><strong>Combined Profit:</strong> ${combinedTotal}</p>
        <p><strong>Max Possible Profit:</strong> ${maxCombined}</p>
        <p>
          Together you achieved <strong>{percentOfMax}%</strong> of the maximum
          possible profit.
        </p>
        <button className="results-button" onClick={() => router.push("/IceCreamConfig")}>Play Again</button>
        <button className="results-button" onClick={() => router.push("/")}>Home</button>
      </div>
    </div>
  );
}
