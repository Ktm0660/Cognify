import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { awardPoints, hasPlayedVersion } from "../utils/points";

export default function IceCreamResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const { playerTotal = 0, aiTotal = 0, rounds = 0, difficulty = "Easy" } = location.state || {};
  const [pointsEarned, setPointsEarned] = useState(0);

  const maxCombined = rounds * 600; // Both charge $5 each round
  const combinedTotal = playerTotal + aiTotal;
  const percentOfMax = maxCombined ? Math.round((combinedTotal / maxCombined) * 100) : 0;

  useEffect(() => {
    const award = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const baseVersion = `diff_${difficulty}`;
      const played = await hasPlayedVersion(user.uid, "iceCreamBattle", baseVersion);
      const basePoints = playerTotal;
      const points = played ? Math.round(basePoints * 0.5) : basePoints;
      const versionId = played ? `${baseVersion}_${Date.now()}` : baseVersion;
      await awardPoints(user.uid, "iceCreamBattle", points, versionId);
      setPointsEarned(points);
    };
    award();
  }, [difficulty, playerTotal]);

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
        <p><strong>Points Earned:</strong> {pointsEarned}</p>
        <button className="results-button" onClick={() => navigate("/icecreamgame")}>Play Again</button>
        <button className="results-button" onClick={() => navigate("/")}>Home</button>
      </div>
    </div>
  );
}
