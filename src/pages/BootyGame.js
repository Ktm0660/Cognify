import React, { useState, useEffect } from "react";

export default function BootyGame() {
  const totalRounds = 6; // fixed number of rounds
  const chestValue = 100;

  const [currentRound, setCurrentRound] = useState(1);
  const [splitter, setSplitter] = useState(Math.random() < 0.5 ? "player" : "ai");
  const [playerShare, setPlayerShare] = useState(50);
  const [aiOffer, setAiOffer] = useState(null);
  const [decisionMade, setDecisionMade] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [playerTotal, setPlayerTotal] = useState(0);
  const [aiTotal, setAiTotal] = useState(0);
  const [history, setHistory] = useState([]);

  // generate AI offer when it's AI's turn to split
  useEffect(() => {
    if (splitter === "ai" && !decisionMade) {
      const offer = Math.floor(Math.random() * 61) + 20; // AI keeps 20-80
      setAiOffer(offer);
    }
  }, [splitter, decisionMade, currentRound]);

  const handleSubmitProposal = () => {
    const accept = playerShare <= 70; // AI accepts if it gets at least 30
    setDecisionMade(true);
    setAccepted(accept);
    if (accept) {
      setPlayerTotal((prev) => prev + playerShare);
      setAiTotal((prev) => prev + (chestValue - playerShare));
    }
    setHistory((prev) => [
      ...prev,
      { round: currentRound, splitter: "player", offer: playerShare, accepted: accept },
    ]);
  };

  const handlePlayerDecision = (accept) => {
    setDecisionMade(true);
    setAccepted(accept);
    if (accept) {
      setPlayerTotal((prev) => prev + (chestValue - aiOffer));
      setAiTotal((prev) => prev + aiOffer);
    }
    setHistory((prev) => [
      ...prev,
      { round: currentRound, splitter: "ai", offer: aiOffer, accepted: accept },
    ]);
  };

  const handleNextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound((prev) => prev + 1);
      setSplitter(splitter === "player" ? "ai" : "player");
      setDecisionMade(false);
      setAccepted(false);
    } else {
      setGameOver(true);
    }
  };

  const avgOffer = history.filter((h) => h.splitter === "player").reduce((sum, h) => sum + h.offer, 0) / Math.max(history.filter((h) => h.splitter === "player").length, 1);
  const rejectedPositive = history.filter((h) => h.splitter === "ai" && !h.accepted && (chestValue - h.offer) > 0).length;

  if (gameOver) {
    return (
      <div className="booty-game">
        <h2>🏴‍☠️ Game Over</h2>
        <p>You collected {playerTotal} gold.</p>
        <p>AI collected {aiTotal} gold.</p>
        <p>Your average offer as splitter was {Math.round(avgOffer)} coins.</p>
        <p>You rejected {rejectedPositive} profitable offers.</p>
        <button onClick={() => window.location.reload()}>Play Again</button>
      </div>
    );
  }

  return (
    <div className="booty-game">
      <h2>Round {currentRound} of {totalRounds}</h2>
      {!decisionMade && splitter === "player" && (
        <div className="proposal-box">
          <p>You are the splitter. Choose your share:</p>
          <input type="range" min="0" max="100" value={playerShare} onChange={(e) => setPlayerShare(Number(e.target.value))} />
          <p>You keep {playerShare} coins, AI gets {chestValue - playerShare} coins.</p>
          <button onClick={handleSubmitProposal}>Propose Split</button>
        </div>
      )}

      {!decisionMade && splitter === "ai" && (
        <div className="proposal-box">
          <p>AI proposes to keep {aiOffer} coins and give you {chestValue - aiOffer} coins.</p>
          <button onClick={() => handlePlayerDecision(true)}>Accept</button>
          <button onClick={() => handlePlayerDecision(false)}>Reject</button>
        </div>
      )}

      {decisionMade && (
        <div className="result-box">
          {accepted ? <p>Offer accepted!</p> : <p>Offer rejected! No one gets coins.</p>}
          <p>Your total: {playerTotal}</p>
          <p>AI total: {aiTotal}</p>
          <button onClick={handleNextRound}>{currentRound < totalRounds ? "Next Round" : "See Results"}</button>
        </div>
      )}
    </div>
  );
}
