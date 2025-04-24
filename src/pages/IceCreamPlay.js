import { useLocation } from "react-router-dom";
import React, { useState } from "react";


export default function IceCreamPlay() {
  const location = useLocation();
  const { avatar, rounds } = location.state || {};
  const [currentRound, setCurrentRound] = useState(1);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [aiTotal, setAiTotal] = useState(0);
  const [showResult, setShowResult] = useState(false);

  function handlePlayerChoice(choice) {
    const ai = Math.random() < 0.5 ? 3 : 5;
    setPlayerChoice(choice);
    setAiChoice(ai);
  
    let playerEarned = 0;
    let aiEarned = 0;
  
    if (choice === 5 && ai === 5) {
      playerEarned = 300;
      aiEarned = 300;
    } else if (choice === 3 && ai === 5) {
      playerEarned = 500;
      aiEarned = 0;
    } else if (choice === 5 && ai === 3) {
      playerEarned = 0;
      aiEarned = 500;
    } else if (choice === 3 && ai === 3) {
      playerEarned = 100;
      aiEarned = 100;
    }
  
    setPlayerTotal((prev) => prev + playerEarned);
    setAiTotal((prev) => prev + aiEarned);
  
    setShowResult(true);
  }

  function handleNextRound() {
    if (currentRound < rounds) {
      setCurrentRound((prev) => prev + 1);
      setPlayerChoice(null);
      setAiChoice(null);
      setShowResult(false);
    } else {
      // Game over — you can redirect or display final results
      alert(`Game Over!\nFinal Score:\nYou: $${playerTotal}\nAI: $${aiTotal}`);
    }
  }
  
  

  return (
    <div className="icecream-play">
      <h1>🍦 Ice Cream Battle: Day {currentRound} of {rounds}</h1>
      <p>Your avatar: {avatar}</p>
  
      {!showResult && (
        <div className="choice-buttons">
          <button onClick={() => handlePlayerChoice(3)}>$3</button>
          <button onClick={() => handlePlayerChoice(5)}>$5</button>
        </div>
      )}
  
      {showResult && (
        <div className="result-display">
          <h2>📊 Day {currentRound} Results</h2>
  
          <div className="choice-row">
            <p><strong>You:</strong> {avatar} chose <span className="price">${playerChoice}</span></p>
            <p><strong>AI:</strong> 🤖 chose <span className="price">${aiChoice}</span></p>
          </div>
  
          <div className="earnings">
            <p>💵 You earned: <strong>
              {playerChoice === 5 && aiChoice === 5
                ? "$300"
                : playerChoice === 3 && aiChoice === 5
                ? "$500"
                : playerChoice === 5 && aiChoice === 3
                ? "$0"
                : "$100"}
            </strong></p>
  
            <p>💵 AI earned: <strong>
              {playerChoice === 5 && aiChoice === 5
                ? "$300"
                : playerChoice === 3 && aiChoice === 5
                ? "$0"
                : playerChoice === 5 && aiChoice === 3
                ? "$500"
                : "$100"}
            </strong></p>
          </div>
  
          <div className="totals">
            <p>Total Earnings:</p>
            <p><strong>You:</strong> ${playerTotal} &nbsp;&nbsp; | &nbsp;&nbsp; <strong>AI:</strong> ${aiTotal}</p>
          </div>
  
          <button onClick={handleNextRound} className="next-button">
            {currentRound < rounds ? "➡️ Next Day" : "🏁 See Final Results"}
          </button>
        </div>
      )}
    </div>
  );
}  