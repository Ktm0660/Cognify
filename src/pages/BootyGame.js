import React, { useState, useEffect } from "react";

export default function BootyGame() {
  const chestValue = 100;

  // ----- Setup states -----
  const [showSetup, setShowSetup] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [pirateName, setPirateName] = useState("");
  const [pirateColor, setPirateColor] = useState("#ff9800");
  const [totalRounds, setTotalRounds] = useState(6);
  const [difficulty, setDifficulty] = useState("Easy");

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
      let offer;
      if (difficulty === "Easy") {
        offer = Math.floor(Math.random() * 101); // completely random
      } else if (difficulty === "Medium") {
        const r = Math.random();
        if (r < 0.6) {
          offer = Math.floor(Math.random() * 21) + 40; // 40-60
        } else if (r < 0.9) {
          offer = Math.floor(Math.random() * 31) + 60; // 60-90
        } else {
          offer = Math.floor(Math.random() * 30) + 10; // 10-40
        }
      } else {
        // Hard: adapt to player's generosity
        const playerSplits = history.filter((h) => h.splitter === "player");
        const avgShare =
          playerSplits.reduce((s, h) => s + h.offer, 0) /
          Math.max(playerSplits.length, 1);
        const base = 70;
        offer = base - (50 - avgShare);
        if (offer < 20) offer = 20;
        if (offer > 80) offer = 80;
      }
      setAiOffer(Math.round(offer));
    }
  }, [splitter, decisionMade, currentRound, difficulty, history]);

  const handleSubmitProposal = () => {
    let accept;
    if (difficulty === "Easy") {
      accept = playerShare <= 80 || Math.random() < 0.2;
    } else if (difficulty === "Medium") {
      if (playerShare <= 60) accept = true;
      else if (playerShare <= 80) accept = Math.random() < 0.3;
      else if (playerShare <= 90) accept = Math.random() < 0.1;
      else accept = false;
    } else {
      const aiOffers = history.filter((h) => h.splitter === "ai");
      const acceptedCnt = aiOffers.filter((h) => h.accepted).length;
      const acceptanceRate = aiOffers.length
        ? acceptedCnt / aiOffers.length
        : 1;
      if (acceptanceRate > 0.9) {
        accept = true;
      } else {
        const playerSplits = history.filter((h) => h.splitter === "player");
        const avgShare =
          playerSplits.reduce((s, h) => s + h.offer, 0) /
          Math.max(playerSplits.length, 1);
        const threshold = Math.min(Math.max(avgShare, 50), 80);
        accept = playerShare <= threshold;
      }
    }
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
        <p style={{ color: pirateColor }}>
          {pirateName || "You"} collected {playerTotal} gold.
        </p>
        <p>AI collected {aiTotal} gold.</p>
        <p>Your average offer as splitter was {Math.round(avgOffer)} coins.</p>
        <p>You rejected {rejectedPositive} profitable offers.</p>
        <button onClick={() => window.location.reload()}>Play Again</button>
      </div>
    );
  }

  if (showSetup) {
    const roundOptions = [3, 5, 7, 10];
    const difficulties = ["Easy", "Medium", "Hard"];
    return (
      <div className="booty-config">
        <h2>🏴‍☠️ Choose Yer Details</h2>
        <input
          type="text"
          placeholder="Pirate name"
          value={pirateName}
          onChange={(e) => setPirateName(e.target.value)}
        />
        <p className="round-label">Pick yer flag color</p>
        <input
          type="color"
          value={pirateColor}
          onChange={(e) => setPirateColor(e.target.value)}
        />
        <p className="round-label">How many rounds?</p>
        <div className="round-selector">
          {roundOptions.map((r) => (
            <button
              key={r}
              className={`round-btn ${totalRounds === r ? "selected" : ""}`}
              onClick={() => setTotalRounds(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <p className="round-label">Difficulty</p>
        <div className="round-selector">
          {difficulties.map((d) => (
            <button
              key={d}
              className={`round-btn ${difficulty === d ? "selected" : ""}`}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          className="start-button"
          onClick={() => {
            setShowSetup(false);
            setShowInstructions(true);
            setCurrentRound(1);
            setSplitter(Math.random() < 0.5 ? "player" : "ai");
          }}
        >
          ☠️ Set Sail
        </button>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="booty-game">
        <div className="instructions-box">
          <h2>How to Play</h2>
          <p>
            Each round a chest of 100 gold coins appears. Whoever is the
            splitter proposes how to divide the booty. The other pirate may
            accept or reject the offer. If an offer is rejected, nobody gets any
            gold.
          </p>
          <p>
            Your goal is to leave with as much treasure as possible after {totalRounds}
            {" "}
            rounds. Sometimes fairness wins, sometimes greed does – choose
            wisely!
          </p>
          <button className="start-button" onClick={() => setShowInstructions(false)}>
            Begin!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booty-game">
      <h2>Round {currentRound} of {totalRounds}</h2>
      {!decisionMade && splitter === "player" && (
        <div className="proposal-box">
          <p style={{ color: pirateColor }}>
            {pirateName || "You"} are the splitter. Choose your share:
          </p>
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
          <p style={{ color: pirateColor }}>{pirateName || "You"} total: {playerTotal}</p>
          <p>AI total: {aiTotal}</p>
          <button onClick={handleNextRound}>{currentRound < totalRounds ? "Next Round" : "See Results"}</button>
        </div>
      )}
    </div>
  );
}
