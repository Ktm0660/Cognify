import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function IceCreamResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const { playerTotal = 0, aiTotal = 0, rounds = 0 } = location.state || {};

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
        <button className="results-button" onClick={() => navigate("/icecreamgame")}>Play Again</button>
        <button className="results-button" onClick={() => navigate("/")}>Home</button>
      </div>
    </div>
  );
}
